import { afterEach, describe, expect, it, vi } from 'vitest';

import { loveKey, readJSON, writeJSON } from './persist';

function memoryStore() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
  };
}

afterEach(() => vi.unstubAllGlobals());

describe('persist', () => {
  it('prefixes keys with the slug', () => {
    expect(loveKey('abc', 'hearts')).toBe('love:abc:hearts');
  });

  it('round-trips JSON', () => {
    vi.stubGlobal('localStorage', memoryStore());
    writeJSON('k', ['a', 'b']);
    expect(readJSON('k', [])).toEqual(['a', 'b']);
    expect(readJSON('missing', 3)).toBe(3);
  });

  it('falls back when storage throws', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    });
    expect(() => writeJSON('k', 1)).not.toThrow();
    expect(readJSON('k', 'fallback')).toBe('fallback');
  });

  it('falls back when storage is missing', () => {
    vi.stubGlobal('localStorage', undefined);
    expect(readJSON('k', 0)).toBe(0);
    expect(() => writeJSON('k', 1)).not.toThrow();
  });
});
