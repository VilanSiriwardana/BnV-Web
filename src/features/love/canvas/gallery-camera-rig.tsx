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
import { useMotionPrefs } from '../engine/motion-prefs';

const { damp, lerp } = MathUtils;
// Narrow (portrait) screens widen the walk view so the doorway and both corridor walls stay in frame.
const walkFov = (aspect: number) => (aspect < 1 ? 70 : 55);
// ...and pull the walk camera back a touch so the keyhole glass box and side walls clear the edges.
const walkPullback = (aspect: number) => (aspect < 1 ? 1.4 : 0);
// Narrow (portrait) screens widen the inspect view so a frame fits inside the corridor width.
const inspectFov = (aspect: number) => (aspect < 1 ? 62 : 48);
const STORY_FOV = 45; // love-canvas.tsx camera
const posA = new Vector3();
const lookA = new Vector3();
const posB = new Vector3();
const lookB = new Vector3();
const kickOffset = new Vector3();
const backOff = new Vector3();
const fromPos = new Vector3();
const fromLook = new Vector3();
// Blueprint 086: entering eases from wherever the story camera was instead of snapping.
const ENTER_S = 0.3;
const RELEASE_RATE = 10;

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
  const enter = useRef(1);
  const fromFov = useRef(STORY_FOV);
  const { calm } = useMotionPrefs();

  function pose(index: number, aspect: number, pos: Vector3, look: Vector3) {
    const slot = order[index];
    if (index < 0 || !slot) {
      walkPose(curve, smooth.current, pos, look);
      const pull = walkPullback(aspect);
      if (pull)
        pos.addScaledVector(backOff.subVectors(pos, look).normalize(), pull);
      return walkFov(aspect);
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
      if (galleryState.releasePending) {
        galleryState.releasePending = false;
        cam.rotation.set(0, 0, 0);
        if (calm) cam.fov = STORY_FOV;
        cam.updateProjectionMatrix();
      }
      // Ease the fov home over a few frames rather than in one.
      if (Math.abs(cam.fov - STORY_FOV) > 1e-3) {
        cam.fov = damp(cam.fov, STORY_FOV, RELEASE_RATE, delta);
        if (Math.abs(cam.fov - STORY_FOV) < 0.01) cam.fov = STORY_FOV;
        cam.updateProjectionMatrix();
      }
      return;
    }
    if (!owned.current) {
      enter.current = calm ? 1 : 0;
      fromPos.copy(cam.position);
      cam.getWorldDirection(fromLook).add(cam.position);
      fromFov.current = cam.fov;
    }
    // Entering jumps the walk to the current scroll spot; the camera itself eases in (ENTER_S).
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
    let fov = lerp(fovA, fovB, blend);
    if (enter.current < 1) {
      enter.current = Math.min(1, enter.current + delta / ENTER_S);
      const e = 1 - (1 - enter.current) ** 3;
      posA.lerpVectors(fromPos, posA, e);
      lookA.lerpVectors(fromLook, lookA, e);
      fov = lerp(fromFov.current, fov, e);
    }
    cam.position.copy(posA);
    if (kick) cam.position.add(kickOffset.set(0.015 * kick, -0.01 * kick, 0));
    cam.lookAt(lookA);
    if (Math.abs(cam.fov - fov) > 1e-3) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
