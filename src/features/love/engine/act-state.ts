import { useSyncExternalStore } from 'react';

// Blueprint 089: sections whose 3D act may mount. Only ever grows, so an act never unmounts.
const near = new Set<string>();
const listeners = new Set<() => void>();
let version = 0;

export function markNear(id: string) {
  if (near.has(id)) return;
  near.add(id);
  version++;
  listeners.forEach((fn) => fn());
}

export function markAllNear() {
  document
    .querySelectorAll<HTMLElement>('[data-love-section]')
    .forEach((el) => markNear(el.id));
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useNear(id: string) {
  useSyncExternalStore(
    subscribe,
    () => version,
    () => 0,
  );
  return near.has(id);
}
