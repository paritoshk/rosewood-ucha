import { NextRequest, NextResponse } from 'next/server';
import type { DispatchRequest, Status } from '@/lib/types';
import { getRequests, addRequest, updateStatus } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getRequests());
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as DispatchRequest;
  await addRequest(body);
  return NextResponse.json(body, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = (await req.json()) as { id: string; status: Status };
  const updated = await updateStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
