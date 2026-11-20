import { describe, expect, it } from 'vitest';

import { mulberry32 } from '../canvas/heart-geometry';
import {
  analyseFrame,
  calibrate,
  createBlowState,
  updateBlow,
  type BlowState,
} from './blow-detector';

const BINS = 1024;
const BIN_HZ = 48000 / 2048;
const FRAME_MS = 16;

function timeAt(rms: number) {
  // A square wave of amplitude rms has exactly that rms.
  return Float32Array.from({ length: 2048 }, (_, i) => (i % 2 ? rms : -rms));
}

function spectrum(fn: (hz: number, rand: () => number) => number, seed = 3) {
  const rand = mulberry32(seed);
  return Float32Array.from({ length: BINS }, (_, i) => fn(i * BIN_HZ, rand));
}

// Breath: noisy (exponentially distributed power), energy mostly below 500 Hz.
const breath = (seed: number) =>
  spectrum((hz, r) => -Math.log(1 - r() * 0.999) * (hz < 500 ? 1 : 0.02), seed);
const tone = spectrum((hz) => (Math.abs(hz - 300) < BIN_HZ / 2 ? 1 : 1e-7));
const harmonics = spectrum((hz) => {
  const k = Math.round(hz / 150);
  return k > 0 && Math.abs(hz - k * 150) < BIN_HZ / 2 ? 1 / k : 1e-7;
});
const silence = spectrum(() => 1e-9);

function run(
  frames: number,
  frame: (i: number) => { power: Float32Array; rms: number },
  start: BlowState = createBlowState(),
) {
  let s = start;
  for (let i = 0; i < frames; i++) {
    const { power, rms } = frame(i);
    const f = analyseFrame(power, timeAt(rms), BIN_HZ);
    s = updateBlow(s, f.rms, f.lowRatio, f.flatness, FRAME_MS);
  }
  return s;
}

describe('analyseFrame', () => {
  it('reads breath as low-heavy and flat', () => {
    const f = analyseFrame(breath(1), timeAt(0.15), BIN_HZ);
    expect(f.rms).toBeCloseTo(0.15, 5);
    expect(f.lowRatio).toBeGreaterThan(0.5);
    expect(f.flatness).toBeGreaterThan(0.25);
  });

  it('reads a pure tone and a harmonic stack as peaky', () => {
    expect(analyseFrame(tone, timeAt(0.2), BIN_HZ).flatness).toBeLessThan(0.05);
    expect(analyseFrame(harmonics, timeAt(0.2), BIN_HZ).flatness).toBeLessThan(
      0.25,
    );
  });
});

describe('updateBlow', () => {
  it('never blows in silence', () => {
    expect(run(120, () => ({ power: silence, rms: 0 })).blow).toBe(0);
  });

  it('fills on breath-level noise', () => {
    expect(run(90, (i) => ({ power: breath(i + 1), rms: 0.15 })).blow).toBe(1);
  });

  it('never blows on a pure tone or speech-like harmonics', () => {
    expect(run(120, () => ({ power: tone, rms: 0.2 })).blow).toBe(0);
    expect(run(120, () => ({ power: harmonics, rms: 0.2 })).blow).toBe(0);
  });

  it('decays when the input stops', () => {
    const blown = { baseline: 0.01, blow: 0.6 };
    const after = run(30, () => ({ power: silence, rms: 0 }), blown);
    expect(after.blow).toBeLessThan(0.6);
    expect(run(120, () => ({ power: silence, rms: 0 }), blown).blow).toBe(0);
  });

  it('calibrates the baseline from room noise', () => {
    expect(calibrate([0.02, 0.04]).baseline).toBeCloseTo(0.03);
    expect(calibrate([]).blow).toBe(0);
  });
});
