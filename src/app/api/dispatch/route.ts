import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { addRequest } from '@/lib/store';
import { resolveGuest, escalatePriority } from '@/lib/crm/lookup';
import type { Department, Priority, DispatchRequest } from '@/lib/types';

export const runtime = 'nodejs';

interface DispatchParams {
  department: Department;
  priority: Priority;
  summary: string;
  room: string;
  eta_minutes: number;
}

export async function POST(req: Request) {
  let body: DispatchParams;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { department, priority, summary, room, eta_minutes } = body;

  if (!department || !priority || !summary) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const guest = resolveGuest(room ?? '');
  const finalPriority =
    guest && (guest.tier === 'Pinnacle' || guest.tier === 'Élevé')
      ? escalatePriority(priority)
      : priority;

  const request: DispatchRequest = {
    id: nanoid(),
    department,
    priority: finalPriority,
    summary,
    room: room ?? '',
    guestName: guest?.name ?? '',
    guestTier: guest?.tier ?? 'Standard',
    guestPrefs: guest?.prefs ?? '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    eta: eta_minutes ? `${eta_minutes} min` : undefined,
    escalated: guest ? finalPriority !== priority : false,
  };

  await addRequest(request);

  // Spoken-confirmation line handed back to the agent so Üchá can read the
  // guest context and any VIP escalation back to the staff member — not just
  // "dispatched to maintenance".
  const dept = department.replace('_', ' ');
  let result = `Logged${request.room ? ` for room ${request.room}` : ''}`;
  if (guest) result += ` — ${guest.name}, ${guest.tier} guest`;
  result += `. Routed to ${dept}, ${finalPriority} priority`;
  if (request.escalated) result += `, escalated for VIP`;
  result += eta_minutes ? `, ETA ${eta_minutes} minutes.` : '.';

  return NextResponse.json({ request, result }, { status: 201 });
}
