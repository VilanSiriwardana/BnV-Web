'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  Color,
  ExtrudeGeometry,
  type Group,
  MathUtils,
  type Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Shape,
  SRGBColorSpace,
  Path,
  SphereGeometry,
  TubeGeometry,
  Vector3,
  CatmullRomCurve3,
  CylinderGeometry,
} from 'three';

import { DOOR_T, GALLERY_DIMS } from '../engine/gallery-path';
import { ritualState } from '../engine/gallery-ritual';
import { galleryState } from '../engine/gallery-state';
import { placeAcross } from './gallery-corridor';
import { createKeyGeometry } from './gallery-key';
import { filigreeTexture, glowTexture } from './gallery-surfaces';
import { inflatedHeartGeometry } from './mini-hearts';
import { projectToScreen } from './projection';
import { readTokenColors } from './token-colors';

const W = GALLERY_DIMS.width;
const PILASTER = 0.22;
const OPENING = W - PILASTER * 2;
const LEAF_W = OPENING / 2;
const LEAF_H = 2.4;
const SWING = MathUtils.degToRad(105);
const none = () => null;
/** Keyhole centre in door-group space (right leaf, closed), and its outward normal is +z. */
export const KEYHOLE_LOCAL = { x: 0.12, y: 1.02, z: 0.05 };
const LEVER_Y = 1.2;
/** The key and keyhole read larger than life so they are clear from 2.6 m. */
export const KEY_SCALE = 1.5;

// Ornate escutcheon plate with a keyhole cut through it (circle + slot).
function escutcheonShape() {
  const s = new Shape();
  s.moveTo(0, 0.11);
  s.bezierCurveTo(0.05, 0.1, 0.045, 0.04, 0.035, 0);
  s.bezierCurveTo(0.045, -0.04, 0.05, -0.1, 0, -0.11);
  s.bezierCurveTo(-0.05, -0.1, -0.045, -0.04, -0.035, 0);
  s.bezierCurveTo(-0.045, 0.04, -0.05, 0.1, 0, 0.11);
  const hole = new Path();
  hole.absarc(0, 0.012, 0.011, 0, Math.PI * 2, false);
  s.holes.push(hole);
  const slot = new Path();
  slot.moveTo(-0.005, 0.004);
  slot.lineTo(0.005, 0.004);
  slot.lineTo(0.008, -0.035);
  slot.lineTo(-0.008, -0.035);
  slot.closePath();
  s.holes.push(slot);
  return s;
}

// Royal lever handle: rosette plate and a curved lever that tips down as the key turns.
function leverCurve(dir: 1 | -1) {
  return new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0.05),
    new Vector3(-dir * 0.05, -0.005, 0.07),
    new Vector3(-dir * 0.15, -0.02, 0.07),
  ]);
}

