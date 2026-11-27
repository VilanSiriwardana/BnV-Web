import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';

import { createRibbon, drapeBand } from './gift-ribbon';

const profile = [
  [0, 0.7],
  [0.4, 0.7],
  [0.7, 0.65],
  [0.7, 0.4],
  [0.65, -0.45],
] as const;

describe('gift ribbon', () => {
  it('builds a strip of (segments + 1) * 2 vertices of the given width', () => {
    const r = createRibbon(
      [new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(2, 0, 0)],
      new Vector3(0, 0, 1),
      0.2,
      10,
    );
    const pos = r.geometry.getAttribute('position');
    expect(pos.count).toBe(22);
    expect(Math.abs(pos.getZ(1) - pos.getZ(0))).toBeCloseTo(0.2);
  });

  it('keeps the band draped while tied', () => {
    const out = profile.map(() => new Vector3());
    drapeBand(out, profile, [1, 0], 0, 0.7, -0.475);
    out.forEach((p, i) => {
      expect(p.x).toBeCloseTo(profile[i][0]);
      expect(p.y).toBeCloseTo(profile[i][1]);
    });
  });

  it('spills every point onto the table beyond the box once untied', () => {
    const out = profile.map(() => new Vector3());
    drapeBand(out, profile, [0, -1], 1, 0.7, -0.475);
    out.forEach((p) => {
      expect(p.y).toBeLessThan(-0.4);
      expect(-p.z).toBeGreaterThan(0.7);
    });
  });
});
