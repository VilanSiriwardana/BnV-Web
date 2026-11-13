import { describe, expect, it } from 'vitest';

import { DANCE_FRAMES } from '../canvas/dance-silhouettes';
import { DANCE_FRAME_COUNT, frameAt } from './dance-state';

describe('frameAt', () => {
  it('maps the ends to the first pose and the dip', () => {
    expect(frameAt(0)).toBe(0);
    expect(frameAt(1)).toBe(DANCE_FRAME_COUNT - 1);
    expect(frameAt(-1)).toBe(0);
    expect(frameAt(2)).toBe(DANCE_FRAME_COUNT - 1);
  });

  it('never moves backward as scroll advances', () => {
    let prev = -1;
    for (let t = 0; t <= 1; t += 0.01) {
      const f = frameAt(t);
      expect(f).toBeGreaterThanOrEqual(prev);
      prev = f;
    }
  });

  it('matches the number of silhouette frames', () => {
    expect(DANCE_FRAME_COUNT).toBe(DANCE_FRAMES.length);
  });
});
