import manifest from '../canvas/dance-manifest.json';

// Blueprint 088: one pose per traced reference still (scripts/prepare-dance-points.mjs).
export type DancePose = {
  name: string;
  beat?: 'hold' | 'twirl' | 'dip';
  span?: number;
};
export const DANCE_POSES = manifest.poses as DancePose[];

// Experience §19.6: scroll writes `t` (0..1) and `visible`; canvas/dance-duo.tsx reads poseAt(t) per frame.
export const dance = { t: 0, visible: 0 };

// Blueprint 085: poses flow through without a hold; only beat keyframes rest for BEAT_HOLD of their step.
// The last part of the stage is held on the dip.
export const DANCE_HOLD = 0;
export const BEAT_HOLD = 0.35;
export const DANCE_SLOW = 0.12;

const clamp01 = (k: number) => Math.min(1, Math.max(0, k));
const ease = (k: number) => k * k * (3 - 2 * k);
const easeIn = (k: number) => k * k * (2 - k);
const easeOut = (k: number) => k + k * k - k * k * k;
const LAST = DANCE_POSES.length - 1;
// Blueprint 086: the twirl beat fires mid-turn, so only the hold and the dip rest.
export const restsOn = (f: DancePose) => f.beat === 'hold' || f.beat === 'dip';
// Cumulative scroll share at each keyframe; a keyframe's `span` sizes the step leaving it.
const EDGES = DANCE_POSES.reduce<number[]>(
  (e, f, i) => (i < LAST ? [...e, e[i] + (f.span ?? 1)] : e),
  [0],
);
const TOTAL = EDGES[LAST];

// 0..1 scroll → the keyframe index and the blend toward the next one (the spline shapes the path);
// it eases out of a rest and into the next one, and runs linearly through every other pose.
export function poseAt(t: number) {
  const x = (clamp01(t / (1 - DANCE_SLOW)) || 0) * TOTAL;
  let index = 0;
  while (index < LAST - 1 && EDGES[index + 1] <= x) index++;
  const from = restsOn(DANCE_POSES[index]);
  const to = restsOn(DANCE_POSES[index + 1]);
  const hold = from ? BEAT_HOLD : DANCE_HOLD;
  const local = (x - EDGES[index]) / (EDGES[index + 1] - EDGES[index]);
  const raw = clamp01((local - hold) / (1 - hold));
  const k =
    from && to ? ease(raw) : from ? easeIn(raw) : to ? easeOut(raw) : raw;
  return { index, k };
}

// Progress at which keyframe `i` is fully reached.
export const keyAt = (i: number) => ((1 - DANCE_SLOW) * EDGES[i]) / TOTAL;

// Close hold, twirl, dip: the keyframes flagged with a beat.
export const DANCE_BEATS = DANCE_POSES.flatMap((f, i) =>
  f.beat
    ? [{ at: keyAt(i) + (f.beat === 'dip' ? 0.02 : 0), event: f.beat }]
    : [],
) as { at: number; event: NonNullable<DancePose['beat']> }[];
export const BEAT_REARM = 0.1;

// Frame-rate independent ease toward the scroll target.
export const damp = (current: number, target: number, dt: number, rate = 5) =>
  current + (target - current) * (1 - Math.exp(-rate * dt));
