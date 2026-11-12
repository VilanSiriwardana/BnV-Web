import { describe, expect, it } from 'vitest';

import { parseCssColor } from './token-colors';

describe('parseCssColor', () => {
  it('parses long and short hex', () => {
    expect(parseCssColor('#ffffff')).toEqual([1, 1, 1]);
    expect(parseCssColor(' #000 ')).toEqual([0, 0, 0]);
  });

  it('parses rgb()', () => {
    expect(parseCssColor('rgb(255, 0, 0)')).toEqual([1, 0, 0]);
  });

  it('rejects color-mix and junk', () => {
    expect(parseCssColor('color-mix(in oklab, red 50%, blue)')).toBeNull();
    expect(parseCssColor('')).toBeNull();
  });
});
