// Confetti launch signal (Experience §3.6). Written by the director, read by canvas/confetti.tsx.
// Kept free of three.js so engine code never pulls the 3D chunk into the route bundle.
export const LIFE_S = 4;
const MIN_GAP_MS = 1500;

export const confetti = {
  launchedAt: -Infinity, // performance.now() ms
  scale: 1, // 1 = full tier count, smaller for a "little" confetti
};

// One launch at a time (Phase 5 §11).
export function launchConfetti(scale = 1) {
  const now = performance.now();
  if (now - confetti.launchedAt < MIN_GAP_MS) return false;
  confetti.launchedAt = now;
  confetti.scale = scale;
  return true;
}
