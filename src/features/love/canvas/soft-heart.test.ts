import { describe, expect, it } from 'vitest';

import { inflatedHeartGeometry, softHeartShape } from './mini-hearts';

describe('softHeartShape', () => {
  const pts = softHeartShape().getPoints(64);

  it('is mirror-symmetric', () => {
    for (const p of pts) {
      const mirror = Math.min(
        ...pts.map((q) => Math.hypot(q.x + p.x, q.y - p.y)),
      );
      expect(mirror).toBeLessThan(0.02);
    }
  });

  it('has one point, at the bottom centre', () => {
    const minY = Math.min(...pts.map((p) => p.y));
    const lowest = pts.filter((p) => p.y < minY + 0.01);
    expect(lowest.every((p) => Math.abs(p.x) < 0.01)).toBe(true);
    expect(minY).toBeCloseTo(-0.9);
  });
});

describe('inflatedHeartGeometry', () => {
  const g = inflatedHeartGeometry(0.32);
  const pos = Array.from(g.getAttribute('position').array);
  const nor = Array.from(g.getAttribute('normal').array);

  it('has finite positions and normals', () => {
    expect(pos.every(Number.isFinite)).toBe(true);
    expect(nor.every(Number.isFinite)).toBe(true);
  });

  it('is mirror-symmetric in x', () => {
    for (let i = 0; i < pos.length; i += 3) {
      let best = Infinity;
      for (let j = 0; j < pos.length; j += 3)
        best = Math.min(
          best,
          Math.hypot(
            pos[j] + pos[i],
            pos[j + 1] - pos[i + 1],
            pos[j + 2] - pos[i + 2],
          ),
        );
      expect(best).toBeLessThan(0.03);
    }
  });

  it('is about depth thick', () => {
    const z = pos.filter((_, i) => i % 3 === 2).map(Math.abs);
    expect(Math.max(...z)).toBeCloseTo(0.16, 2);
  });
});
