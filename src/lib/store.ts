import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { DispatchRequest, Status } from '@/lib/types';
import { SEED_REQUESTS } from '@/lib/seed';

// Persisted to a JSON file in the OS temp dir — outside the project tree so
// writes don't trip the Next.js dev file watcher. A temp file survives
// hot-reloads and server restarts; a module-level array does not (which made
// dispatched requests vanish on the next poll).
const FILE = join(tmpdir(), 'ucha-board-v2.json');

function isValid(parsed: unknown): parsed is DispatchRequest[] {
  return (
    Array.isArray(parsed) &&
    parsed.length > 0 &&
    parsed.every((r) => r && typeof r.id === 'string' && typeof r.createdAt === 'string')
  );
}

async function load(): Promise<DispatchRequest[]> {
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
