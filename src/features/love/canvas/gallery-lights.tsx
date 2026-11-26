'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  type CatmullRomCurve3,
  Color,
  Fog,
  type InstancedMesh,
  type Mesh,
  MathUtils,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Object3D,
  PlaneGeometry,
  type PointLight,
  type Points,
  PointsMaterial,
  SphereGeometry,
  type Texture,
  Vector3,
} from 'three';

import {
  GALLERY_DIMS,
  type FrameSlot,
  WALK_END,
  frameAt,
  hangAt,
} from '../engine/gallery-path';
import { galleryState, inspectWeight } from '../engine/gallery-state';
import { TIERS, type Tier } from '../engine/tiers';
import { glowTexture } from './gallery-surfaces';
import { inflatedHeartGeometry, useHeartEnvMap } from './mini-hearts';
import { mulberry32 } from './heart-geometry';

const WARM = '#ffd29a';
export const FOG = new Fog('#1c0b16', 5, 20);
const MAX_LIGHTS = TIERS.high.galleryLights;
const MAX_MOTES = TIERS.high.galleryMotes;
const LIGHT_AHEAD = [0.03, 0.12, 0.22];
const p = new Vector3();
const n = new Vector3();

type Props = { curve: CatmullRomCurve3; slots: FrameSlot[]; tier: Tier };

// Phase 12 §7 Lighting: brass sconces are emissive meshes (bloom catches them), wall washes and
// the floor reflection are additive glow sprites, and only 1–3 real point lights follow the camera.
export function GalleryLights({ curve, slots, tier }: Props) {
  const config = TIERS[tier];
  const get = useThree((s) => s.get);
  const glow = useMemo(() => glowTexture(), []);
  const wall = useMemo(() => slots.filter((s) => s.kind !== 'end'), [slots]);

  // Fog only while the corridor owns the view; the story scene never sees it.
  useFrame(({ scene }) => {
    if (galleryState.active && scene.fog !== FOG) scene.fog = FOG;
    else if (!galleryState.active && scene.fog === FOG) scene.fog = null;
  });
  useEffect(
    () => () => {
      const { scene } = get();
      if (scene.fog === FOG) scene.fog = null;
      glow.dispose();
    },
    [get, glow],
  );

  return (
    <>
      <Sconces curve={curve} wall={wall} />
      <WallWashes curve={curve} wall={wall} glow={glow} />
      <CameraLights curve={curve} count={config.galleryLights} />
      <EndGlow curve={curve} glow={glow} />
      {config.galleryReflection && (
        <FloorReflection curve={curve} wall={wall} glow={glow} />
      )}
      {config.galleryMotes > 0 && (
        <Motes curve={curve} count={config.galleryMotes} />
      )}
      {config.galleryCompanion && <Companion curve={curve} />}
    </>
  );
}

