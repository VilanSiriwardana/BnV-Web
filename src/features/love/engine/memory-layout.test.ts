import { describe, expect, it } from 'vitest';

import { orbPosition, orbRailProgress, railEndZ } from './memory-layout';

describe('orbPosition', () => {
  it('follows the Experience §8 formula', () => {
    expect(orbPosition(0, false)).toEqual({ x: 0, y: 1.2, z: -6 });
    const p = orbPosition(2, false);
    expect(p.z).toBe(-15);
    expect(p.x).toBeCloseTo(Math.sin(2.6) * 2.4);
    expect(p.y).toBeCloseTo(Math.cos(1.8) * 1.2);
  });

  it('narrows the corridor on mobile', () => {
    expect(orbPosition(1, true).x).toBeCloseTo(orbPosition(1, false).x * 0.6);
  });
});

describe('rail', () => {
  it('ends 4 units past the last orb', () => {
    expect(railEndZ(8)).toBe(-6 - 7 * 4.5 + 4);
    expect(railEndZ(6)).toBe(-6 - 5 * 4.5 + 4);
  });

  it('maps the last orb to the end of the rail', () => {
    expect(orbRailProgress(7, 8)).toBe(1);
    expect(orbRailProgress(0, 8)).toBeGreaterThan(0);
  });
});
