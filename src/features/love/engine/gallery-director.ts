import gsap from 'gsap';

import {
  type DirectorEvent,
  type DirectorState,
  WALKING,
  reduce,
} from './gallery-director-core';
import { galleryState } from './gallery-state';

// Runtime for gallery-director-core.ts: one tween on galleryState.blend at a time (ADR-0035
// motion exception: camera moves run about 1 s). Lenis stops while a frame is open and the walk
// resumes at the exact scroll spot it left.
export type GalleryIO = {
  stop: () => void;
  start: () => void;
  scrollTo: (y: number) => void;
};

const OPEN_DURATION = 1.1;
const SWITCH_DURATION = 0.9;

let state: DirectorState = WALKING;
let count = 0;
let io: GalleryIO | null = null;
let tween: gsap.core.Tween | null = null;
let savedScroll = 0;
const listeners = new Set<(s: DirectorState) => void>();

export function bindGalleryDirector(next: { count: number; io: GalleryIO }) {
  count = next.count;
  io = next.io;
  return () => {
    resetGalleryDirector();
    io = null;
  };
}

export function onGalleryDirector(fn: (s: DirectorState) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export const galleryDirectorState = () => state;

export function sendGallery(e: DirectorEvent) {
  const before = state;
  const [next, cmd] = reduce(state, e, count);
  if (next === before) return;
  state = next;

  if (before.mode === 'walk' && next.mode === 'opening') {
    savedScroll = window.scrollY;
    io?.stop();
  }
  if (cmd === 'move') move(next);
  else if (cmd === 'reverse') tween?.reverse();

  if (next.mode === 'inspect') settle(next.index);
  if (next.mode === 'walk') {
    settle(-1);
    io?.scrollTo(savedScroll);
    io?.start();
  }
  listeners.forEach((fn) => fn(state));
}

function move(s: DirectorState) {
  tween?.kill();
  galleryState.from = s.index;
  galleryState.to = s.target;
  galleryState.blend = 0;
  const done = () => sendGallery({ type: 'done' });
  tween = gsap.to(galleryState, {
    blend: 1,
    duration: s.mode === 'switching' ? SWITCH_DURATION : OPEN_DURATION,
    ease: 'power2.inOut',
    onComplete: done,
    onReverseComplete: done,
  });
}

function settle(index: number) {
  tween?.kill();
  tween = null;
  galleryState.from = index;
  galleryState.to = -1;
  galleryState.blend = 0;
}

/** Section left or story rebuilt: drop any open frame without moving the scroll. */
export function resetGalleryDirector() {
  const wasOpen = state.mode !== 'walk';
  tween?.kill();
  tween = null;
  state = WALKING;
  galleryState.from = galleryState.to = -1;
  galleryState.blend = 0;
  if (wasOpen) io?.start();
  listeners.forEach((fn) => fn(state));
}
