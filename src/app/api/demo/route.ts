import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { nanoid } from 'nanoid';
import { addRequest } from '@/lib/store';
import { resolveGuest, escalatePriority } from '@/lib/crm/lookup';
import { DISPATCH_SYSTEM_PROMPT, DISPATCH_MODEL, ROUTE_TOOL } from '@/lib/prompt';
import type { Department, Priority, DispatchRequest } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 45;

const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY!;
// Staff voice for demo — different from Lauren so it sounds like a real staff member speaking
const LAUREN_VOICE_ID = 'DODLEQrClDo8wCz460ld';

interface Routing {
  department: Department;
  priority: Priority;
  summary: string;
  room: string;
  eta_minutes: number;
  acknowledgment: string;
}

async function textToAudio(text: string): Promise<Blob> {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${LAUREN_VOICE_ID}`, {
    method: 'POST',
    headers: { 'xi-api-key': ELEVEN_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: 'eleven_flash_v2_5',
      voice_settings: { stability: 0.65, similarity_boost: 0.75 },
      output_format: 'mp3_44100_128',
    }),
  });
  if (!res.ok) throw new Error(`TTS failed: ${res.status} ${await res.text()}`);
  return res.blob();
}

async function audioToText(audio: Blob): Promise<string> {
  const fd = new FormData();
  fd.append('model_id', 'scribe_v1');
  fd.append('language_code', 'eng');
  fd.append('file', audio, 'demo.mp3');
  const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: { 'xi-api-key': ELEVEN_KEY },
    body: fd,
  });
  if (!res.ok) throw new Error(`STT failed: ${res.status}`);
  const data = (await res.json()) as { text?: string };
  return (data.text ?? '').trim();
}

export async function POST(req: Request) {
  let script: string;
  try {
    ({ script } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  if (!script?.trim()) {
    return NextResponse.json({ error: 'script is required' }, { status: 400 });
  }

  try {
    // 1. Synthesize the staff request as audio (simulates a staff member speaking).
    const audio = await textToAudio(script);

    // 2. Run it through ElevenLabs STT — real transcription, not cheating.
    const transcript = await audioToText(audio);
    if (!transcript) {
      return NextResponse.json({ error: 'Empty transcript from STT' }, { status: 422 });
    }

    // 3. Route via Claude with tool use — same path as the live voice button.
    const anthropic = new Anthropic();
    const message = await anthropic.messages.create({
      model: DISPATCH_MODEL,
      max_tokens: 400,
      temperature: 0,
      system: DISPATCH_SYSTEM_PROMPT,
      tools: [ROUTE_TOOL],
      tool_choice: { type: 'tool', name: ROUTE_TOOL.name },
      messages: [{ role: 'user', content: `Staff request: "${transcript}"` }],
    });
    const toolUse = message.content.find((b) => b.type === 'tool_use');
    if (!toolUse || toolUse.type !== 'tool_use') {
      return NextResponse.json({ error: 'Routing failed' }, { status: 502 });
    }
    const routing = toolUse.input as Routing;

    // 4. CRM enrichment — same as live pipeline.
    const guest = resolveGuest(routing.room ?? '');
    let priority = routing.priority;
    let escalated = false;
    if (guest && (guest.tier === 'Pinnacle' || guest.tier === 'Élevé') && priority !== 'urgent') {
      priority = escalatePriority(priority);
      escalated = true;
    }

    const request: DispatchRequest = {
      id: `demo-${nanoid(8)}`,
      department: routing.department,
      priority,
      summary: routing.summary,
      room: routing.room?.trim() || '—',
      guestName: guest?.name ?? '',
      guestTier: guest?.tier ?? 'Standard',
      guestPrefs: guest?.prefs ?? '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      eta: routing.eta_minutes ? `${routing.eta_minutes} min` : undefined,
      acknowledgment: routing.acknowledgment,
      transcript,
      escalated,
    };

    // 5. Persist to board — the dispatch board picks it up on next poll.
    await addRequest(request);

    return NextResponse.json({ transcript, request });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
