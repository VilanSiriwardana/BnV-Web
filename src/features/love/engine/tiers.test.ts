import { describe, expect, it } from 'vitest';

import { guessTier, stepTier, TIERS } from './tiers';

const desktop = {
  webgl: true,
  touch: false,
  cores: 8,
  memory: 8,
  saveData: false,
  width: 1440,
};

describe('guessTier', () => {
  it('returns static without WebGL', () => {
    expect(guessTier({ ...desktop, webgl: false })).toBe('static');
  });

  it('returns low for Save-Data or small memory', () => {
    expect(guessTier({ ...desktop, saveData: true })).toBe('low');
    expect(guessTier({ ...desktop, memory: 4 })).toBe('low');
  });

  it('returns mid for phones and high for strong desktops', () => {
    expect(guessTier({ ...desktop, touch: true, width: 390 })).toBe('mid');
    expect(guessTier(desktop)).toBe('high');
  });
});

describe('stepTier', () => {
  it('steps down and up without leaving the canvas tiers', () => {
    expect(stepTier('high', -1)).toBe('mid');
    expect(stepTier('low', -1)).toBe('low');
    expect(stepTier('high', 1)).toBe('high');
    expect(stepTier('static', 1)).toBe('static');
  });

  it('drops gallery extras in order: reflection, motes, companion', () => {
    expect(TIERS.high.galleryReflection).toBe(true);
    expect(TIERS.mid.galleryReflection).toBe(false);
    expect(TIERS.mid.galleryMotes).toBeLessThan(TIERS.high.galleryMotes);
    expect(TIERS.mid.galleryCompanion).toBe(true);
    expect(TIERS.low.galleryMotes).toBe(0);
    expect(TIERS.low.galleryCompanion).toBe(false);
    expect(TIERS.low.galleryLights).toBeGreaterThanOrEqual(1);
  });

  it('keeps bloom off on low', () => {
    expect(TIERS.low.bloom).toBe('off');
  });
});
