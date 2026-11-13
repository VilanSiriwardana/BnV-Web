import { describe, expect, it } from 'vitest';

import { buildHeartAttributes, heartPoint, ribbonSide } from './heart-geometry';

describe('heartPoint', () => {
  it('stays within about [-1, 1]', () => {
    for (let i = 0; i < 360; i++) {
      const [x, y] = heartPoint((i / 360) * Math.PI * 2);
      expect(Math.abs(x)).toBeLessThanOrEqual(1.01);
      expect(Math.abs(y)).toBeLessThanOrEqual(1.01);
    }
  });
});

describe('buildHeartAttributes', () => {
  const count = 1000;
  const a = buildHeartAttributes(count, 3);

  it('returns arrays of the right length', () => {
    expect(a.aHeart).toHaveLength(count * 3);
    expect(a.aRibbon).toHaveLength(count * 3);
    expect(a.aScatter).toHaveLength(count * 3);
    expect(a.aRand).toHaveLength(count * 4);
  });

  it('puts each ribbon on its own half of the heart', () => {
    for (let i = 0; i < count; i++) {
      const side = ribbonSide(i);
      expect(Math.sign(a.aHeart[i * 3]) || side).toBe(side);
    }
  });

  it('starts ribbons on their own side of the screen', () => {
    let left = 0;
    let right = 0;
    for (let i = 0; i < count; i++) {
      if (ribbonSide(i) < 0) left += a.aRibbon[i * 3];
      else right += a.aRibbon[i * 3];
    }
    expect(left / (count / 2)).toBeLessThan(-2);
    expect(right / (count / 2)).toBeGreaterThan(2);
  });

  it('balances both halves in any draw-range prefix (low tier)', () => {
    const big = buildHeartAttributes(18000);
    for (const n of [3000, 8000]) {
      let left = 0;
      let low = 0;
      let high = 0;
      for (let i = 0; i < n; i++) {
        if (big.aHeart[i * 3] < 0) left++;
        const y = big.aHeart[i * 3 + 1];
        if (y > 0.5) high++;
        if (y < -0.5) low++;
      }
      expect(left / n).toBeGreaterThan(0.45);
      expect(left / n).toBeLessThan(0.55);
      expect(high).toBeGreaterThan(0);
      expect(low).toBeGreaterThan(0);
    }
  });

  it('is deterministic for a seed', () => {
    expect(buildHeartAttributes(count, 3).aHeart).toEqual(a.aHeart);
  });
});
