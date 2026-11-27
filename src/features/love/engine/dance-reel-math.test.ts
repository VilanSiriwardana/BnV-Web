import { describe, expect, it } from 'vitest';

import { damp, frameAt, loadOrder, windowAround } from './dance-reel-math';

describe('frameAt', () => {
  it('maps progress to the nearest frame and clamps', () => {
    expect(frameAt(0, 121)).toBe(0);
    expect(frameAt(1, 121)).toBe(120);
    expect(frameAt(0.5, 121)).toBe(60);
    expect(frameAt(-1, 121)).toBe(0);
    expect(frameAt(2, 121)).toBe(120);
    expect(frameAt(Number.NaN, 121)).toBe(0);
  });

  it('handles a single frame', () => {
    expect(frameAt(0.7, 1)).toBe(0);
  });
});

describe('windowAround', () => {
  it('clamps at both ends without wrapping', () => {
    expect(windowAround(0, 16, 121)).toEqual({ from: 0, to: 16 });
    expect(windowAround(120, 16, 121)).toEqual({ from: 104, to: 120 });
    expect(windowAround(60, 12, 121)).toEqual({ from: 48, to: 72 });
    expect(windowAround(0, 16, 1)).toEqual({ from: 0, to: 0 });
  });
});

describe('loadOrder', () => {
  it('starts coarse and covers every frame once', () => {
    const order = loadOrder(121);
    expect(order.slice(0, 4)).toEqual([0, 8, 16, 24]);
    expect(order).toHaveLength(121);
    expect([...order].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 121 }, (_, i) => i),
    );
    expect(loadOrder(1)).toEqual([0]);
  });
});

describe('damp', () => {
  it('eases toward the target without overshooting', () => {
    expect(damp(0, 1, 0, 5)).toBe(0);
    expect(damp(0, 1, 10, 5)).toBeCloseTo(1);
    const step = damp(0, 1, 0.016, 4);
    expect(step).toBeGreaterThan(0);
    expect(step).toBeLessThan(1);
  });
});
