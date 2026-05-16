export const runtime = 'nodejs';
export const maxDuration = 30;

// Default voice: "Lauren" (ElevenLabs) — friendly, comforting, soft; American
// conversational. Voice ID DODLEQrClDo8wCz460ld.
const DEFAULT_VOICE = 'DODLEQrClDo8wCz460ld';

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

    const voice = voice_id || DEFAULT_VOICE;
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
          voice_settings: { stability: 0.8, similarity_boost: 0.75 },
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
