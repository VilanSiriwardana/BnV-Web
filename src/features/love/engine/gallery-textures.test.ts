import { describe, expect, it } from 'vitest';

import { residentWindow, smallSrc } from './gallery-textures';

const ts = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

describe('gallery texture residency', () => {
  it('keeps the nearest frames, preferring those ahead', () => {
    expect([...residentWindow(ts, 0.35, 3)].sort()).toEqual([2, 3, 4]);
    // At 0.38: 0.3 is 0.08 behind (cost 0.16), 0.5 is 0.12 ahead, so the frame ahead wins.
    expect([...residentWindow(ts, 0.38, 2)].sort()).toEqual([3, 4]);
  });

  it('never exceeds the window, except for the pinned open frame', () => {
    expect(residentWindow(ts, 0, 4).size).toBe(4);
    const kept = residentWindow(ts, 0, 4, 9);
    expect(kept.size).toBe(5);
    expect(kept.has(9)).toBe(true);
  });

  it('derives the 1024 px variant name', () => {
    expect(smallSrc('/images/prototype/love-gallery-01.webp')).toBe(
      '/images/prototype/love-gallery-01-1024.webp',
    );
  });
});
