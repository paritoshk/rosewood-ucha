import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const API_KEY = process.env.ELEVENLABS_API_KEY!;
const LAUREN_VOICE = 'DODLEQrClDo8wCz460ld';

const AGENT_SYSTEM_PROMPT = `You are Üchá, the AI voice dispatcher for Rosewood Sand Hill, a five-star luxury hotel.

Staff members speak requests to you. Your role:
1. Listen and understand the request
2. If the room number is missing or unclear, ask once to confirm
3. Call create_dispatch with complete routing information
4. Give a brief, warm spoken confirmation after dispatching (e.g. "Housekeeping is on the way to 412.")

Stay concise — staff are busy. Responses under 20 words unless clarifying.

DEPARTMENTS (route to exactly one):
- housekeeping: cleaning, towels, linens, turndown, amenities, minibar restock
- maintenance: broken or faulty items — HVAC, plumbing, electrical, TV/tech, doors, safes
- front_desk: check-in/out, late checkout, room changes, billing, key cards, wake-up calls
- concierge: reservations, transport, tickets, deliveries, recommendations, packages, lost & found

PRIORITY:
- urgent: safety issues, flooding, no A/C, locked out, upset or waiting guest
- normal: standard service request
- low: proactive or non-time-sensitive

Room: extract exactly as said. Use empty string if not mentioned.
ETA: urgent ~5 min, normal ~15 min, low ~30 min.

Dispatch within 2 exchanges maximum. Ask at most one clarifying question.`;

// Cached per-process. Set ELEVENLABS_AGENT_ID in .env.local to skip creation entirely.
let cachedAgentId: string | null = process.env.ELEVENLABS_AGENT_ID ?? null;

async function ensureAgent(): Promise<string> {
  if (cachedAgentId) return cachedAgentId;

  const res = await fetch('https://api.elevenlabs.io/v1/convai/agents/create', {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Üchá Hotel Dispatcher',
      conversation_config: {
        agent: {
          prompt: {
            prompt: AGENT_SYSTEM_PROMPT,
            tools: [
              {
                type: 'client',
                name: 'create_dispatch',
                description: 'Route a staff request to the correct hotel department and log it on the dispatch board.',
                parameters: {
                  type: 'object',
                  properties: {
                    department: {
                      type: 'string',
                      enum: ['housekeeping', 'maintenance', 'front_desk', 'concierge'],
                    },
                    priority: {
                      type: 'string',
                      enum: ['urgent', 'normal', 'low'],
                    },
                    summary: { type: 'string' },
                    room: { type: 'string' },
                    eta_minutes: { type: 'integer' },
                  },
                  required: ['department', 'priority', 'summary', 'room', 'eta_minutes'],
                },
              },
            ],
          },
          first_message: 'Dispatch ready.',
          language: 'en',
        },
        tts: {
          voice_id: LAUREN_VOICE,
          model_id: 'eleven_flash_v2',
        },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    // Don't cache a bad ID — clear so the next request retries creation.
    cachedAgentId = null;
    throw new Error(`ElevenLabs agent creation failed: ${body}`);
  }

  const data = await res.json();
  cachedAgentId = data.agent_id as string;
  return cachedAgentId!;
}

export async function GET() {
  try {
    const agentId = await ensureAgent();

    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      { headers: { 'xi-api-key': API_KEY } },
    );

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json({ error: `Signed URL failed: ${body}` }, { status: 500 });
    }

    const { signed_url } = await res.json();
    return NextResponse.json({ signed_url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
