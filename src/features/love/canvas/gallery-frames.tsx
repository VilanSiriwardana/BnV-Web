'use client';

import { type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  BoxGeometry,
  type CatmullRomCurve3,
  Color,
  type InstancedMesh,
  MathUtils,
  type Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  type Texture,
  Vector3,
} from 'three';

import type { PhotoRef } from '../config';
import { sendGallery } from '../engine/gallery-director';
import {
  END_MAX,
  type FrameSlot,
  PHOTO_MAX,
  WALK_END,
  frameSize,
  hangAt,
  inspectOrder,
} from '../engine/gallery-path';
import {
  galleryState,
  inspectIndex,
  inspectWeight,
} from '../engine/gallery-state';
import {
  loadBlurTexture,
  loadPhotoTexture,
  residentWindow,
} from '../engine/gallery-textures';
import { TIERS, type Tier } from '../engine/tiers';
import { mirrorTexture, oldMapTexture } from './gallery-surfaces';
import { CURSOR_POINTER } from '../ui/cursor-svgs';
import { projectRadius, projectToScreen } from './projection';

const { damp } = MathUtils;
const BORDER = 0.09;
const MAT = 0.035;
const DECOR = ['map', 'mirror', 'empty', 'map'] as const;
const RESIDENCY_EVERY = 0.15; // seconds
const PLACEHOLDER = new Color('#3a2a30');
const tmp = new Vector3();

type Hung = {
  slot: FrameSlot;
  center: Vector3;
  facing: Vector3;
  yaw: number;
  w: number;
  h: number;
  decor?: (typeof DECOR)[number];
};

type Props = {
  curve: CatmullRomCurve3;
  slots: FrameSlot[];
  /** Inspectable photos in walk order: the gallery, then the end portrait. */
  photos: PhotoRef[];
  tier: Tier;
};

