import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import manifest from './dance-manifest.json';
import { decodeDancePoints } from './dance-points';

describe('decodeDancePoints', () => {
  it('decodes positions, colours and flags', () => {
    const count = 2;
    const bytes = new Uint8Array(count * 8);
    new Uint16Array(bytes.buffer, 0, 4).set([0, 0, 65535, 65535]);
    bytes.set([255, 0, 0, 3, 0, 255, 0, 0], count * 4);
    const d = decodeDancePoints(bytes.buffer, {
      count,
      xRange: 1.2,
      yRange: 2.2,
    });
    expect(d.positions).toHaveLength(1);
    expect(d.positions[0][0]).toBeCloseTo(-1.2);
    expect(d.positions[0][3]).toBeCloseTo(2.2);
    expect(Array.from(d.colors[0].slice(0, 3))).toEqual([1, 0, 0]);
    expect(Array.from(d.flags[0])).toEqual([1, 1, 0, 0]);
  });
});

describe('traced couple (public/dance-reel/points.bin)', () => {
  const file = readFileSync(
    path.join(process.cwd(), 'public', 'dance-reel', 'points.bin'),
  );
  const buffer = file.buffer.slice(
    file.byteOffset,
    file.byteOffset + file.byteLength,
  );
  const d = decodeDancePoints(buffer, manifest);

  it('has one cloud per pose in the manifest', () => {
    expect(d.positions).toHaveLength(manifest.poses.length);
  });

  it('keeps both dancers in any small prefix', () => {
    for (const flags of d.flags) {
      let him = 0;
      for (let i = 0; i < 1000; i++) him += flags[i * 2 + 1];
      expect(him).toBeGreaterThan(200);
      expect(him).toBeLessThan(800);
    }
  });

  it('stands on the floor at about two units tall', () => {
    for (const pos of d.positions) {
      let lo = Infinity;
      let hi = -Infinity;
      for (let i = 1; i < pos.length; i += 2) {
        lo = Math.min(lo, pos[i]);
        hi = Math.max(hi, pos[i]);
      }
      expect(lo).toBeLessThan(0.05);
      expect(hi).toBeGreaterThan(1.7);
    }
  });

  it('moves each particle only locally between poses', () => {
    for (let k = 0; k + 1 < d.positions.length; k++) {
      const a = d.positions[k];
      const b = d.positions[k + 1];
      const travel = Array.from({ length: d.count }, (_, i) =>
        Math.hypot(a[i * 2] - b[i * 2], a[i * 2 + 1] - b[i * 2 + 1]),
      ).sort((x, y) => x - y);
      expect(travel[d.count >> 1]).toBeLessThan(0.35);
    }
  });
});
