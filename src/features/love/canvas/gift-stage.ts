import { useSyncExternalStore } from 'react';

// Blueprint 085: the one shared gift Canvas (frameloop "demand") registers its invalidate here,
// so GiftBox timelines can request frames without importing three.
let invalidate: () => void = () => {};
let ready = false;
const listeners = new Set<() => void>();

export function registerGiftStage(fn: (() => void) | null) {
  invalidate = fn ?? (() => {});
  ready = fn !== null;
  listeners.forEach((l) => l());
}

export const requestGiftFrame = () => invalidate();

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export const useGiftStageReady = () =>
  useSyncExternalStore(
    subscribe,
    () => ready,
    () => false,
  );
