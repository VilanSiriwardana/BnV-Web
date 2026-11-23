'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BufferGeometry,
  type CatmullRomCurve3,
  DoubleSide,
  Float32BufferAttribute,
  type Mesh,
  type MeshBasicMaterial,
  MeshStandardMaterial,
  Vector3,
} from 'three';

import { GALLERY_DIMS, frameAt } from '../engine/gallery-path';
import { galleryState } from '../engine/gallery-state';
import { glowTexture, surfaceTexture } from './gallery-surfaces';

const SAMPLES = 96;
const HALF = GALLERY_DIMS.width / 2;
const H = GALLERY_DIMS.height;
const DOOR_T = 0.012;

type Edge = [offset: number, y: number];

// One band along the curve between two edges (offset across the corridor, height). UVs are in
// tiles: u runs along the corridor (or across it with `across`), v across the band.
function ribbon(
  curve: CatmullRomCurve3,
  a: Edge,
  b: Edge,
  tile: number,
  across = false,
) {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const p = new Vector3();
  const n = new Vector3();
  const length = curve.getLength();
  const span = Math.hypot(b[0] - a[0], b[1] - a[1]) / tile;
  for (let i = 0; i <= SAMPLES; i++) {
    frameAt(curve, i / SAMPLES, p, n);
    const along = ((i / SAMPLES) * length) / tile;
    pos.push(p.x + n.x * a[0], a[1], p.z + n.z * a[0]);
    pos.push(p.x + n.x * b[0], b[1], p.z + n.z * b[0]);
    if (across) uv.push(0, along, span, along);
    else uv.push(along, 0, along, span);
    if (i < SAMPLES) {
      const k = i * 2;
      idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// Warm classic look (Phase 12 §1): polished wood floor, aubergine damask, dark wood wainscot,
// gold rails, ivory ceiling with a gold cove.
export function GalleryCorridor({ curve }: { curve: CatmullRomCurve3 }) {
  const parts = useMemo(() => {
    const floorMap = surfaceTexture('floor');
    const wallMap = surfaceTexture('wallpaper');
    const panelMap = surfaceTexture('wainscot');
    const m = (o: ConstructorParameters<typeof MeshStandardMaterial>[0]) =>
      new MeshStandardMaterial({ side: DoubleSide, ...o });
    const at = (d: number) => HALF - d;
    const walls = (y0: number, y1: number, d: number, tile: number) => [
      ribbon(curve, [at(d), y0], [at(d), y1], tile),
      ribbon(curve, [-at(d), y0], [-at(d), y1], tile),
    ];
    const gold = m({ color: '#c9a24a', metalness: 0.85, roughness: 0.35 });
    return {
      maps: [floorMap, wallMap, panelMap],
      parts: [
        {
          geo: [ribbon(curve, [HALF, 0], [-HALF, 0], 1.6, true)],
          mat: m({ map: floorMap, roughness: 0.28, metalness: 0.05 }),
        },
        {
          geo: [ribbon(curve, [HALF, H], [-HALF, H], 3)],
          mat: m({ color: '#efe3cc', roughness: 0.9 }),
        },
        {
          geo: walls(1.04, H, 0, 0.6),
          mat: m({ map: wallMap, roughness: 0.85 }),
        },
        {
          geo: walls(0, 1, 0.02, 1),
          mat: m({ map: panelMap, roughness: 0.55 }),
        },
        {
          geo: walls(0, 0.14, 0.035, 1),
          mat: m({ color: '#1f110b', roughness: 0.5 }),
        },
        {
          geo: [...walls(0.98, 1.05, 0.03, 1), ...walls(H - 0.12, H, 0.02, 1)],
          mat: gold,
        },
      ],
    };
  }, [curve]);

  useEffect(
    () => () => {
      parts.parts.forEach((part) => {
        part.geo.forEach((g) => g.dispose());
        part.mat.dispose();
      });
      parts.maps.forEach((t) => t.dispose());
    },
    [parts],
  );

  return (
    <>
      {parts.parts.flatMap((part, i) =>
        part.geo.map((g, j) => (
          <mesh key={`${i}-${j}`} geometry={g} material={part.mat} />
        )),
      )}
      <EndWall curve={curve} />
      <Doorway curve={curve} />
    </>
  );
}

const p = new Vector3();
const n = new Vector3();
const tangent = new Vector3();

function placeAcross(curve: CatmullRomCurve3, t: number) {
  frameAt(curve, t, p, n);
  curve.getTangentAt(t, tangent);
  return { position: p.clone(), yaw: Math.atan2(-tangent.x, -tangent.z) };
}

function EndWall({ curve }: { curve: CatmullRomCurve3 }) {
  const { position, yaw } = useMemo(() => placeAcross(curve, 1), [curve]);
  return (
    <mesh position={[position.x, H / 2, position.z]} rotation={[0, yaw, 0]}>
      <planeGeometry args={[GALLERY_DIMS.width, H]} />
      <meshStandardMaterial color="#3d1830" roughness={0.9} side={DoubleSide} />
    </mesh>
  );
}

// FR-13: a wood-and-gold door frame just ahead of the start, with warm light filling the opening
// that fades as she steps through.
function Doorway({ curve }: { curve: CatmullRomCurve3 }) {
  const { position, yaw } = useMemo(() => placeAcross(curve, DOOR_T), [curve]);
  const glow = useMemo(() => glowTexture(), []);
  const light = useRef<Mesh>(null);
  useEffect(() => () => glow.dispose(), [glow]);

  useFrame(() => {
    const mesh = light.current;
    if (!mesh) return;
    const o = Math.max(0, 1 - galleryState.progress / 0.035);
    (mesh.material as MeshBasicMaterial).opacity = o * 0.9;
    mesh.visible = o > 0;
  });

  const post = (x: number) => (
    <mesh position={[x, 1.2, 0]}>
      <boxGeometry args={[0.22, 2.4, 0.18]} />
      <meshStandardMaterial color="#2e1a12" roughness={0.5} />
    </mesh>
  );
  return (
    <group position={[position.x, 0, position.z]} rotation={[0, yaw, 0]}>
      {post(-HALF + 0.11)}
      {post(HALF - 0.11)}
      <mesh position={[0, 2.55, 0]}>
        <boxGeometry args={[GALLERY_DIMS.width, 0.3, 0.2]} />
        <meshStandardMaterial
          color="#c9a24a"
          metalness={0.85}
          roughness={0.35}
        />
      </mesh>
      <mesh ref={light} position={[0, 1.2, -0.05]}>
        <planeGeometry args={[GALLERY_DIMS.width - 0.44, 2.4]} />
        <meshBasicMaterial
          map={glow}
          color="#ffe3b0"
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
