import { describe, expect, it } from 'vitest';

import { skyStarLayout } from './sky-layout';

describe('skyStarLayout', () => {
  it('returns n stars inside the box with margin', () => {
    const stars = skyStarLayout(8);
    expect(stars).toHaveLength(8);
    for (const s of stars) {
      expect(s.x).toBeGreaterThanOrEqual(10);
      expect(s.x).toBeLessThanOrEqual(90);
      expect(s.y).toBeGreaterThanOrEqual(10);
      expect(s.y).toBeLessThanOrEqual(90);
    }
  });

  it('starts near the top centre and goes clockwise (right side first)', () => {
    const stars = skyStarLayout(8);
    expect(stars[0].x).toBeGreaterThan(50);
    expect(stars[0].y).toBeLessThan(50);
    expect(stars[7].x).toBeLessThan(50);
  });

  it('is symmetric about the vertical axis', () => {
    const stars = skyStarLayout(8);
    for (let i = 0; i < 4; i++) {
      expect(stars[i].x + stars[7 - i].x).toBeCloseTo(100, 5);
      expect(stars[i].y).toBeCloseTo(stars[7 - i].y, 5);
    }
  });

  it('keeps stars apart', () => {
    const stars = skyStarLayout(8);
    for (let i = 0; i < 8; i++) {
      const a = stars[i];
      const b = stars[(i + 1) % 8];
      expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(8);
    }
  });
});
