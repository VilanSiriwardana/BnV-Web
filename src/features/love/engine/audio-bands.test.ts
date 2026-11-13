import { describe, expect, it } from 'vitest';

import { band, lubDub, smoothFastAttack } from './audio-bands';

describe('band', () => {
  it('averages a bin range to 0..1', () => {
    const data = new Uint8Array([255, 255, 0, 0]);
    expect(band(data, 0, 1)).toBe(1);
    expect(band(data, 0, 3)).toBe(0.5);
    expect(band(data, 2, 3)).toBe(0);
  });
});

describe('smoothFastAttack', () => {
  it('jumps up immediately and decays slowly', () => {
    expect(smoothFastAttack(0.2, 0.8)).toBe(0.8);
    expect(smoothFastAttack(0.8, 0)).toBeCloseTo(0.72);
  });
});

describe('lubDub', () => {
  it('stays in 0..1 and peaks once per beat', () => {
    const beat = 60 / 72;
    expect(lubDub(beat * 0.06)).toBeGreaterThan(0.9);
    expect(lubDub(beat * 0.6)).toBeLessThan(0.05);
    for (let t = 0; t < 3; t += 0.01) {
      expect(lubDub(t)).toBeGreaterThanOrEqual(0);
      expect(lubDub(t)).toBeLessThanOrEqual(1);
    }
  });
});