// Blueprints 052/053: a royal double door at the end of a short entrance hall. The unlock ritual
// (engine/gallery-ritual.ts) turns the key and swings the leaves inward; warm light pours through.
export function GalleryDoorway({ curve }: { curve: CatmullRomCurve3 }) {
  const { position, yaw } = useMemo(() => placeAcross(curve, DOOR_T), [curve]);
  const left = useRef<Group>(null);
  const right = useRef<Group>(null);
  const light = useRef<Mesh>(null);
  const spill = useRef<Mesh>(null);
  const levers = useRef<(Group | null)[]>([]);
  const lockedKey = useRef<Mesh>(null);

  const kit = useMemo(() => {
    const filigree = filigreeTexture();
    const glow = glowTexture();
    const gold = new MeshStandardMaterial({
      color: '#d4ad55',
      metalness: 1,
      roughness: 0.3,
      emissive: '#3a2a08',
    });
    const lacquer = new MeshStandardMaterial({
      color: '#3a1430',
      roughness: 0.35,
      metalness: 0.1,
    });
    const panel = new MeshStandardMaterial({
      map: filigree,
      roughness: 0.4,
      metalness: 0.25,
    });
    const stone = new MeshStandardMaterial({
      color: '#2e1a12',
      roughness: 0.5,
    });
    const additive = (opacity: number) =>
      new MeshBasicMaterial({
        map: glow,
        color: new Color('#ffe3b0'),
        transparent: true,
        opacity,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      });

    const arch = new Shape();
    arch.moveTo(-W / 2, 0);
    arch.absellipse(0, 0, W / 2, 0.42, Math.PI, 0, true);
    arch.lineTo(-W / 2, 0);
    const bevel = {
      depth: 0.08,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02,
      bevelSegments: 2,
    };
    const crest = inflatedHeartGeometry(0.36);

    return {
      textures: [filigree, glow],
      materials: { gold, lacquer, panel, stone },
      dark: new MeshBasicMaterial({ color: '#0b0408' }),
      keyMaterial: new MeshStandardMaterial({
        color: '#f0cf72',
        metalness: 1,
        roughness: 0.22,
        emissive: '#6b4a10',
      }),
      light: additive(0),
      spill: additive(0),
      geo: {
        box: new BoxGeometry(1, 1, 1),
        arch: new ExtrudeGeometry(arch, { ...bevel, curveSegments: 24 }),
        crest,
        rosette: new CylinderGeometry(0.045, 0.05, 0.015, 24),
        leverL: new TubeGeometry(leverCurve(1), 16, 0.011, 8, false),
        leverR: new TubeGeometry(leverCurve(-1), 16, 0.011, 8, false),
        knob: new SphereGeometry(0.018, 12, 8),
        escutcheon: new ExtrudeGeometry(escutcheonShape(), {
          depth: 0.008,
          bevelEnabled: true,
          bevelSize: 0.003,
          bevelThickness: 0.003,
          bevelSegments: 2,
          curveSegments: 12,
        }),
        key: createKeyGeometry(),
        plane: new PlaneGeometry(1, 1),
      },
    };
  }, []);

  useEffect(
    () => () => {
      kit.textures.forEach((t) => t.dispose());
      Object.values(kit.materials).forEach((m) => m.dispose());
      kit.dark.dispose();
      kit.keyMaterial.dispose();
      kit.light.dispose();
      kit.spill.dispose();
      Object.values(kit.geo).forEach((g) => g.dispose());
    },
    [kit],
  );

  useFrame(() => {
    const open = ritualState.door;
    levers.current.forEach((l, i) => {
      if (l) l.rotation.z = (i === 0 ? 1 : -1) * 0.55 * ritualState.keyTurn;
    });
    // Once in the lock the key rides on the right leaf and turns with it.
    const k = lockedKey.current;
    if (k) {
      k.visible = ritualState.keyIn >= 1;
      k.rotation.z = (ritualState.keyTurn * Math.PI) / 2;
    }
    if (left.current) left.current.rotation.y = open * SWING;
    if (right.current) right.current.rotation.y = -open * SWING;
    // Light pours in as the doors part and fades once she is through.
    const through = 1 - MathUtils.smoothstep(galleryState.walk, 0.05, 0.12);
    const o = open * through;
    pour(light.current, o * 0.95);
    pour(spill.current, o * 0.5);
  });

  const { gold, lacquer, panel, stone } = kit.materials;
  const { box, arch, crest, plane, rosette, knob, escutcheon, key } = kit.geo;

  const pilaster = (x: number) => (
    <group position={[x, 0, 0]}>
      <mesh
        geometry={box}
        material={stone}
        position={[0, 1.2, 0]}
        scale={[PILASTER, 2.4, 0.22]}
        raycast={none}
      />
      {[-0.06, 0, 0.06].map((dx) => (
        <mesh
          key={dx}
          geometry={box}
          material={gold}
          position={[dx, 1.2, 0.115]}
          scale={[0.018, 1.9, 0.01]}
          raycast={none}
        />
      ))}
      <mesh
        geometry={box}
        material={gold}
        position={[0, 2.33, 0.02]}
        scale={[PILASTER + 0.08, 0.14, 0.26]}
        raycast={none}
      />
      <mesh
        geometry={box}
        material={gold}
        position={[0, 0.08, 0.02]}
        scale={[PILASTER + 0.06, 0.16, 0.26]}
        raycast={none}
      />
    </group>
  );

  // One leaf: lacquer slab, two gilded filigree panels, gold edge beads and a ring handle.
  // `dir` is +1 for the left leaf (hinge on the left), -1 for the right.
  const leaf = (dir: 1 | -1) => (
    <group
      ref={dir === 1 ? left : right}
      position={[-dir * (OPENING / 2), 0, 0]}
    >
      <group position={[dir * (LEAF_W / 2), 0, 0]}>
        <mesh
          geometry={box}
          material={lacquer}
          position={[0, LEAF_H / 2, 0]}
          scale={[LEAF_W - 0.01, LEAF_H, 0.06]}
          raycast={none}
        />
        {[0.68, 1.72].map((y) => (
          <group key={y} position={[0, y, 0.035]}>
            <mesh
              geometry={box}
              material={gold}
              scale={[LEAF_W - 0.16, 0.9, 0.012]}
              raycast={none}
            />
            <mesh
              geometry={plane}
              material={panel}
              position={[0, 0, 0.008]}
              scale={[LEAF_W - 0.22, 0.84, 1]}
              raycast={none}
            />
          </group>
        ))}
        <mesh
          geometry={box}
          material={gold}
          position={[0, 1.2, 0.036]}
          scale={[LEAF_W - 0.1, 0.035, 0.012]}
          raycast={none}
        />
        <group position={[dir * (LEAF_W / 2 - 0.12), LEVER_Y, 0.03]}>
          <mesh
            geometry={rosette}
            material={gold}
            rotation={[Math.PI / 2, 0, 0]}
            raycast={none}
          />
          <group
            ref={(el) => {
              levers.current[dir === 1 ? 0 : 1] = el;
            }}
          >
            <mesh
              geometry={dir === 1 ? kit.geo.leverL : kit.geo.leverR}
              material={gold}
              raycast={none}
            />
            <mesh
              geometry={knob}
              material={gold}
              position={[-dir * 0.15, -0.02, 0.07]}
              raycast={none}
            />
          </group>
        </group>
        {dir === -1 && (
          <group
            position={[-(LEAF_W / 2 - 0.12), KEYHOLE_LOCAL.y, 0.03]}
            scale={KEY_SCALE}
          >
            <mesh
              geometry={escutcheon}
              material={gold}
              position={[0, -0.012, 0]}
              raycast={none}
            />
            <mesh
              geometry={plane}
              material={kit.dark}
              position={[0, 0, 0.002]}
              scale={[0.03, 0.06, 1]}
              raycast={none}
            />
            <mesh
              ref={lockedKey}
              geometry={key}
              material={kit.keyMaterial}
              position={[0, 0, KEYHOLE_LOCAL.z - 0.03 - 0.08]}
              visible={false}
              raycast={none}
            />
          </group>
        )}
      </group>
    </group>
  );

  return (
    <group position={[position.x, 0, position.z]} rotation={[0, yaw, 0]}>
      {pilaster(-W / 2 + PILASTER / 2)}
      {pilaster(W / 2 - PILASTER / 2)}
      <mesh
        geometry={box}
        material={stone}
        position={[0, 2.7, -0.02]}
        scale={[W, 0.6, 0.18]}
        raycast={none}
      />
      <mesh
        geometry={box}
        material={gold}
        position={[0, 2.46, 0.05]}
        scale={[W, 0.12, 0.2]}
        raycast={none}
      />
      <mesh
        geometry={arch}
        material={gold}
        position={[0, 2.52, 0.08]}
        scale={[0.96, 1, 0.5]}
        raycast={none}
      />
      <WelcomePlaque />
      <mesh
        geometry={crest}
        material={gold}
        position={[0, 2.74, 0.16]}
        scale={0.13}
        raycast={none}
      />
      {leaf(1)}
      {leaf(-1)}
      <mesh
        ref={light}
        geometry={plane}
        material={kit.light}
        position={[0, 1.2, -0.25]}
        scale={[OPENING * 1.4, LEAF_H * 1.3, 1]}
        raycast={none}
      />
      <mesh
        ref={spill}
        geometry={plane}
        material={kit.spill}
        position={[0, 0.005, 0.9]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[OPENING, 2.4, 1]}
        raycast={none}
      />
    </group>
  );
}

