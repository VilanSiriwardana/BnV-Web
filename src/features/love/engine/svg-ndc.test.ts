import { describe, expect, it } from 'vitest';

import { pxToNdc } from './svg-ndc';

describe('pxToNdc', () => {
  const vp = { width: 400, height: 200 };
  it('maps corners and centre', () => {
    expect(pxToNdc({ x: 0, y: 0 }, vp)).toEqual({ x: -1, y: 1 });
    expect(pxToNdc({ x: 400, y: 200 }, vp)).toEqual({ x: 1, y: -1 });
    expect(pxToNdc({ x: 200, y: 100 }, vp)).toEqual({ x: 0, y: 0 });
  });
});
