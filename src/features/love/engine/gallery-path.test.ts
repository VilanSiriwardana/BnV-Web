import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';

import {
  GALLERY_DIMS,
  GALLERY_DOOR_SPAN,
  stageFromWalk,
  walkFromStage,
  WALK_END,
  createGalleryCurve,
  createSlots,
  frameAt,
} from './gallery-path';

const SAMPLES = 200;
const curve = createGalleryCurve();
const length = curve.getLength();

function sample(t: number) {
  const p = new Vector3();
  const n = new Vector3();
  frameAt(curve, t, p, n);
  return { p, n };
}

describe('gallery path', () => {
  it('sweeps left', () => {
    expect(curve.getPointAt(1).x).toBeLessThan(-5);
    for (let i = 1; i <= SAMPLES; i++)
      expect(curve.getPointAt(i / SAMPLES).x).toBeLessThanOrEqual(0.05);
  });

  it('keeps the bend gentle (radius ≥ 6 m)', () => {
    const step = 1 / SAMPLES;
    for (let i = 1; i < SAMPLES; i++) {
      const a = curve.getTangentAt((i - 1) * step);
      const b = curve.getTangentAt((i + 1) * step);
      const turn = a.angleTo(b);
      if (turn < 1e-6) continue;
      expect((2 * step * length) / turn).toBeGreaterThanOrEqual(6);
    }
  });

  it('keeps the camera at least 0.9 m from either wall', () => {
    const half = GALLERY_DIMS.width / 2;
    const walls: Vector3[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const { p, n } = sample(i / SAMPLES);
      walls.push(p.clone().addScaledVector(n, half));
      walls.push(p.clone().addScaledVector(n, -half));
    }
    for (let i = 0; i <= SAMPLES; i++) {
      const cam = curve.getPointAt((i / SAMPLES) * WALK_END);
      const nearest = Math.min(...walls.map((w) => w.distanceTo(cam)));
      expect(nearest).toBeGreaterThanOrEqual(0.9);
    }
  });

  it('places 12 photos, alternating walls, with room between frames', () => {
    const slots = createSlots(12);
    const photos = slots.filter((s) => s.kind === 'photo');
    expect(photos.map((s) => s.photo)).toEqual([...Array(12).keys()]);
    expect(slots.at(-1)?.kind).toBe('end');
    const wall = slots.filter((s) => s.kind !== 'end');
    wall.forEach((s, i) => i && expect(s.side).not.toBe(wall[i - 1].side));
    for (const side of [1, -1]) {
      const ts = wall.filter((s) => s.side === side).map((s) => s.t);
      ts.forEach(
        (t, i) => i && expect((t - ts[i - 1]) * length).toBeGreaterThan(2),
      );
    }
    expect(photos.filter((s) => s.side === 1).length).toBe(6);
  });

  it('handles fewer photos (config allows 9)', () => {
    const slots = createSlots(9);
    expect(slots.filter((s) => s.kind === 'photo')).toHaveLength(9);
  });
});

describe('door stretch mapping (blueprint 059)', () => {
  it('keeps the walk at 0 through the door stretch, then spans 0..1', () => {
    expect(walkFromStage(0)).toBe(0);
    expect(walkFromStage(GALLERY_DOOR_SPAN)).toBe(0);
    expect(walkFromStage(1)).toBe(1);
  });
  it('stageFromWalk inverts walkFromStage', () => {
    for (const w of [0, 0.25, 0.5, 1])
      expect(walkFromStage(stageFromWalk(w))).toBeCloseTo(w);
  });
});
