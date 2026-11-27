import { describe, expect, it } from 'vitest';

import {
  damp,
  DANCE_BEATS,
  DANCE_POSES,
  keyAt,
  poseAt,
  restsOn,
} from './dance-state';

const LAST = DANCE_POSES.length - 1;
const position = (t: number) => {
  const { index, k } = poseAt(t);
  return index + k;
};

describe('poseAt', () => {
  it('starts on the first pose and ends held on the dip', () => {
    expect(poseAt(0)).toEqual({ index: 0, k: 0 });
    expect(poseAt(1)).toEqual({ index: LAST - 1, k: 1 });
    expect(poseAt(0.95)).toEqual({ index: LAST - 1, k: 1 });
    expect(poseAt(-1)).toEqual({ index: 0, k: 0 });
    expect(poseAt(2)).toEqual({ index: LAST - 1, k: 1 });
  });

  it('never moves backward as scroll advances', () => {
    let prev = -1;
    for (let t = 0; t <= 1; t += 0.002) {
      expect(position(t)).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = position(t);
    }
  });

  it('reaches each keyframe exactly at keyAt', () => {
    for (let i = 0; i <= LAST; i++) expect(position(keyAt(i))).toBeCloseTo(i);
  });

  it('rests only on the hold and the dip', () => {
    for (let i = 0; i < LAST; i++) {
      const { k } = poseAt(keyAt(i) + 0.005);
      if (restsOn(DANCE_POSES[i])) expect(k).toBe(0);
      else expect(k).toBeGreaterThan(0);
    }
  });
});

describe('beats', () => {
  it('are the hold, twirl and dip', () => {
    expect(DANCE_BEATS.map((b) => b.event)).toEqual(['hold', 'twirl', 'dip']);
  });

  it('fire in order inside the stage', () => {
    const at = DANCE_BEATS.map((b) => b.at);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
    expect(at.at(-1)).toBeLessThan(1);
  });
});

describe('damp', () => {
  it('moves toward the target without overshoot', () => {
    const v = damp(0, 1, 1 / 60);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(1);
    expect(damp(0.4, 0.4, 1 / 60)).toBe(0.4);
  });
});
