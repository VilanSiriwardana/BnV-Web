// Romance Additions F4: story.ts buildReasons writes scroll progress (0..1) and whether the stage is
// on screen; the ring (ui/reasons-ring.tsx) reads both from its ticker.
// Blueprint 066: `leaving`/`exit` (px past the pin end) let the closed book scroll away with it.
export const reasons = { progress: 0, active: false, leaving: false, exit: 0 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Blueprint 065: the book's scroll segments. One for the cover, one per leaf turn (n − 1),
 * one to close the book. `page` is the 1-based spread on show (0 while the cover is shut).
 */
export function bookPhase(p: number, n: number) {
  const s = clamp01(p) * (n + 1);
  const cover = clamp01(s);
  const turned = Math.min(Math.max(0, n - 1), Math.max(0, s - 1));
  const close = clamp01(s - n);
  const page = cover < 0.5 ? 0 : Math.min(n, Math.floor(turned + 0.5) + 1);
  return { cover, turned, close, page };
}

/** Scroll progress that centres spread i (0-based) on screen. */
export function bookProgressFor(i: number, n: number) {
  return Math.min(1, (i + 1.2) / (n + 1));
}
