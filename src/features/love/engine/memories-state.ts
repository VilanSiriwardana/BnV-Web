// Memories (Experience §8): mutable state shared by the orbs (canvas) and the section (DOM).
// Per-frame values only; React state is touched once per open.
export type OrbScreen = { x: number; y: number; r: number; visible: boolean };
export type OpenRequest = { index: number; origin: { x: number; y: number } };

export const memoriesState = {
  active: false, // memories stage on screen (orbs visible and interactive)
  hovered: -1,
  focused: -1,
  screen: [] as OrbScreen[], // projected orb centre + radius, CSS px
};

export function setFocusedOrb(i: number) {
  memoriesState.focused = i;
}

export function clearFocusedOrb(i?: number) {
  if (i === undefined || memoriesState.focused === i)
    memoriesState.focused = -1;
}

const listeners = new Set<(req: OpenRequest) => void>();

export function onOpenMemory(fn: (req: OpenRequest) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function requestOpenMemory(index: number) {
  const s = memoriesState.screen[index];
  const origin = s?.visible
    ? { x: s.x, y: s.y }
    : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  listeners.forEach((fn) => fn({ index, origin }));
}
