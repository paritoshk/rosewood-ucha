import { NextResponse } from 'next/server';
import { askUcha, sanitizeHistory } from '@/lib/ucha';

export const runtime = 'nodejs';
export const maxDuration = 30;

const STT_URL = 'https://api.elevenlabs.io/v1/speech-to-text';

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
    // Prior turns of this hold-to-talk conversation. Each press is otherwise a
    // fresh, stateless request — threading the history gives Üchá memory across
    // separate presses, so "I'll take that one" knows what "that one" is.
    let history: ReturnType<typeof sanitizeHistory> = [];
    const rawHistory = form.get('history');
    if (typeof rawHistory === 'string') {
      try {
        history = sanitizeHistory(JSON.parse(rawHistory));
      } catch {
        /* malformed history — proceed without it */
      }
    }

    const result = await askUcha(transcript, history, anthropicKey);
    return NextResponse.json({ ...result, transcript });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
