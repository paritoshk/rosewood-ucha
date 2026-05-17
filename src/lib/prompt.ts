// Haiku 4.5 — classification doesn't need Sonnet; ~1s round-trip.
export const DISPATCH_MODEL = 'claude-haiku-4-5';

export const DISPATCH_SYSTEM_PROMPT = `You are Üchá, the operations dispatcher for Rosewood Sand Hill, a luxury hotel.
A staff member has spoken a request out loud. You receive the transcript and must
route it to the correct department by calling the route_request tool.

DEPARTMENTS:
- housekeeping: cleaning, towels, linens, turndown, amenities, minibar restock
- maintenance: broken or faulty items — HVAC, plumbing, electrical, TV/tech, doors, safes
- front_desk: check-in/out, late checkout, room changes, billing, key cards, wake-up calls
- concierge: reservations, transport, tickets, deliveries, recommendations, packages

PRIORITY:
- urgent: safety, flooding, guest locked out, no A/C, anything with an upset/waiting guest
- normal: a standard service request
- low: proactive or non-time-sensitive tasks

ROOM: extract the room number exactly as said (e.g. "412", "1101"). Use "" if none.

SUMMARY: one concise action line, under 10 words, imperative voice.

ETA: realistic minutes given priority — urgent ~5, normal ~15, low ~30.

ACKNOWLEDGMENT: a short, warm spoken reply (under 15 words) confirming the request,
as Üchá would say it back to the staff member.

Always respond by calling route_request. Do not write prose.`;

/** Anthropic tool schema — forces a valid structured routing object. */
export const ROUTE_TOOL = {
  name: 'route_request',
  description: 'Route a staff voice request to the correct hotel department.',
  input_schema: {
    type: 'object' as const,
    properties: {
      department: {
        type: 'string',
        enum: ['housekeeping', 'maintenance', 'front_desk', 'concierge'],
      },
      priority: { type: 'string', enum: ['urgent', 'normal', 'low'] },
      summary: { type: 'string', description: 'Concise action, under 10 words' },
      room: { type: 'string', description: 'Room number, or empty string if none' },
      eta_minutes: { type: 'integer', description: 'Realistic ETA in minutes' },
      acknowledgment: {
        type: 'string',
        description: 'Warm spoken confirmation, under 15 words',
      },
    },
    required: [
      'department',
      'priority',
      'summary',
      'room',
      'eta_minutes',
      'acknowledgment',
    ],
  },
};
