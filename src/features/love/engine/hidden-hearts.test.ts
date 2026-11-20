import { afterEach, describe, expect, it, vi } from 'vitest';

import { createPersistedSet, HIDDEN_HEART_IDS } from './hidden-hearts';

function memoryStore() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
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
});
