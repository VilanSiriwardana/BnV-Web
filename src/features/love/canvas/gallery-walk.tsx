'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';

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
import { GalleryLights } from './gallery-lights';
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