const PLAQUE_W = 1.3;
const PLAQUE_H = 0.32;
/** Blueprint 061: the welcome plaque sits on the arch face, under the crest. */
export const PLAQUE_LOCAL = { x: 0, y: 2.66, z: 0.32 };
const edgeL = new Vector3();
const edgeR = new Vector3();

// The DOM welcome (gallery-ritual-overlay.tsx) flies here, then this plaque fades in and stays.
function WelcomePlaque() {
  const ref = useRef<Mesh>(null);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const kit = useMemo(() => {
    const el = document.createElement('canvas');
    el.width = 1024;
    el.height = Math.round((1024 * PLAQUE_H) / PLAQUE_W);
    const t = new CanvasTexture(el);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    const m = new MeshBasicMaterial({
      map: t,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false,
    });
    return { texture: t, material: m };
  }, []);
  const kitRef = useRef(kit);
  const { texture, material } = kit;

  useEffect(() => {
    let live = true;
    const paint = () => {
      const cv = kitRef.current.texture.image as HTMLCanvasElement;
      const c = cv.getContext('2d');
      const word = document.querySelector<HTMLElement>(
        '#gallery [data-welcome-word]',
      );
      // Blueprint 067: the arch carries the gallery heading, not the welcome.
      const name = document.querySelector<HTMLElement>(
        '#gallery [data-gallery-plaque]',
      );
      const root = document.querySelector<HTMLElement>('[data-love-root]');
      if (!c || !name || !live) return;
      const gold = root
        ? readTokenColors(root).gold.night
        : new Color('#d4ad55');
      const hex = `#${gold.getHexString()}`;
      const { width: w, height: h } = cv;
      c.clearRect(0, 0, w, h);
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillStyle = hex;
      c.shadowColor = hex;
      c.shadowBlur = 18;
      const font = word ? getComputedStyle(word).fontFamily : 'serif';
      c.font = `500 ${h * 0.42}px ${font}`;
      c.letterSpacing = `${h * 0.06}px`;
      c.fillText(
        (name.dataset.galleryPlaque ?? '').toUpperCase(),
        w / 2,
        h * 0.52,
      );
      c.letterSpacing = '0px';
      kitRef.current.texture.needsUpdate = true;
    };
    void document.fonts.ready.then(paint);
    return () => {
      live = false;
    };
  }, [texture]);

  useEffect(
    () => () => {
      texture.dispose();
      material.dispose();
      galleryState.welcome.ready = false;
    },
    [texture, material],
  );

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    kitRef.current.material.opacity = 1;
    mesh.visible = true;
    if (!galleryState.active) return;
    mesh.localToWorld(edgeL.set(-PLAQUE_W / 2, 0, 0));
    mesh.localToWorld(edgeR.set(PLAQUE_W / 2, 0, 0));
    const a = projectToScreen(edgeL, camera, size);
    const b = projectToScreen(edgeR, camera, size);
    const wl = galleryState.welcome;
    wl.x = (a.x + b.x) / 2;
    wl.y = (a.y + b.y) / 2;
    wl.w = Math.hypot(b.x - a.x, b.y - a.y);
    wl.ready = a.visible && b.visible;
  });

  return (
    <mesh
      ref={ref}
      material={material}
      position={[PLAQUE_LOCAL.x, PLAQUE_LOCAL.y, PLAQUE_LOCAL.z]}
      raycast={none}
      visible={false}
    >
      <planeGeometry args={[PLAQUE_W, PLAQUE_H]} />
    </mesh>
  );
}

function pour(mesh: Mesh | null, opacity: number) {
  if (!mesh) return;
  (mesh.material as MeshBasicMaterial).opacity = opacity;
  mesh.visible = opacity > 0.001;
}
