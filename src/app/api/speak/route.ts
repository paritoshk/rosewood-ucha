export const runtime = 'nodejs';
export const maxDuration = 30;

const LAUREN_VOICE_ID = 'DODLEQrClDo8wCz460ld';
// Voice IDs the demo is allowed to request — Lauren (Üchá) and a staff member.
const ALLOWED_VOICES = new Set([LAUREN_VOICE_ID, 'CwhRBWXzGAHq8TQ4Fs17']);

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'ELEVENLABS_API_KEY not configured' },
        { status: 500 },
      );
    }

    const { text, voice_id } = (await request.json()) as {
      text?: string;
      voice_id?: string;
    };
    if (!text || !text.trim()) {
      return Response.json({ error: 'No text provided' }, { status: 400 });
    }

    // Default to Lauren (Üchá); the demo may request the staff voice.
    const voice =
      voice_id && ALLOWED_VOICES.has(voice_id) ? voice_id : LAUREN_VOICE_ID;

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: 'eleven_flash_v2_5',
          voice_settings: { stability: 0.8, similarity_boost: 0.75, style: 0.3 },
        }),
      },
    );

    if (!res.ok || !res.body) {
      const detail = await res.text();
      return Response.json(
        { error: `ElevenLabs TTS failed: ${detail}` },
        { status: 502 },
      );
    }

    return new Response(res.body, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
