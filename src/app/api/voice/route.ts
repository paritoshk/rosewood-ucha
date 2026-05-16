import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { nanoid } from 'nanoid';
import { DISPATCH_MODEL, DISPATCH_SYSTEM_PROMPT, ROUTE_TOOL } from '@/lib/prompt';
import { resolveGuest, escalatePriority } from '@/lib/crm/lookup';
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
 * Real voice pipeline: audio → ElevenLabs STT → Claude (tool use) routing →
 * fake-CRM guest enrichment → a DispatchRequest the board can render.
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

    // 2. Route with Claude — tool use guarantees a valid structured object.
    const anthropic = new Anthropic({ apiKey: anthropicKey });
    const message = await anthropic.messages.create({
      model: DISPATCH_MODEL,
      max_tokens: 400,
      temperature: 0,
      system: DISPATCH_SYSTEM_PROMPT,
      tools: [ROUTE_TOOL],
      tool_choice: { type: 'tool', name: ROUTE_TOOL.name },
      messages: [
        { role: 'user', content: `Staff request (transcript): "${transcript}"` },
      ],
    });
    const toolUse = message.content.find((b) => b.type === 'tool_use');
    if (!toolUse || toolUse.type !== 'tool_use') {
      return NextResponse.json(
        { error: 'Could not route that request.' },
        { status: 502 },
      );
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
      guestName: guest?.name ?? 'Guest',
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
    return NextResponse.json(request);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
