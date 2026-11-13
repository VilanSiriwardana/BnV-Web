// Experience §19.6: scroll writes `t` (0..1) and `visible`; the canvas reads frameAt(t) per frame.
export const dance = { t: 0, visible: 0 };

// Must match FRAME_COUNT in canvas/dance-silhouettes.ts (kept three-free here).
export const DANCE_FRAME_COUNT = 32;
const KEYFRAME_COUNT = 10;
// Share of each step spent holding the pose before easing to the next one.
const HOLD = 0.3;

const ease = (k: number) => k * k * (3 - 2 * k);

// 0..1 scroll → 0..31 frame position, pausing briefly on each keyframe.
export function frameAt(t: number) {
  const last = DANCE_FRAME_COUNT - 1;
  const x = Math.min(1, Math.max(0, t)) * (KEYFRAME_COUNT - 1);
  const i = Math.min(Math.floor(x), KEYFRAME_COUNT - 2);
  const k = (x - i - HOLD) / (1 - HOLD);
  return (
    ((i + ease(Math.min(1, Math.max(0, k)))) * last) / (KEYFRAME_COUNT - 1)
  );
}
