import { describe, expect, it } from 'vitest';

import { HEART_PATH, ndcToWorld, poseFor, SECTION_IDS } from './heart-path';

describe('ndcToWorld', () => {
  it('maps NDC corners to half the viewport', () => {
    const vp = { width: 8, height: 4 };
    expect(ndcToWorld({ x: 1, y: 1 }, vp)).toEqual({ x: 4, y: 2 });
    expect(ndcToWorld({ x: -0.5, y: 0 }, vp)).toEqual({ x: -2, y: 0 });
  });
});

describe('HEART_PATH', () => {
  it('has a desktop and mobile pose in range for every section', () => {
    for (const id of SECTION_IDS) {
      for (const mobile of [false, true]) {
        const p = poseFor(id, mobile);
        expect(Math.abs(p.x)).toBeLessThanOrEqual(1);
        expect(Math.abs(p.y)).toBeLessThanOrEqual(1);
        expect(p.scale).toBeGreaterThan(0);
      }
      expect(HEART_PATH[id].glow).toBeGreaterThan(0);
    }
  });

  it('keeps the mobile heart out of the text band (top 30 % or bottom-right)', () => {
    for (const id of ['hero', 'bloom', 'memories', 'gallery'] as const) {
      const { x, y } = HEART_PATH[id].mobile;
      expect(y >= 0.2 || (x > 0.5 && y < -0.6)).toBe(true);
    }
  });
});
