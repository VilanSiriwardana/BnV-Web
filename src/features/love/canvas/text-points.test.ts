import { describe, expect, it } from 'vitest';

import { textToPoints } from './text-points';

// A 40×20 image with an opaque 20×10 block in the middle.
function block() {
  const w = 40;
  const h = 20;
  const px = new Uint8ClampedArray(w * h * 4);
  for (let y = 5; y < 15; y++)
    for (let x = 10; x < 30; x++) px[(y * w + x) * 4 + 3] = 255;
  return { px, w, h };
}

describe('textToPoints', () => {
  it('is deterministic for a seed', () => {
    const { px, w, h } = block();
    expect(textToPoints(px, w, h, 30, 2, 9)).toEqual(
      textToPoints(px, w, h, 30, 2, 9),
    );
  });

  it('centres the samples and fits the world width', () => {
    const { px, w, h } = block();
    const pts = textToPoints(px, w, h, 50, 2.6, 1);
    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 0; i < 50; i++) {
      minX = Math.min(minX, pts[i * 3]);
      maxX = Math.max(maxX, pts[i * 3]);
      expect(Math.abs(pts[i * 3 + 1])).toBeLessThan(1);
      expect(Math.abs(pts[i * 3 + 2])).toBeLessThanOrEqual(0.03);
    }
    expect(minX).toBeGreaterThanOrEqual(-1.32);
    expect(maxX).toBeLessThanOrEqual(1.32);
  });

  it('reuses samples when there are fewer pixels than points', () => {
    const { px, w, h } = block();
    const pts = textToPoints(px, w, h, 500, 2, 3); // only 50 grid samples
    expect(pts.every(Number.isFinite)).toBe(true);
    expect(pts[499 * 3]).not.toBe(0);
  });

  it('returns zeros for an empty image', () => {
    const pts = textToPoints(new Uint8ClampedArray(16 * 4), 4, 4, 5, 2, 1);
    expect(Array.from(pts).every((v) => v === 0)).toBe(true);
  });
});
