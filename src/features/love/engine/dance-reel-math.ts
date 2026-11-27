// Blueprint 080: pure frame math for the Dance Reel player (engine/dance-reel-player.ts).
export const REEL_WINDOW = { desktop: 16, mobile: 12 } as const;

const clamp01 = (k: number) => Math.min(1, Math.max(0, k || 0));

// 0..1 scroll → nearest frame index.
export const frameAt = (progress: number, count: number) =>
  Math.round(clamp01(progress) * Math.max(0, count - 1));

// Decoded window around a frame, clamped to the clip (no wrap).
export const windowAround = (index: number, radius: number, count: number) => ({
  from: Math.max(0, index - radius),
  to: Math.min(count - 1, index + radius),
});

// First frame, then every `stride`th, then the rest, so a coarse scrub works early.
export function loadOrder(count: number, stride = 8) {
  const coarse: number[] = [];
  for (let i = 0; i < count; i += stride) coarse.push(i);
  const rest: number[] = [];
  for (let i = 0; i < count; i++) if (i % stride) rest.push(i);
  return [...coarse, ...rest];
}
