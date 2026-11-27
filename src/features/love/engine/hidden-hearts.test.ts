import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createPersistedSet,
  ensureFreshProgress,
  HIDDEN_HEART_IDS,
  progressSet,
  progressValue,
  resetProgress,
} from './hidden-hearts';

function memoryStore() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  };
}

afterEach(() => vi.unstubAllGlobals());

describe('hidden hearts', () => {
  it('has five ids', () => {
    expect(HIDDEN_HEART_IDS).toHaveLength(5);
  });

  it('counts finds once, notifies, and persists', () => {
    vi.stubGlobal('localStorage', memoryStore());
    const set = createPersistedSet('love:s:hearts');
    const fn = vi.fn();
    set.subscribe(fn);
    set.add('hero');
    set.add('hero');
    set.add('letter');
    expect(set.count()).toBe(2);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(createPersistedSet('love:s:hearts').has('letter')).toBe(true);
  });

  it('works for the session when storage throws', () => {
    const boom = () => {
      throw new Error('blocked');
    };
    vi.stubGlobal('localStorage', { getItem: boom, setItem: boom });
    const set = createPersistedSet('love:s:hearts');
    expect(() => set.add('gallery')).not.toThrow();
    expect(set.has('gallery')).toBe(true);
    expect(set.count()).toBe(1);
  });

  it('ignores corrupt saved data', () => {
    const store = memoryStore();
    store.setItem('love:s:hearts', '{"x":1}');
    vi.stubGlobal('localStorage', store);
    expect(createPersistedSet('love:s:hearts').count()).toBe(0);
  });

  it('clear empties the set, persists it and notifies', () => {
    vi.stubGlobal('localStorage', memoryStore());
    const set = createPersistedSet('love:c:hearts');
    set.add('hero');
    const fn = vi.fn();
    set.subscribe(fn);
    set.clear();
    expect(set.count()).toBe(0);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(createPersistedSet('love:c:hearts').count()).toBe(0);
  });

  it('resetProgress clears gifts, notes, hearts and the wish', () => {
    vi.stubGlobal('localStorage', memoryStore());
    for (const n of ['gifts', 'notes', 'hearts'] as const)
      progressSet('r', n).add('x');
    progressValue('r', 'wish').set('forever');
    resetProgress('r');
    for (const n of ['gifts', 'notes', 'hearts'] as const)
      expect(progressSet('r', n).count()).toBe(0);
    expect(progressValue('r', 'wish').get()).toBe('');
  });

  it('ensureFreshProgress resets once when the cache marker is missing', async () => {
    vi.stubGlobal('localStorage', memoryStore());
    const keys = new Set<string>();
    vi.stubGlobal('caches', {
      open: async () => ({
        match: async (u: string) => keys.has(u) || undefined,
        put: async (u: string) => void keys.add(u),
      }),
    });
    progressSet('f', 'hearts').add('hero');
    await ensureFreshProgress('f');
    expect(progressSet('f', 'hearts').count()).toBe(0);
    progressSet('f', 'hearts').add('memories');
    await ensureFreshProgress('f');
    expect(progressSet('f', 'hearts').count()).toBe(1);
  });
});
