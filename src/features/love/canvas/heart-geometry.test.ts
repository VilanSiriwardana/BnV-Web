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
      const side = ribbonSide(i, count);
      expect(Math.sign(a.aHeart[i * 3]) || side).toBe(side);
    }
  });

  it('starts ribbons on their own side of the screen', () => {
    expect(a.aRibbon[0]).toBeLessThan(-3);
    expect(a.aRibbon[(count / 2) * 3]).toBeGreaterThan(3);
  });

  it('is deterministic for a seed', () => {
    expect(buildHeartAttributes(count, 3).aHeart).toEqual(a.aHeart);
  });
});
