import { describe, expect, it } from 'vitest';

import { buildDanceAttributes, pointOn } from './dance-geometry';
import {
  DANCE_FRAMES,
  DANCE_PARTS,
  FRAME_COUNT,
  KEYFRAMES,
  buildFrames,
  solveLimb,
} from './dance-silhouettes';

const dist = (a: readonly number[], b: readonly number[]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);

describe('solveLimb', () => {
  it('reaches a target within range and keeps bone lengths', () => {
    const { elbow, hand } = solveLimb([0, 0], [0.4, 0.2], 0.3, 0.3);
    expect(dist(hand, [0.4, 0.2])).toBeLessThan(1e-6);
    expect(dist(elbow, [0, 0])).toBeCloseTo(0.3);
    expect(dist(elbow, hand)).toBeCloseTo(0.3);
  });
});

describe('dance frames', () => {
  it('has the same parts and shape counts in every frame', () => {
    for (const frame of DANCE_FRAMES)
      for (const p of DANCE_PARTS)
        expect(frame[p.id].length).toBe(DANCE_FRAMES[0][p.id].length);
  });

  it('joins the two hands from keyframe 4 on', () => {
    for (const frame of buildFrames(KEYFRAMES.length).slice(4)) {
      const his = frame.hisArmJoined[1];
      const hers = frame.herArmJoined[1];
      if (his.kind !== 'capsule' || hers.kind !== 'capsule') throw new Error();
      expect(dist(his.b, hers.b)).toBeLessThan(0.12);
    }
  });

  it('never jumps between adjacent frames', () => {
    for (let i = 1; i < DANCE_FRAMES.length; i++)
      for (const p of DANCE_PARTS)
        DANCE_FRAMES[i][p.id].forEach((s, j) => {
          const prev = DANCE_FRAMES[i - 1][p.id][j];
          expect(
            dist(pointOn(s, 0.5, 0.5), pointOn(prev, 0.5, 0.5)),
          ).toBeLessThan(0.35);
        });
  });

  it('keeps her on his right through the dip', () => {
    for (const k of KEYFRAMES.slice(-3))
      expect(k.her.x).toBeGreaterThan(k.him.x);
  });

  it('stays above the floor', () => {
    for (const frame of DANCE_FRAMES)
      for (const shapes of Object.values(frame))
        for (const s of shapes)
          expect(pointOn(s, 0.5, 0.5)[1]).toBeGreaterThan(-0.05);
  });
});

describe('buildDanceAttributes', () => {
  it('is deterministic and packs 48 frames in texture rows', () => {
    const a = buildDanceAttributes(500, 3);
    const b = buildDanceAttributes(500, 3);
    expect(FRAME_COUNT).toBe(48);
    expect(a.height).toBe(a.rowsPerFrame * FRAME_COUNT);
    expect(Array.from(a.positions.slice(0, 8))).toEqual(
      Array.from(b.positions.slice(0, 8)),
    );
  });

  it('roughly follows the part weights', () => {
    const n = 20000;
    const a = buildDanceAttributes(n, 9);
    const skirt = DANCE_PARTS.findIndex((p) => p.id === 'herSkirt');
    const share = a.part.filter((p) => p === skirt).length / n;
    expect(share).toBeGreaterThan(0.14);
    expect(share).toBeLessThan(0.2);
  });
});
