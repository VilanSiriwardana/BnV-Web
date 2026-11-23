'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import {
  type CatmullRomCurve3,
  MathUtils,
  type PerspectiveCamera,
  Vector3,
} from 'three';

import {
  type FrameSlot,
  GALLERY_ORIGIN,
  fitDistance,
  inspectPose,
  walkPose,
} from '../engine/gallery-path';
import { decayRitualKick, ritualState } from '../engine/gallery-ritual';
import { galleryState } from '../engine/gallery-state';

const { damp, lerp } = MathUtils;
const WALK_FOV = 55;
// Narrow (portrait) screens widen the inspect view so a frame fits inside the corridor width.
const inspectFov = (aspect: number) => (aspect < 1 ? 62 : 48);
const STORY_FOV = 45; // love-canvas.tsx camera
const posA = new Vector3();
const lookA = new Vector3();
const posB = new Vector3();
const lookB = new Vector3();
const kickOffset = new Vector3();

type Props = {
  curve: CatmullRomCurve3;
  order: FrameSlot[];
  /** Frame size (metres, border included) per inspect index. */
  sizes: { w: number; h: number }[];
};

// Phase 12 (ADR-0035): writes the camera only while the gallery owns it; heart.tsx skips its
// camera writes meanwhile. Inspect moves blend between two poses (gallery-director.ts tweens the
// blend). On release it restores rotation and fov once; heart.tsx snaps z back.
export function GalleryCameraRig({ curve, order, sizes }: Props) {
  const smooth = useRef(0);
  const owned = useRef(false);

  function pose(index: number, aspect: number, pos: Vector3, look: Vector3) {
    const slot = order[index];
    if (index < 0 || !slot) {
      walkPose(curve, smooth.current, pos, look);
      return WALK_FOV;
    }
    const s = sizes[index] ?? { w: 1, h: 1 };
    const fov = inspectFov(aspect);
    inspectPose(curve, slot, fitDistance(s.w, s.h, fov, aspect), pos, look);
    return fov;
  }

  useFrame((state, delta) => {
    const cam = state.camera as PerspectiveCamera;
    if (galleryState.cameraOwner !== 'gallery') {
      owned.current = false;
      if (!galleryState.releasePending) return;
      galleryState.releasePending = false;
      cam.rotation.set(0, 0, 0);
      cam.fov = STORY_FOV;
      cam.updateProjectionMatrix();
      return;
    }
    // Entering (or re-entering) jumps straight to the current scroll spot: never fly in.
    smooth.current = owned.current
      ? damp(smooth.current, galleryState.walk, 3.5, delta)
      : galleryState.walk;
    owned.current = true;

    const { from, to, blend } = galleryState;
    const fovA = pose(from, cam.aspect, posA, lookA);
    const fovB = pose(to, cam.aspect, posB, lookB);
    posA.lerp(posB, blend).add(GALLERY_ORIGIN);
    lookA.lerp(lookB, blend).add(GALLERY_ORIGIN);
    // Strike kick from the unlock ritual (decays within ~150 ms).
    decayRitualKick(delta);
    const kick = ritualState.kick;
    cam.position.copy(posA);
    if (kick) cam.position.add(kickOffset.set(0.015 * kick, -0.01 * kick, 0));
    cam.lookAt(lookA);
    const fov = lerp(fovA, fovB, blend);
    if (Math.abs(cam.fov - fov) > 1e-3) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
