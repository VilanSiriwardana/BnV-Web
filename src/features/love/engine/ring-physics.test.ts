import { describe, expect, it } from 'vitest';

import { mulberry32 } from '../canvas/heart-geometry';
import { frontIndex, stepRing, type Ring } from './ring-physics';

const N = 12;
const STEP = (2 * Math.PI) / N;

function settle(s: Ring) {
  for (let i = 0; i < 2000 && s.vel !== 0; i++)
    s = stepRing(s, 1 / 60, STEP, false);
  return s;
}

describe('stepRing', () => {
  it('always settles on a multiple of the step', () => {
    const rand = mulberry32(5);
    for (let k = 0; k < 50; k++) {
      const s = settle({
        angle: (rand() - 0.5) * 20,
        vel: (rand() - 0.5) * 30,
      });
      expect(s.vel).toBe(0);
      const ratio = s.angle / STEP;
      expect(Math.abs(ratio - Math.round(ratio))).toBeLessThan(1e-9);
    }
  });

  it('carries momentum forward before snapping', () => {
    const s = settle({ angle: 0, vel: 10 });
    expect(s.angle).toBeGreaterThan(STEP);
  });

  it('does nothing while dragging', () => {
    const s = { angle: 0.3, vel: 4 };
    expect(stepRing(s, 1 / 60, STEP, true)).toBe(s);
  });
});

describe('frontIndex', () => {
  it('maps angles to the card facing the viewer', () => {
    expect(frontIndex(0, STEP, N)).toBe(0);
    expect(frontIndex(-STEP, STEP, N)).toBe(1);
    expect(frontIndex(-11 * STEP, STEP, N)).toBe(11);
  });

  it('wraps for negative and positive angles', () => {
    expect(frontIndex(STEP, STEP, N)).toBe(11);
    expect(frontIndex(-13 * STEP, STEP, N)).toBe(1);
    expect(frontIndex(25 * STEP, STEP, N)).toBe(11);
  });
});
