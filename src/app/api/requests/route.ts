import { NextRequest, NextResponse } from "next/server";
import type { DispatchRequest } from "@/lib/types";
import { SEED_REQUESTS } from "@/lib/seed";

// Module-level store — resets on server restart, fine for demo
let requests: DispatchRequest[] = [...SEED_REQUESTS];

export async function GET() {
  return NextResponse.json(requests);
}

export async function POST(req: NextRequest) {
  const body: DispatchRequest = await req.json();
  requests = [body, ...requests];
  return NextResponse.json(body, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  requests = requests.map((r) => (r.id === id ? { ...r, status } : r));
  return NextResponse.json({ ok: true });
}
