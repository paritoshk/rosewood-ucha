import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Redis } from '@upstash/redis';
import type { DispatchRequest, Status } from '@/lib/types';
import { SEED_REQUESTS } from '@/lib/seed';

// Persistence backend. When Upstash Redis is configured the board is a single
// shared key — every user, on every serverless instance, sees the same tickets.
// Without it we fall back to a JSON file in the OS temp dir: fine for local dev,
// but per-process only (a temp file is not shared across Vercel instances, which
// is why dispatched tickets didn't persist across users in production).
const REDIS_KEY = 'ucha:board:v2';
const FILE = join(tmpdir(), 'ucha-board-v2.json');

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

function isValid(parsed: unknown): parsed is DispatchRequest[] {
  return (
    Array.isArray(parsed) &&
    parsed.length > 0 &&
    parsed.every((r) => r && typeof r.id === 'string' && typeof r.createdAt === 'string')
  );
}

async function load(): Promise<DispatchRequest[]> {
  if (redis) {
    const parsed = await redis.get<DispatchRequest[]>(REDIS_KEY);
    if (isValid(parsed)) return parsed;
    await redis.set(REDIS_KEY, SEED_REQUESTS);
    return [...SEED_REQUESTS];
  }
  try {
    const parsed = JSON.parse(await readFile(FILE, 'utf8'));
    if (isValid(parsed)) return parsed;
  } catch {
    /* missing or corrupt — fall through to seed */
  }
  await writeFile(FILE, JSON.stringify(SEED_REQUESTS));
  return [...SEED_REQUESTS];
}

async function save(requests: DispatchRequest[]): Promise<void> {
  if (redis) {
    await redis.set(REDIS_KEY, requests);
    return;
  }
  await writeFile(FILE, JSON.stringify(requests));
}

/** All live requests, newest first. */
export async function getRequests(): Promise<DispatchRequest[]> {
  const requests = await load();
  return [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Prepend a new request to the board. */
export async function addRequest(request: DispatchRequest): Promise<void> {
  const requests = await load();
  await save([request, ...requests.filter((r) => r.id !== request.id)]);
}

/** Update a request's status. Returns the updated request, or null if absent. */
export async function updateStatus(
  id: string,
  status: Status,
): Promise<DispatchRequest | null> {
  const requests = await load();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  requests[idx] = { ...requests[idx], status };
  await save(requests);
  return requests[idx];
}
