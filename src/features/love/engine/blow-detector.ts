// Romance Additions F5 / ADR-0033. Pure: no Web Audio here, so it can be tested with synthetic frames.
// Thresholds are defaults, pending real-device tuning (debug panel "Mic test").
export const BLOW_THRESHOLDS = {
  minRms: 0.05, // absolute floor for "loud"
  baselineFactor: 3, // loud = rms above baseline × this
  lowRatio: 0.5, // share of 0–4 kHz energy below LOW_HZ
  flatness: 0.25, // spectral flatness of the low band (breath ≈ 0.5, voiced speech ≪ 0.2)
  gain: 6, // rms over baseline → intensity
  riseMs: 600, // full intensity fills blow in this long
  decayMs: 900, // blow empties in this long when she stops
};
export const LOW_HZ = 500;
export const TOP_HZ = 4000;
export const CALIBRATE_MS = 400;

export type BlowState = { baseline: number; blow: number };
export type BlowFeatures = { rms: number; lowRatio: number; flatness: number };

export const createBlowState = (baseline = 0.01): BlowState => ({
  baseline,
  blow: 0,
});

// power: linear power per FFT bin (10^(dB/10)); time: time-domain samples in -1..1.
export function analyseFrame(
  power: Float32Array,
  time: Float32Array,
  binHz: number,
): BlowFeatures {
  let sq = 0;
  for (let i = 0; i < time.length; i++) sq += time[i] * time[i];
  const rms = time.length ? Math.sqrt(sq / time.length) : 0;

  const lowEnd = Math.max(2, Math.round(LOW_HZ / binHz));
  const topEnd = Math.min(power.length, Math.round(TOP_HZ / binHz));
  let low = 0;
  let all = 0;
  let logSum = 0;
  // Bin 0 (DC) is skipped.
  for (let i = 1; i < topEnd; i++) {
    const p = power[i];
    all += p;
    if (i < lowEnd) {
      low += p;
      logSum += Math.log(p + 1e-12);
    }
  }
  const n = lowEnd - 1;
  const mean = low / n;
  const flatness = mean > 0 ? Math.exp(logSum / n) / mean : 0;
  return { rms, lowRatio: all > 0 ? low / all : 0, flatness };
}

export function updateBlow(
  s: BlowState,
  rms: number,
  lowRatio: number,
  flatness: number,
  dtMs: number,
  t = BLOW_THRESHOLDS,
): BlowState {
  const loud = rms > Math.max(t.minRms, s.baseline * t.baselineFactor);
  const breathy = lowRatio > t.lowRatio && flatness > t.flatness;
  const intensity =
    loud && breathy ? Math.min(1, (rms - s.baseline) * t.gain) : 0;
  const blow = Math.min(
    1,
    Math.max(
      0,
      s.blow +
        (intensity > 0 ? (intensity * dtMs) / t.riseMs : -dtMs / t.decayMs),
    ),
  );
  // Adapt only while quiet, so a long blow never raises its own bar.
  const baseline =
    intensity === 0 ? s.baseline * 0.98 + rms * 0.02 : s.baseline;
  return { baseline, blow };
}

// Mean rms over the calibration window becomes the starting baseline.
export function calibrate(samples: number[]): BlowState {
  const mean = samples.length
    ? samples.reduce((a, b) => a + b, 0) / samples.length
    : 0.01;
  return createBlowState(Math.max(0.005, mean));
}
