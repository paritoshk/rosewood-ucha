import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Returns a signed URL for the persistent ElevenLabs Conversational AI agent.
// The agent itself must already exist — set ELEVENLABS_AGENT_ID. This route
// never creates an agent.
export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;

  if (!apiKey || !agentId) {
    return NextResponse.json(
      { error: 'Live agent not configured — set ELEVENLABS_AGENT_ID.' },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      { headers: { 'xi-api-key': apiKey } },
    );

    if (!res.ok) {
      const body = await res.text();
      console.error('ElevenLabs signed-url request failed:', res.status, body);
      return NextResponse.json(
        { error: `Signed URL failed: ${body}` },
        { status: res.status },
      );
    }

    const { signed_url } = await res.json();
    return NextResponse.json({ signed_url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('ElevenLabs signed-url request errored:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
