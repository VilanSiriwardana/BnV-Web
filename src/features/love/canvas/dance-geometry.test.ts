import { describe, expect, it } from 'vitest';

import { poseAt } from '../engine/dance-state';
import {
  buildDanceParticles,
  packedShapes,
  packShapes,
  pointOn,
  unpackShape,
} from './dance-geometry';
import {
  buildPose,
  DANCE_PARTS,
  type Frame,
  interpolateSpec,
  KEYFRAMES,
  SHAPE_COUNT,
  solveLimb,
  type Vec,
} from './dance-silhouettes';

const dist = (a: readonly number[], b: readonly number[]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);
const shapesOf = (frame: Frame) => DANCE_PARTS.flatMap((p) => frame[p.id]);
const poseAtT = (t: number) => {
  const { index, k } = poseAt(t);
  return buildPose(interpolateSpec(KEYFRAMES[index], KEYFRAMES[index + 1], k));
};

describe('solveLimb', () => {
  it('reaches a target within range and keeps bone lengths', () => {
    const { elbow, hand } = solveLimb([0, 0], [0.4, 0.2], 0.3, 0.3);
    expect(dist(hand, [0.4, 0.2])).toBeLessThan(1e-6);
    expect(dist(elbow, [0, 0])).toBeCloseTo(0.3);
    expect(dist(elbow, hand)).toBeCloseTo(0.3);
  });

  it('never flips the elbow as the hand sweeps overhead', () => {
    let prev: Vec | null = null;
    for (let i = 0; i <= 100; i++) {
      const a = -Math.PI / 2 + (i / 100) * Math.PI * 1.4;
      const target: Vec = [Math.cos(a) * 0.45, Math.sin(a) * 0.45];
      const { elbow } = solveLimb([0, 0], target, 0.3, 0.28, -1);
      if (prev) expect(dist(elbow, prev)).toBeLessThan(0.05);
      prev = elbow;
    }
  });
});

describe('poses', () => {
  it('has the same shapes in every keyframe', () => {
    for (const spec of KEYFRAMES)
      expect(shapesOf(buildPose(spec)).length).toBe(SHAPE_COUNT);
  });

  // Smooth motion halves per step when the sampling doubles; a snap (elbow flip, pose jump) does not.
  it('moves continuously through the whole dance', () => {
    let prev = shapesOf(poseAtT(0));
    for (let i = 1; i <= 800; i++) {
      const next = shapesOf(poseAtT(i / 800));
      next.forEach((s, j) =>
        expect(
          dist(pointOn(s, 0.5, 0.5), pointOn(prev[j], 0.5, 0.5)),
        ).toBeLessThan(0.04),
      );
      prev = next;
    }
  });

  it('stays above the floor', () => {
    for (let i = 0; i <= 100; i++)
      for (const s of shapesOf(poseAtT(i / 100)))
        expect(pointOn(s, 0.5, 0.5)[1]).toBeGreaterThan(-0.05);
  });

  it('holds hands from the join to the lunge, then lets go in the dip', () => {
    KEYFRAMES.slice(1, -1).forEach((k) => {
      expect(k.hisHand).toBe('joined');
      expect(k.herHand).toBe('joined');
    });
    const dip = KEYFRAMES[KEYFRAMES.length - 1];
    if (typeof dip.hisHand === 'string' || typeof dip.herHand === 'string')
      throw new Error('dip hands should be released');
    expect(dist(dip.hisHand, dip.herHand)).toBeGreaterThan(1);
  });

  it('keeps her on his right in model space (mirrored on screen)', () => {
    for (const k of KEYFRAMES) expect(k.her.x).toBeGreaterThan(k.him.x);
  });
});

describe('packShapes', () => {
  it('round-trips every shape of the dip', () => {
    const frame = buildPose(KEYFRAMES[KEYFRAMES.length - 1]);
    const packed = packShapes(frame, packedShapes());
    shapesOf(frame).forEach((s, i) => {
      const back = unpackShape(packed, i);
      expect(back.kind).toBe(s.kind);
      for (const [u, v] of [
        [0.2, 0.3],
        [0.9, 0.7],
      ])
        expect(dist(pointOn(back, u, v), pointOn(s, u, v))).toBeLessThan(1e-6);
    });
  });
});

describe('buildDanceParticles', () => {
  it('is deterministic', () => {
    const a = buildDanceParticles(500, 3);
    const b = buildDanceParticles(500, 3);
    expect(Array.from(a.shape.slice(0, 16))).toEqual(
      Array.from(b.shape.slice(0, 16)),
    );
    expect(Array.from(a.uv.slice(0, 16))).toEqual(
      Array.from(b.uv.slice(0, 16)),
    );
  });

  it('roughly follows the part weights and stays on known shapes', () => {
    const n = 20000;
    const a = buildDanceParticles(n, 9);
    const skirt = DANCE_PARTS.findIndex((p) => p.id === 'herSkirt');
    const share = a.part.filter((p) => p === skirt).length / n;
    expect(share).toBeGreaterThan(0.14);
    expect(share).toBeLessThan(0.2);
    expect(Math.max(...a.shape)).toBeLessThan(SHAPE_COUNT);
  });
});
