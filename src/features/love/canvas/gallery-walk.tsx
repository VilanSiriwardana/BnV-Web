'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { Group, Object3D } from 'three';

import type { PhotoRef } from '../config';
import {
  END_MAX,
  GALLERY_ORIGIN,
  PHOTO_MAX,
  createGalleryCurve,
  createSlots,
  frameSize,
  inspectOrder,
} from '../engine/gallery-path';
import { galleryPhotos, galleryState } from '../engine/gallery-state';
import type { Tier } from '../engine/tiers';
import { GalleryCameraRig } from './gallery-camera-rig';
import { GalleryCorridor } from './gallery-corridor';
import { GalleryFrames } from './gallery-frames';
import { FOG, GalleryLights } from './gallery-lights';
import { GalleryRitual } from './gallery-ritual';

/** Gilded border on both sides, metres (gallery-frames.tsx BORDER × 2). */
const FRAME_EDGE = 0.18;

type Props = { tier: Tier; gallery: PhotoRef[]; galleryEnd?: PhotoRef };

// Phase 12 scene root: built once, shown only while the gallery owns the camera.
export function GalleryWalk({ tier, gallery, galleryEnd }: Props) {
  const curve = useMemo(() => createGalleryCurve(), []);
  const slots = useMemo(() => createSlots(gallery.length), [gallery.length]);
  const order = useMemo(() => inspectOrder(slots), [slots]);
  const photos = useMemo(
    () => galleryPhotos(gallery, galleryEnd),
    [gallery, galleryEnd],
  );
  const sizes = useMemo(
    () =>
      order.map((slot, k) => {
        const s = frameSize(
          photos[k],
          slot.kind === 'end' ? END_MAX : PHOTO_MAX,
        );
        return { w: s.w + FRAME_EDGE, h: s.h + FRAME_EDGE };
      }),
    [order, photos],
  );
  const group = useRef<Group>(null);

  useFrame(() => {
    if (group.current) group.current.visible = galleryState.active;
  });

  // Blueprint 071: compile the corridor (with its fog) while idle, so the reveal never stalls.
  const get = useThree((s) => s.get);
  useEffect(() => {
    let cancelled = false;
    const warm = async () => {
      const g = group.current;
      if (cancelled || !g || galleryState.active) return;
      const { gl, scene, camera } = get();
      const fog = scene.fog;
      // Blueprint 086: shards, sparks, hammer, door light and key are hidden until their moment;
      // three skips invisible objects, so reveal them for the compile too.
      const hidden: Object3D[] = [];
      g.traverse((o) => {
        if (o !== g && !o.visible) hidden.push(o);
      });
      hidden.forEach((o) => (o.visible = true));
      g.visible = true;
      scene.fog = FOG;
      // compileAsync builds the programs synchronously; restore before the next frame renders.
      const done = gl.compileAsync(scene, camera);
      scene.fog = fog;
      hidden.forEach((o) => (o.visible = false));
      g.visible = galleryState.active;
      await done.catch(() => undefined);
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => void warm(), { timeout: 4000 })
      : window.setTimeout(() => void warm(), 1500);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [get]);

  return (
    <>
      <group ref={group} position={GALLERY_ORIGIN} visible={false}>
        <GalleryCorridor curve={curve} />
        <GalleryFrames
          curve={curve}
          slots={slots}
          photos={photos}
          tier={tier}
        />
        <GalleryLights curve={curve} slots={slots} tier={tier} />
        <GalleryRitual curve={curve} tier={tier} />
      </group>
      <GalleryCameraRig curve={curve} order={order} sizes={sizes} />
    </>
  );
}
