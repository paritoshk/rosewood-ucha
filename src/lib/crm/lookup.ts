import type { GuestTier, Priority } from '@/lib/types';
import { SEED_GUESTS } from '@/lib/seed';

export interface ResolvedGuest {
  name: string;
  tier: GuestTier;
  prefs: string;
}

/**
 * Resolve guest-360 context for a room number against the seeded CRM.
 * Mirrors a Hapi → Salesforce lookup. Returns null for an unknown room.
 */
export function resolveGuest(room: string): ResolvedGuest | null {
  const normalized = room.trim().toUpperCase().replace(/^ROOM\s*/i, '');
  if (!normalized) return null;
  const guest = SEED_GUESTS.find((g) => g.room.toUpperCase() === normalized);
  if (!guest) return null;
  return { name: guest.name, tier: guest.tier, prefs: guest.preferences };
}

const PRIORITY_ORDER: Priority[] = ['low', 'normal', 'urgent'];

/** Bump a priority up one level (used for VIP / Pinnacle escalation). */
export function escalatePriority(priority: Priority): Priority {
  const idx = PRIORITY_ORDER.indexOf(priority);
  return PRIORITY_ORDER[Math.min(idx + 1, PRIORITY_ORDER.length - 1)];
}
