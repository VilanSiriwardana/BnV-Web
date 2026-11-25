import type { PhotoRef } from '../config';

// Gallery walk (Phase 12): mutable state shared by the story (GSAP), the canvas rig and the DOM.
// Per-frame values only; never React state.
export type CameraOwner = 'story' | 'gallery';
export type FrameScreen = { x: number; y: number; r: number; visible: boolean };

export const galleryState = {
  active: false, // corridor visible
  progress: 0, // raw stage progress 0..1 (entrance, then walk), written by ScrollTrigger
  walk: 0, // walk progress 0..1 (gallery-path.ts walkProgress)
  cameraOwner: 'story' as CameraOwner,
  /** Set when the gallery hands the camera back; the rig restores rotation and fov once. */
  releasePending: false,
  /**
   * Inspect blend (gallery-director.ts tweens it): the camera eases from pose `from` to pose
   * `to`, where -1 is the walk pose and k is inspect index k.
   */
  from: -1,
  to: -1,
  blend: 0,
  hovered: -1,
  focused: -1,
  screen: [] as FrameScreen[], // projected frame centre + radius per inspect index, CSS px
  /** Blueprint 061: the arch plaque's projected centre and width (CSS px), and its fade-in 0..1. */
  welcome: { x: 0, y: 0, w: 0, ready: false, seat: 0 },
};

/** 0 = walking, 1 = fully on a frame. */
export function inspectWeight() {
  const { from, to, blend } = galleryState;
  if (from === -1) return to === -1 ? 0 : blend;
  return to === -1 ? 1 - blend : 1;
}

/** The frame currently in focus (the one the camera is on or heading to), or -1. */
export function inspectIndex() {
  const { from, to, blend } = galleryState;
  return blend >= 0.5 ? to : from;
}

export function setFocusedFrame(k: number) {
  galleryState.focused = k;
}

export function clearFocusedFrame(k?: number) {
  if (k === undefined || galleryState.focused === k) galleryState.focused = -1;
}

export function claimCamera() {
  galleryState.active = true;
  galleryState.cameraOwner = 'gallery';
  galleryState.releasePending = false;
}

export function releaseCamera() {
  if (galleryState.cameraOwner !== 'gallery') return;
  galleryState.active = false;
  galleryState.cameraOwner = 'story';
  galleryState.releasePending = true;
  galleryState.from = galleryState.to = -1;
  galleryState.blend = 0;
  galleryState.hovered = -1;
}

/** Inspectable photos in walk order: the gallery, then the end portrait (falls back to gallery[0]). */
export function galleryPhotos(gallery: PhotoRef[], galleryEnd?: PhotoRef) {
  return [...gallery, galleryEnd ?? gallery[0]].filter(Boolean);
}
