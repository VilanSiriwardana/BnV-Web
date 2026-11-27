import { SRGBColorSpace, type Texture, TextureLoader } from 'three';

import type { PhotoRef } from '../config';

// Phase 12 (ADR-0036): only a window of photo textures lives on the GPU. Pure selection below;
// the loader keeps a blur placeholder until the full image arrives and disposes on eviction.

/**
 * Inspect indices to keep resident: the `count` frames nearest the camera, preferring the ones
 * ahead (a frame behind costs twice its distance). `ts` are the frames' curve parameters, `at` the
 * camera's; `pinned` (the open frame, the end portrait) is always kept.
 */
export function residentWindow(
  ts: readonly number[],
  at: number,
  count: number,
  pinned: number | readonly number[] = -1,
) {
  const ranked = ts
    .map((t, i) => ({ i, d: t >= at ? t - at : (at - t) * 2 }))
    .sort((a, b) => a.d - b.d)
    .map((r) => r.i);
  const keep = new Set(ranked.slice(0, count));
  for (const p of typeof pinned === 'number' ? [pinned] : pinned)
    if (p >= 0) keep.add(p);
  return keep;
}

/** The 1024 px variant from scripts/prepare-love-images.mjs; falls back to the original. */
export const smallSrc = (src: string) => src.replace(/\.webp$/, '-1024.webp');

const loader = new TextureLoader();

export function loadPhotoTexture(
  photo: PhotoRef,
  hiRes: boolean,
  onLoad: (t: Texture) => void,
) {
  let cancelled = false;
  const done = (t: Texture) => {
    if (cancelled) return t.dispose();
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    onLoad(t);
  };
  const full = () => loader.load(photo.src, done);
  if (hiRes) full();
  else loader.load(smallSrc(photo.src), done, undefined, full);
  return () => {
    cancelled = true;
  };
}

export function loadBlurTexture(photo: PhotoRef, onLoad: (t: Texture) => void) {
  if (!photo.blur) return;
  loader.load(photo.blur, (t) => {
    t.colorSpace = SRGBColorSpace;
    onLoad(t);
  });
}