function useInstances(
  count: number,
  place: (i: number, o: Object3D) => void,
  deps: unknown[],
) {
  const ref = useRef<InstancedMesh>(null);
  useEffect(() => {
    const o = new Object3D();
    for (let i = 0; i < count; i++) {
      o.position.set(0, 0, 0);
      o.rotation.set(0, 0, 0);
      o.scale.set(1, 1, 1);
      place(i, o);
      o.updateMatrix();
      ref.current?.setMatrixAt(i, o.matrix);
    }
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

function Sconces({
  curve,
  wall,
}: {
  curve: CatmullRomCurve3;
  wall: FrameSlot[];
}) {
  const parts = useMemo(
    () => ({
      geo: new SphereGeometry(0.035, 12, 8),
      mat: new MeshBasicMaterial({
        color: new Color(WARM).multiplyScalar(1.6),
        toneMapped: false,
      }),
    }),
    [],
  );
  useEffect(
    () => () => {
      parts.geo.dispose();
      parts.mat.dispose();
    },
    [parts],
  );
  const ref = useInstances(
    wall.length,
    (i, o) => {
      hangAt(curve, wall[i], o.position, n);
      o.position.y += 0.85;
      o.position.addScaledVector(n, 0.12);
    },
    [curve, wall],
  );
  return (
    <instancedMesh
      ref={ref}
      args={[parts.geo, parts.mat, wall.length]}
      raycast={() => null}
    />
  );
}

function additive(glow: Texture, opacity: number) {
  return new MeshBasicMaterial({
    map: glow,
    color: WARM,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
  });
}

function WallWashes({
  curve,
  wall,
  glow,
}: {
  curve: CatmullRomCurve3;
  wall: FrameSlot[];
  glow: Texture;
}) {
  const parts = useMemo(
    () => ({ geo: new PlaneGeometry(1.5, 1.4), mat: additive(glow, 0.22) }),
    [glow],
  );
  useEffect(
    () => () => {
      parts.geo.dispose();
      parts.mat.dispose();
    },
    [parts],
  );
  const ref = useInstances(
    wall.length,
    (i, o) => {
      hangAt(curve, wall[i], o.position, n);
      o.position.y += 0.55;
      o.position.addScaledVector(n, 0.015);
      o.rotation.y = Math.atan2(n.x, n.z);
    },
    [curve, wall],
  );
  return (
    <instancedMesh
      ref={ref}
      args={[parts.geo, parts.mat, wall.length]}
      raycast={() => null}
    />
  );
}

function FloorReflection({
  curve,
  wall,
  glow,
}: {
  curve: CatmullRomCurve3;
  wall: FrameSlot[];
  glow: Texture;
}) {
  // Faked (Phase 12 §7): long warm streaks on the polished floor under each light. Never a mirror.
  const parts = useMemo(
    () => ({ geo: new PlaneGeometry(0.5, 1.6), mat: additive(glow, 0.14) }),
    [glow],
  );
  useEffect(
    () => () => {
      parts.geo.dispose();
      parts.mat.dispose();
    },
    [parts],
  );
  const ref = useInstances(
    wall.length,
    (i, o) => {
      hangAt(curve, wall[i], o.position, n);
      o.position.addScaledVector(n, 0.55);
      o.position.y = 0.004;
      o.rotation.set(-Math.PI / 2, 0, Math.atan2(n.x, n.z), 'YXZ');
    },
    [curve, wall],
  );
  return (
    <instancedMesh
      ref={ref}
      args={[parts.geo, parts.mat, wall.length]}
      raycast={() => null}
    />
  );
}

function CameraLights({
  curve,
  count,
}: {
  curve: CatmullRomCurve3;
  count: number;
}) {
  // Allocated once at the high count; lower tiers switch the extras off (no shader recompiles).
  const lights = useRef<(PointLight | null)[]>([]);
  useFrame(() => {
    const at = galleryState.walk * WALK_END;
    lights.current.forEach((l, i) => {
      if (!l) return;
      l.intensity = galleryState.active && i < count ? 7 : 0;
      curve.getPointAt(Math.min(at + LIGHT_AHEAD[i], 1), l.position);
      l.position.y = GALLERY_DIMS.height - 0.4;
    });
  });
  return (
    <>
      {Array.from({ length: MAX_LIGHTS }, (_, i) => (
        <pointLight
          key={i}
          ref={(el) => {
            lights.current[i] = el;
          }}
          color={WARM}
          intensity={0}
          distance={8}
          decay={1.6}
        />
      ))}
    </>
  );
}

function EndGlow({ curve, glow }: { curve: CatmullRomCurve3; glow: Texture }) {
  // The warm far end that pulls the eye forward, the spotlight pool on the portrait, and the
  // exit glow that swells as she reaches it (handoff to the next section).
  const { pos, yaw } = useMemo(() => {
    const pos = new Vector3();
    const facing = new Vector3();
    hangAt(curve, { kind: 'end', photo: -1, t: 1, side: 1 }, pos, facing);
    pos.addScaledVector(facing, 0.02);
    return { pos, yaw: Math.atan2(facing.x, facing.z) };
  }, [curve]);
  const spot = useMemo(() => additive(glow, 0.55), [glow]);
  const exit = useMemo(() => additive(glow, 0), [glow]);
  const exitRef = useRef<Mesh>(null);
  useEffect(
    () => () => {
      spot.dispose();
      exit.dispose();
    },
    [spot, exit],
  );
  useFrame(() => {
    const t = Math.max(0, (galleryState.walk - 0.93) / 0.07);
    const mesh = exitRef.current;
    if (!mesh) return;
    const m = mesh.material as MeshBasicMaterial;
    m.opacity = t * t * 0.95 * (1 - inspectWeight());
    mesh.visible = m.opacity > 0.001;
  });
  return (
    <group position={pos} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.5, 0]} material={spot} raycast={() => null}>
        <planeGeometry args={[2.6, 2.6]} />
      </mesh>
      <mesh
        ref={exitRef}
        position={[0, 0, 0.9]}
        material={exit}
        raycast={() => null}
      >
        <planeGeometry args={[6, 5]} />
      </mesh>
    </group>
  );
}

function Motes({ curve, count }: { curve: CatmullRomCurve3; count: number }) {
  const ref = useRef<Points>(null);
  const parts = useMemo(() => {
    const rand = mulberry32(31);
    const pos = new Float32Array(MAX_MOTES * 3);
    for (let i = 0; i < MAX_MOTES; i++) {
      frameAt(curve, rand(), p, n);
      p.addScaledVector(n, (rand() * 2 - 1) * (GALLERY_DIMS.width / 2 - 0.2));
      pos.set([p.x, 0.3 + rand() * 2.5, p.z], i * 3);
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    const mat = new PointsMaterial({
      color: WARM,
      size: 0.03,
      map: glowTexture(),
      alphaTest: 0.01,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    return { geo, mat };
  }, [curve]);
  useEffect(
    () => () => {
      parts.geo.dispose();
      parts.mat.map?.dispose();
      parts.mat.dispose();
    },
    [parts],
  );
  useFrame(({ clock }) => {
    parts.geo.setDrawRange(0, count);
    const pts = ref.current;
    if (!pts) return;
    const t = clock.elapsedTime;
    pts.position.set(Math.sin(t * 0.13) * 0.08, Math.sin(t * 0.21) * 0.1, 0);
  });
  return (
    <points
      ref={ref}
      geometry={parts.geo}
      material={parts.mat}
      raycast={() => null}
    />
  );
}

function Companion({ curve }: { curve: CatmullRomCurve3 }) {
  // FR-10: a small gold heart floating ahead; it pulses as a frame opens.
  const ref = useRef<Mesh>(null);
  const env = useHeartEnvMap();
  const parts = useMemo(() => {
    const geo = inflatedHeartGeometry();
    const mat = new MeshPhysicalMaterial({
      color: '#e8c46a',
      metalness: 1,
      roughness: 0.22,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      envMap: env,
      envMapIntensity: 1.4,
      emissive: '#6b4a10',
      emissiveIntensity: 0.6,
    });
    return { geo, mat };
  }, [env]);
  useEffect(
    () => () => {
      parts.geo.dispose();
      parts.mat.dispose();
    },
    [parts],
  );
  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = clock.elapsedTime;
    const at = Math.min(galleryState.walk * WALK_END + 0.07, 0.985);
    curve.getPointAt(at, mesh.position);
    mesh.position.y = GALLERY_DIMS.eye + 0.35 + Math.sin(t * 1.4) * 0.05;
    mesh.rotation.set(0, t * 0.6, 0);
    const pulse = 1 + 0.45 * Math.sin(Math.PI * inspectWeight());
    // Appears once she is through the door, so it never floats in front of it.
    const through = MathUtils.smoothstep(galleryState.walk, 0.1, 0.16);
    mesh.visible = through > 0;
    mesh.scale.setScalar(0.06 * pulse * through);
  });
  return (
    <mesh
      ref={ref}
      geometry={parts.geo}
      material={parts.mat}
      raycast={() => null}
    />
  );
}
