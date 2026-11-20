import { describe, expect, it } from 'vitest';

import { DUCK_IN_S, DUCK_OUT_S, duckRamp } from './audio-duck';

describe('duckRamp', () => {
  it('ducks to about 18 % over 400 ms when the voice starts', () => {
    const r = duckRamp(0.6, true, false)!;
    expect(r.to).toBeCloseTo(0.108);
    expect(r.seconds).toBe(DUCK_IN_S);
  });

  it('recovers to full volume over 800 ms', () => {
    expect(duckRamp(0.6, false, false)).toEqual({
      to: 0.6,
      seconds: DUCK_OUT_S,
    });
  });

  it('leaves muted music alone (voice still plays)', () => {
    expect(duckRamp(0.6, true, true)).toBeNull();
    expect(duckRamp(0.6, false, true)).toBeNull();
  });
});
