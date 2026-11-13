// Per-pass flags (Experience §14). Replay clears them; the letter stays unlocked (not stored here).
export const session = {
  wishDone: false,
  finalePlayed: false,
  replayArmed: false, // true after Replay until the hero weave has played again
};

const listeners = new Set<() => void>();

export function onSessionReset(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// Phase 5 §11: callers also run director.settle() and ScrollTrigger.refresh() (kept out of this
// module so it stays free of GSAP and testable).
export function resetSession() {
  session.wishDone = false;
  session.finalePlayed = false;
  session.replayArmed = true;
  listeners.forEach((fn) => fn());
}
