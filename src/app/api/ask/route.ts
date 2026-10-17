import { NextResponse } from 'next/server';
import { askUcha, sanitizeHistory } from '@/lib/ucha';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Typed counterpart to /api/voice: same Üchá brain, no STT. Returns either
 * `{ reply }` for a question, or `{ request, acknowledgment }` for a new
 * service request the client should add to the board.
 */
export async function POST(req: Request) {
  try {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return NextResponse.json({ error: 'Üchá is not configured.' }, { status: 500 });
    }

    const body = (await req.json().catch(() => null)) as
      | { text?: unknown; history?: unknown }
      | null;
    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    if (!text) {
      return NextResponse.json({ error: 'Ask Üchá something.' }, { status: 400 });
    }
    if (text.length > 500) {
      return NextResponse.json({ error: 'Keep it under 500 characters.' }, { status: 400 });
    }

    const result = await askUcha(text, sanitizeHistory(body?.history), anthropicKey);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