// Phase 12 §7 Frames: gilded photo frames (clickable), decor (never interactive) and the end
// portrait. Pointer handling mirrors memory-orbs.tsx; photo textures follow a residency window.
export function GalleryFrames({ curve, slots, photos, tier }: Props) {
  const { camera, size } = useThree();
  const order = useMemo(() => inspectOrder(slots), [slots]);

  const hung = useMemo<Hung[]>(() => {
    let d = 0;
    return slots.map((slot) => {
      const center = new Vector3();
      const facing = new Vector3();
      hangAt(curve, slot, center, facing);
      const yaw = Math.atan2(facing.x, facing.z);
      if (slot.kind === 'decor') {
        const decor = DECOR[d++ % DECOR.length];
        const dims =
          decor === 'mirror' ? { w: 0.62, h: 1 } : { w: 0.9, h: 0.68 };
        return { slot, center, facing, yaw, decor, ...dims };
      }
      const k = order.indexOf(slot);
      const dims = frameSize(
        photos[k],
        slot.kind === 'end' ? END_MAX : PHOTO_MAX,
      );
      return { slot, center, facing, yaw, ...dims };
    });
  }, [curve, slots, order, photos]);

  // Gold borders and ivory mats: two instanced draws for every frame, decor included.
  const borders = useRef<InstancedMesh>(null);
  const mats = useRef<InstancedMesh>(null);
  const shared = useMemo(
    () => ({
      box: new BoxGeometry(1, 1, 1),
      gold: new MeshStandardMaterial({
        color: '#d4ad55',
        metalness: 1,
        roughness: 0.33,
        emissive: '#3a2a08',
      }),
      ivory: new MeshStandardMaterial({ color: '#efe6d2', roughness: 0.9 }),
    }),
    [],
  );
  useEffect(() => {
    const o = new Object3D();
    hung.forEach((f, i) => {
      o.position.copy(f.center);
      o.rotation.set(0, f.yaw, 0);
      o.scale.set(f.w + BORDER * 2, f.h + BORDER * 2, 0.06);
      o.updateMatrix();
      borders.current?.setMatrixAt(i, o.matrix);
      o.position.addScaledVector(f.facing, 0.01);
      o.scale.set(f.w + MAT * 2, f.h + MAT * 2, 0.06);
      o.updateMatrix();
      mats.current?.setMatrixAt(i, o.matrix);
    });
    if (borders.current) borders.current.instanceMatrix.needsUpdate = true;
    if (mats.current) mats.current.instanceMatrix.needsUpdate = true;
  }, [hung]);

  // One basic material per inspectable photo: blur placeholder until its full image is resident.
  const photoMats = useMemo(
    () => order.map(() => new MeshBasicMaterial({ color: PLACEHOLDER })),
    [order],
  );
  const placeholders = useRef<(Texture | null)[]>([]);
  const resident = useRef(new Map<number, Texture>());
  const loading = useRef(new Map<number, () => void>());

  useEffect(() => {
    const res = resident.current;
    const load = loading.current;
    const blurs: (Texture | null)[] = [];
    placeholders.current = blurs;
    photos.forEach((p, k) =>
      loadBlurTexture(p, (t) => {
        blurs[k] = t;
        const m = photoMats[k];
        if (m && !res.has(k)) {
          m.map = t;
          m.needsUpdate = true;
        }
      }),
    );
    return () => {
      load.forEach((cancel) => cancel());
      load.clear();
      res.forEach((t) => t.dispose());
      res.clear();
      blurs.forEach((t) => t?.dispose());
      photoMats.forEach((m) => m.dispose());
    };
  }, [photos, photoMats]);

  useEffect(
    () => () => {
      shared.box.dispose();
      shared.gold.dispose();
      shared.ivory.dispose();
    },
    [shared],
  );

  const decorMats = useMemo(() => {
    const map = oldMapTexture();
    const mirror = mirrorTexture();
    return {
      materials: {
        map: new MeshStandardMaterial({ map, roughness: 0.9 }),
        mirror: new MeshStandardMaterial({
          map: mirror,
          metalness: 0.6,
          roughness: 0.25,
        }),
        empty: new MeshStandardMaterial({ color: '#2a0f22', roughness: 1 }),
      },
      textures: [map, mirror],
    };
  }, []);
  useEffect(
    () => () => {
      Object.values(decorMats.materials).forEach((m) => m.dispose());
      decorMats.textures.forEach((t) => t.dispose());
    },
    [decorMats],
  );

  const photoMeshes = useRef<(Mesh | null)[]>([]);
  const since = useRef(RESIDENCY_EVERY);
  const lit = useRef<number[]>([]);

  // Materials are reached through their meshes so per-frame writes never touch hook values.
  const matOf = (k: number) =>
    photoMeshes.current[k]?.material as MeshBasicMaterial | undefined;

  function setMap(k: number, t: Texture | null) {
    const m = matOf(k);
    if (!m) return;
    m.map = t;
    m.needsUpdate = true;
  }

  // The end portrait hangs in view for the whole walk: always sharp, hi-res above `low`.
  const hiResFor = (k: number) =>
    TIERS[tier].galleryHiRes || (k === order.length - 1 && tier !== 'low');

  function updateResidency() {
    const keep = residentWindow(
      order.map((s) => s.t),
      galleryState.walk * WALK_END,
      TIERS[tier].galleryResident,
      [inspectIndex(), order.length - 1],
    );
    for (const [k, t] of resident.current)
      if (!keep.has(k)) {
        setMap(k, placeholders.current[k] ?? null);
        t.dispose();
        resident.current.delete(k);
      }
    for (const [k, cancel] of loading.current)
      if (!keep.has(k)) {
        cancel();
        loading.current.delete(k);
      }
    // Blueprint 086: start at most two loads per tick so decodes and uploads never land together.
    let starts = 0;
    for (const k of keep) {
      const photo = photos[k];
      if (!photo || resident.current.has(k) || loading.current.has(k)) continue;
      if (++starts > 2) break;
      loading.current.set(
        k,
        loadPhotoTexture(photo, hiResFor(k), (t) => {
          loading.current.delete(k);
          resident.current.set(k, t);
          setMap(k, t);
        }),
      );
    }
  }

  function evictAll() {
    loading.current.forEach((cancel) => cancel());
    loading.current.clear();
    resident.current.forEach((t, k) => {
      setMap(k, placeholders.current[k] ?? null);
      t.dispose();
    });
    resident.current.clear();
  }

  useFrame((_, delta) => {
    if (!galleryState.active) {
      // FR-16: leaving the section frees the full-size photos; placeholders stay.
      if (resident.current.size || loading.current.size) evictAll();
      return;
    }

    since.current += delta;
    if (since.current >= RESIDENCY_EVERY) {
      since.current = 0;
      updateResidency();
    }

    const weight = inspectWeight();
    const focus = inspectIndex();
    order.forEach((slot, k) => {
      const m = matOf(k);
      if (!m) return;
      // Others dim while a frame is open; hover and the open frame brighten a touch.
      const goal =
        k === focus
          ? 1 + 0.08 * weight
          : 1 - 0.65 * weight + (galleryState.hovered === k ? 0.15 : 0);
      const v = (lit.current[k] = damp(lit.current[k] ?? 1, goal, 8, delta));
      if (m.map) m.color.setScalar(v);
      else m.color.copy(PLACEHOLDER).multiplyScalar(v);

      const mesh = photoMeshes.current[k];
      if (!mesh) return;
      const s = projectToScreen(mesh, camera, size);
      const f = hung[slots.indexOf(slot)];
      galleryState.screen[k] = {
        x: s.x,
        y: s.y,
        r: projectRadius(
          mesh.getWorldPosition(tmp),
          (f?.h ?? 1) / 2,
          camera,
          size,
        ),
        visible: s.visible && Math.abs(s.ndc.x) < 1 && Math.abs(s.ndc.y) < 1,
      };
    });
  });

  const over = (k: number) => (e: ThreeEvent<PointerEvent>) => {
    if (!galleryState.active || e.pointerType !== 'mouse') return;
    if (inspectWeight() > 0) return;
    e.stopPropagation();
    galleryState.hovered = k;
    document.body.style.cursor = CURSOR_POINTER;
  };
  const out = (k: number) => () => {
    if (galleryState.hovered === k) galleryState.hovered = -1;
    document.body.style.cursor = '';
  };
  const click = (k: number) => (e: ThreeEvent<MouseEvent>) => {
    if (!galleryState.active || inspectWeight() > 0) return;
    e.stopPropagation();
    galleryState.hovered = -1;
    document.body.style.cursor = '';
    sendGallery({ type: 'open', index: k });
  };

  return (
    <>
      <instancedMesh
        ref={borders}
        args={[shared.box, shared.gold, hung.length]}
        raycast={() => null}
      />
      <instancedMesh
        ref={mats}
        args={[shared.box, shared.ivory, hung.length]}
        raycast={() => null}
      />
      {hung.map((f, i) => {
        const front = f.center.clone().addScaledVector(f.facing, 0.045);
        if (f.decor)
          return (
            <mesh
              key={i}
              position={front}
              rotation={[0, f.yaw, 0]}
              material={decorMats.materials[f.decor]}
              raycast={() => null}
            >
              <planeGeometry args={[f.w, f.h]} />
            </mesh>
          );
        const k = order.indexOf(f.slot);
        return (
          <mesh
            key={i}
            ref={(el) => {
              photoMeshes.current[k] = el;
            }}
            position={front}
            rotation={[0, f.yaw, 0]}
            material={photoMats[k]}
            onPointerOver={over(k)}
            onPointerOut={out(k)}
            onClick={click(k)}
          >
            <planeGeometry args={[f.w, f.h]} />
          </mesh>
        );
      })}
    </>
  );
}
