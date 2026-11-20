import { describe, expect, it } from 'vitest';

import { pentatonicNote } from './chime';

describe('pentatonicNote', () => {
  it('starts at the base note', () => {
    expect(pentatonicNote(0, 440)).toBeCloseTo(440);
  });

  it('climbs the major pentatonic and wraps up an octave', () => {
    expect(pentatonicNote(3, 440)).toBeCloseTo(440 * 2 ** (7 / 12));
    expect(pentatonicNote(5, 440)).toBeCloseTo(880);
  });

  it('handles negative indices', () => {
    expect(pentatonicNote(-1, 440)).toBeCloseTo(440 * 2 ** ((9 - 12) / 12));
  });
});
