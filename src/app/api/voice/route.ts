import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { nanoid } from 'nanoid';
import { DISPATCH_MODEL, DISPATCH_SYSTEM_PROMPT, ROUTE_TOOL } from '@/lib/prompt';
import { resolveGuest, escalatePriority } from '@/lib/crm/lookup';
import { getRequests } from '@/lib/store';
import { postToTeams } from '@/lib/teams';
import type { DispatchRequest, Department, Priority } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 30;

const STT_URL = 'https://api.elevenlabs.io/v1/speech-to-text';

interface Routing {
  department: Department;
  priority: Priority;
  summary: string;
  room: string;
  eta_minutes: number;
  acknowledgment: string;
}

/**
 * Real voice pipeline: audio → ElevenLabs STT → Claude.
 *
 * Claude decides what the staff member meant: a NEW service request → it calls
 * route_request and we return an enriched DispatchRequest for the board; a
 * QUESTION or status remark ("what are my action items") → it answers in prose
 * and we return that spoken reply with no card.
 */
export async function POST(req: Request) {
  try {
    const elevenKey = process.env.ELEVENLABS_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!elevenKey || !anthropicKey) {
      return NextResponse.json(
        { error: 'Voice services are not configured.' },
        { status: 500 },
      );
    }

    const form = await req.formData();
    const audio = form.get('audio');
    if (!(audio instanceof Blob) || audio.size < 1200) {
      return NextResponse.json(
        { error: "Didn't catch that — hold the button and speak." },
        { status: 400 },
      );
    }

    // 1. Speech-to-text (English-pinned to avoid script misdetection).
    const sttForm = new FormData();
    sttForm.append('model_id', 'scribe_v1');
    sttForm.append('language_code', 'eng');
    sttForm.append('file', audio, 'recording.webm');
    const sttRes = await fetch(STT_URL, {
      method: 'POST',
      headers: { 'xi-api-key': elevenKey },
      body: sttForm,
    });
    if (!sttRes.ok) {
      return NextResponse.json(
        { error: `Transcription failed (${sttRes.status}).` },
        { status: 502 },
      );
    }
    const transcript = (((await sttRes.json()) as { text?: string }).text ?? '').trim();
    if (!transcript) {
      return NextResponse.json(
        { error: "Didn't hear anything — try again." },
        { status: 422 },
      );
    }

    // 2. Claude decides: dispatch a new request, or answer a staff question.
    //    The current board is passed so questions can be answered accurately.
    const board = (await getRequests()).filter((r) => r.status !== 'resolved');
    const boardSummary = board.length
      ? board
          .map(
            (r) =>
              `- [${r.priority}] ${r.department}, room ${r.room}: ${r.summary} (${r.status})`,
          )
          .join('\n')
      : '(no active requests)';

    // Prior turns of this hold-to-talk conversation. Each press is otherwise a
    // fresh, stateless request — threading the history gives Üchá memory across
    // separate presses, so "I'll take that one" knows what "that one" is.
    let history: { role: 'user' | 'assistant'; content: string }[] = [];
    const rawHistory = form.get('history');
    if (typeof rawHistory === 'string') {
      try {
        const parsed = JSON.parse(rawHistory);
        if (Array.isArray(parsed)) {
          history = parsed
            .filter(
              (m) =>
                m &&
                (m.role === 'user' || m.role === 'assistant') &&
                typeof m.content === 'string' &&
                m.content.trim(),
            )
            .slice(-12);
        }
      } catch {
        /* malformed history — proceed without it */
      }
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey });
    const message = await anthropic.messages.create({
      model: DISPATCH_MODEL,
      max_tokens: 600,
      temperature: 0,
      // The board goes in the system prompt so each conversation turn stays a
      // clean transcript and history doesn't carry stale board snapshots.
      system: `${DISPATCH_SYSTEM_PROMPT}\n\nCURRENT BOARD (live):\n${boardSummary}`,
      tools: [ROUTE_TOOL],
      messages: [...history, { role: 'user', content: transcript }],
    });

    // No tool call → a question or status remark. Return the spoken reply, no card.
    const toolUse = message.content.find((b) => b.type === 'tool_use');
    if (!toolUse || toolUse.type !== 'tool_use') {
      const textBlock = message.content.find((b) => b.type === 'text');
      const reply =
        textBlock && textBlock.type === 'text' && textBlock.text.trim()
          ? textBlock.text.trim()
          : "I didn't catch a request there — try again.";
      return NextResponse.json({ reply, transcript });
    }
    const routing = toolUse.input as Routing;

    // 3. CRM enrichment — resolve the guest and escalate for Pinnacle VIPs.
    const guest = resolveGuest(routing.room ?? '');
    let priority = routing.priority;
    let escalated = false;
    if (guest && guest.tier === 'Pinnacle' && priority !== 'urgent') {
      priority = escalatePriority(priority);
      escalated = true;
    }

    let acknowledgment = routing.acknowledgment;
    if (guest && !acknowledgment.includes(guest.name.split(' ').slice(-1)[0])) {
      acknowledgment = `${acknowledgment} Flagged for ${guest.name}.`;
    }

    const request: DispatchRequest = {
      id: `req-${nanoid(8)}`,
      department: routing.department,
      room: routing.room?.trim() || '—',
      summary: routing.summary,
      // No fabricated guest — empty when the room resolves to no one on file.
      guestName: guest?.name ?? '',
      guestTier: guest?.tier ?? 'Standard',
      guestPrefs: guest?.prefs ?? '',
      priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      eta: `${routing.eta_minutes} min`,
      acknowledgment,
      transcript,
      escalated,
    };
    void postToTeams(request);
    return NextResponse.json({ request, acknowledgment, transcript });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
