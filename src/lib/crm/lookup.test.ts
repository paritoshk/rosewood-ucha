import { describe, it, expect } from 'vitest';
import { resolveGuest, escalatePriority } from './lookup';

describe('resolveGuest', () => {
  it('resolves a guest profile for a known room', () => {
    const g = resolveGuest('814');
    expect(g?.name).toBe('Mrs. Chen Wei');
    expect(g?.tier).toBe('Pinnacle');
  });

  it('strips a "Room " prefix and is case-insensitive', () => {
    expect(resolveGuest('Room 502')?.name).toBe('Mr. James Harrington');
    expect(resolveGuest('  1101 ')?.tier).toBe('Pinnacle');
  });

  it('returns null for an unknown or empty room', () => {
    expect(resolveGuest('9999')).toBeNull();
    expect(resolveGuest('')).toBeNull();
    expect(resolveGuest('   ')).toBeNull();
  });
});

describe('escalatePriority', () => {
  it('bumps priority up one level', () => {
    expect(escalatePriority('low')).toBe('normal');
    expect(escalatePriority('normal')).toBe('urgent');
  });

  it('caps at urgent', () => {
    expect(escalatePriority('urgent')).toBe('urgent');
  });
});
