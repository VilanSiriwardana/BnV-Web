import { KEYFRAMES } from '../canvas/dance-silhouettes';

// Experience §19.6: scroll writes `t` (0..1) and `visible`; canvas/dance-duo.tsx reads poseAt(t) per frame.
export const dance = { t: 0, visible: 0 };

// Blueprint 079: share of each step spent holding the pose, and the last part of the stage held on the dip.
export const DANCE_HOLD = 0.25;
export const DANCE_SLOW = 0.12;

const clamp01 = (k: number) => Math.min(1, Math.max(0, k));
const ease = (k: number) => k * k * (3 - 2 * k);
const LAST = KEYFRAMES.length - 1;

// 0..1 scroll → the keyframe pair and the eased blend between them.
export function poseAt(t: number) {
  const x = (clamp01(t / (1 - DANCE_SLOW)) || 0) * LAST;
  const index = Math.min(Math.floor(x), LAST - 1);
  const k = ease(clamp01((x - index - DANCE_HOLD) / (1 - DANCE_HOLD)));
  return { index, k };
}

// Progress at which keyframe `i` is fully reached.
export const keyAt = (i: number) => ((1 - DANCE_SLOW) * i) / LAST;

// Close hold, twirl, dip (keyframes 2, 4 and the last).
export const DANCE_BEATS = [
  { at: keyAt(2), event: 'hold' },
  { at: keyAt(4), event: 'twirl' },
  { at: keyAt(LAST) + 0.02, event: 'dip' },
] as const;
export const BEAT_REARM = 0.1;

// Frame-rate independent ease toward the scroll target.
export const damp = (current: number, target: number, dt: number, rate = 8) =>
  current + (target - current) * (1 - Math.exp(-rate * dt));
