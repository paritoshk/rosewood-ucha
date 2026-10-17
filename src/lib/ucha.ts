import Anthropic from '@anthropic-ai/sdk';
import { nanoid } from 'nanoid';
import { DISPATCH_MODEL, DISPATCH_SYSTEM_PROMPT, ROUTE_TOOL } from '@/lib/prompt';
import { resolveGuest, escalatePriority } from '@/lib/crm/lookup';
import { getRequests } from '@/lib/store';
import { postToTeams } from '@/lib/teams';
import type { DispatchRequest, Department, Priority } from '@/lib/types';

export type Turn = { role: 'user' | 'assistant'; content: string };

export type UchaResult =
  | { reply: string; request?: undefined; acknowledgment?: undefined }
  | { request: DispatchRequest; acknowledgment: string; reply?: undefined };

interface Routing {
  department: Department;
  priority: Priority;
  summary: string;
  room: string;
  eta_minutes: number;
  acknowledgment: string;
}

/** Keep only well-formed turns, capped at the last 12. */
export function sanitizeHistory(raw: unknown): Turn[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim(),
    )
    .slice(-12);
}

/**
 * Üchá's brain, shared by voice (/api/voice) and text (/api/ask).
 *
 * Claude decides what the staff member meant: a NEW service request → it calls
 * route_request and we return an enriched DispatchRequest for the board; a
 * QUESTION or status remark ("what are my action items") → it answers in prose
 * and we return that reply with no card.
 */
export async function askUcha(
  text: string,
  history: Turn[],
  apiKey: string,
): Promise<UchaResult> {
  // The current board is passed so questions can be answered accurately.
  const board = (await getRequests()).filter((r) => r.status !== 'resolved');
  const boardSummary = board.length
    ? board
        .map(
          (r) =>
            `- [${r.priority}] ${r.department}, room ${r.room}: ${r.summary} (${r.status})`,
        )
        .join('\n')
    : '(no active requests)';

  const anthropic = new Anthropic({ apiKey });
  const message = await anthropic.messages.create({
    model: DISPATCH_MODEL,
    max_tokens: 600,
    temperature: 0,
    // The board goes in the system prompt so each conversation turn stays a
    // clean transcript and history doesn't carry stale board snapshots.
    system: `${DISPATCH_SYSTEM_PROMPT}\n\nCURRENT BOARD (live):\n${boardSummary}`,
    tools: [ROUTE_TOOL],
    messages: [...history, { role: 'user', content: text }],
  });

  // No tool call → a question or status remark. Return the reply, no card.
  const toolUse = message.content.find((b) => b.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') {
    const textBlock = message.content.find((b) => b.type === 'text');
    const reply =
      textBlock && textBlock.type === 'text' && textBlock.text.trim()
        ? textBlock.text.trim()
        : "I didn't catch a request there — try again.";
    return { reply };
  }
  const routing = toolUse.input as Routing;

  // CRM enrichment — resolve the guest and escalate for Pinnacle VIPs.
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
    transcript: text,
    escalated,
  };
  void postToTeams(request);
  return { request, acknowledgment };
}
