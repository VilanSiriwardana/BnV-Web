'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  BufferGeometry,
  Color,
  ExtrudeGeometry,
  Float32BufferAttribute,
  type InstancedMesh,
  MathUtils,
  Object3D,
  PMREMGenerator,
  Shape,
  type Texture,
  Vector3,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { heart } from '../engine/heart-state';
import { REDUCED_MOTION_QUERY } from '../engine/motion-prefs';
import { TIERS, type Tier } from '../engine/tiers';
import { heartPoint, mulberry32 } from './heart-geometry';
import { readTokenColors } from './token-colors';

const TAP_POOL = 8;
const TAP_DURATION = 1000;
const dummy = new Object3D();
const tap = { start: -Infinity, count: 0 };

// Tap pool API (Experience §3.6): independent of `burst`.
export function spawnTapHearts(count = 6) {
  tap.start = performance.now();
  tap.count = Math.min(count, TAP_POOL);
}

export function heartShape(samples = 32) {
  const shape = new Shape();
  for (let i = 0; i <= samples; i++) {
    const [x, y] = heartPoint((i / samples) * Math.PI * 2);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  return shape;
}

// Blueprint 054: the 3D floating hearts — two full round lobes, a soft cleft and one clean point,
// built from béziers (the parametric heartPoint curve stays for the particle heart and the sky).
export function softHeartShape() {
  const s = new Shape();
  s.moveTo(0, -0.9);
  s.bezierCurveTo(0.35, -0.55, 0.95, -0.15, 0.95, 0.35);
  s.bezierCurveTo(0.95, 0.75, 0.62, 0.95, 0.42, 0.95);
  s.bezierCurveTo(0.2, 0.95, 0.05, 0.8, 0, 0.62);
  s.bezierCurveTo(-0.05, 0.8, -0.2, 0.95, -0.42, 0.95);
  s.bezierCurveTo(-0.62, 0.95, -0.95, 0.75, -0.95, 0.35);
  s.bezierCurveTo(-0.95, -0.15, -0.35, -0.55, 0, -0.9);
  return s;
}

/** Pillowy extrusion for softHeartShape (rounded edges all round). */
export const SOFT_HEART_EXTRUDE = {
  depth: 0.22,
  bevelEnabled: true,
  bevelSize: 0.12,
  bevelThickness: 0.14,
  bevelSegments: 4,
  curveSegments: 16,
} as const;

// Blueprint 055: one smooth, inflated surface (no bevel rings) from the softHeartShape outline.
export function inflatedHeartGeometry(depth = 0.32, rings = 4) {
  const outline = softHeartShape().getSpacedPoints(48).slice(0, -1);
  const n = outline.length;
  const cy = 0.1;
  const pos: number[] = [];
  const idx: number[] = [];
  const lift = (t: number) => (depth / 2) * Math.sqrt(1 - (1 - t) ** 2);
  for (const p of outline) pos.push(p.x, p.y, 0);
  const base = (side: number) => n + side * (rings * n + 1);
  for (const side of [0, 1]) {
    const sign = side === 0 ? 1 : -1;
    for (let r = 1; r <= rings; r++) {
      const k = 1 - r / (rings + 1);
      for (const p of outline)
        pos.push(p.x * k, cy + (p.y - cy) * k, sign * lift(1 - k));
    }
    pos.push(0, cy, sign * (depth / 2));
    const ring = (r: number) => (r === 0 ? 0 : base(side) + (r - 1) * n);
    const centre = base(side) + rings * n;
    const tri = (a: number, b: number, c: number) =>
      side === 0 ? idx.push(a, b, c) : idx.push(a, c, b);
    for (let r = 0; r < rings; r++) {
      const a = ring(r);
      const b = ring(r + 1);
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        tri(a + i, a + j, b + j);
        tri(a + i, b + j, b + i);
      }
    }
    const last = ring(rings);
    for (let i = 0; i < n; i++) tri(last + i, last + ((i + 1) % n), centre);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  g.center();
  return g;
}

let shared: BufferGeometry | null = null;
/** Module-cached inflated heart shared by the instanced hearts (never disposed per component). */
export const sharedHeartGeometry = () => (shared ??= inflatedHeartGeometry());

const LAVENDER = new Color('#b9a6e0');

/** Local studio reflections for the gold hearts (never set as scene.environment). */
export function useHeartEnvMap() {
  const gl = useThree((s) => s.gl);
  const env = useMemo<Texture>(() => {
    const pmrem = new PMREMGenerator(gl);
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return tex;
  }, [gl]);
  useEffect(() => () => env.dispose(), [env]);
  return env;
}

function extrudedHeart() {
  const g = new ExtrudeGeometry(softHeartShape(), SOFT_HEART_EXTRUDE);
  g.center();
  return g;
}

const lite = (tier: Tier) => tier === 'low' || tier === 'static';

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const { smoothstep } = MathUtils;

export function MiniHearts({ tier }: { tier: Tier }) {
  const ref = useRef<InstancedMesh>(null);
  const burstCount = TIERS[tier].miniHearts;
  const total = burstCount + TAP_POOL;

  const env = useHeartEnvMap();
  const owned = lite(tier);
  const geometry = useMemo(
    () => (owned ? extrudedHeart() : sharedHeartGeometry()),
    [owned],
  );

  const instances = useMemo(() => {
    const rand = mulberry32(11);
    return Array.from({ length: total }, () => {
      const u = rand() * 2 - 1;
      const phi = rand() * Math.PI * 2;
      const sq = Math.sqrt(1 - u * u);
      return {
        dir: new Vector3(sq * Math.cos(phi), sq * Math.sin(phi), u * 0.5),
        radius: 1.4 + rand() * 1.6,
        spin: (rand() - 0.5) * 6,
        scale: 0.04 + rand() * 0.06,
        color: Math.floor(rand() * 5),
      };
    });
  }, [total]);

  useEffect(() => {
    const mesh = ref.current;
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    if (!mesh || !root) return;
    const c = readTokenColors(root);
    const gold = c.gold.night;
    const palette: Color[] = [
      gold,
      gold.clone().offsetHSL(0, 0, 0.08),
      gold.clone().offsetHSL(0, 0, -0.08),
      gold,
      LAVENDER,
    ];
    instances.forEach((inst, i) => {
      mesh.setColorAt(i, palette[inst.color]);
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.instanceMatrix.needsUpdate = true;
  }, [instances]);

  useEffect(
    () => () => {
      if (owned) geometry.dispose();
    },
    [geometry, owned],
  );

  const wasActive = useRef(false);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const tapT = (performance.now() - tap.start) / TAP_DURATION;
    const tapActive = tapT >= 0 && tapT < 1;
    const active = heart.burst > 0.001 || tapActive;
    if (!active && !wasActive.current) return;
    wasActive.current = active;

    const time = state.clock.elapsedTime;
    const b = heart.burst;
    instances.forEach((inst, i) => {
      let reach = 0;
      let scale = 0;
      if (i < burstCount) {
        reach = inst.radius * easeOutCubic(b);
        scale = inst.scale * smoothstep(b, 0, 0.15);
      } else if (tapActive && i - burstCount < tap.count) {
        reach = inst.radius * 0.6 * easeOutCubic(tapT);
        scale = inst.scale * smoothstep(tapT, 0, 0.1) * (1 - tapT);
      }
      dummy.position.copy(inst.dir).multiplyScalar(reach);
      dummy.rotation.set(0, inst.spin * time, inst.spin * 0.3 * time);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      key={total}
      ref={ref}
      args={[geometry, undefined, total]}
      frustumCulled={false}
    >
      <meshPhysicalMaterial
        metalness={1}
        roughness={0.22}
        clearcoat={0.6}
        clearcoatRoughness={0.15}
        envMap={env}
        envMapIntensity={1.2}
        emissive="#ffffff"
        emissiveIntensity={0.08}
        onBeforeCompile={tintEmissive}
      />
    </instancedMesh>
  );
}

// Emissive takes the instance (token) colour instead of white, so hearts never read as neon.
function tintEmissive(shader: {
  vertexShader: string;
  fragmentShader: string;
}) {
  shader.vertexShader = shader.vertexShader
    .replace(
      'void main() {',
      'varying vec3 vEmissiveInstanceColor;\nvoid main() {',
    )
    .replace(
      '#include <color_vertex>',
      '#include <color_vertex>\n#ifdef USE_INSTANCING_COLOR\nvEmissiveInstanceColor = instanceColor.rgb;\n#else\nvEmissiveInstanceColor = vec3(1.0);\n#endif',
    );
  shader.fragmentShader = shader.fragmentShader.replace(
    'void main() {',
    'varying vec3 vEmissiveInstanceColor;\nvoid main() {',
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    'vec3 totalEmissiveRadiance = emissive;',
    'vec3 totalEmissiveRadiance = emissive * vEmissiveInstanceColor;',
  );
}

// Experience ?19.5: independent twinkles around the frame.
const AMBIENT = 8;
const ambientRand = mulberry32(23);
const ambient = Array.from({ length: AMBIENT }, (_, i) => ({
  start: i * 350 + ambientRand() * 2000,
  life: 1800 + ambientRand() * 1400,
  x: (i % 2 ? 1 : -1) * (0.35 + ambientRand() * 0.55),
  y: (ambientRand() * 2 - 1) * 0.85,
  scale: 0.06 + ambientRand() * 0.07,
  spin: (ambientRand() - 0.5) * 3,
  color: i % 3,
}));

// Blueprint 062: sections are split between petals and ambient hearts (heart-path PETAL_SECTIONS).
const ambientIdle = () =>
  heart.petalRelease < 0.01 &&
  !document.hidden &&
  !window.matchMedia(REDUCED_MOTION_QUERY).matches;

function respawn(o: (typeof ambient)[number], now: number) {
  const side = ambientRand() < 0.5 ? -1 : 1;
  if (ambientRand() < 0.5) {
    o.x = side * (0.35 + ambientRand() * 0.55);
    o.y = (ambientRand() * 2 - 1) * 0.85;
  } else {
    o.x = (ambientRand() * 2 - 1) * 0.9;
    o.y = side * (0.55 + ambientRand() * 0.3);
  }
  o.life = 1800 + ambientRand() * 1400;
  o.start = now + 500 + ambientRand() * 3500;
}

export function AmbientHearts({ tier }: { tier: Tier }) {
  const ref = useRef<InstancedMesh>(null);
  const centre = useMemo(() => new Vector3(), []);
  const env = useHeartEnvMap();
  const owned = lite(tier);
  const geometry = useMemo(
    () => (owned ? extrudedHeart() : sharedHeartGeometry()),
    [owned],
  );

  useEffect(() => {
    const mesh = ref.current;
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    if (!mesh || !root) return;
    const c = readTokenColors(root);
    const palette: Color[] = [c.gold.night, LAVENDER, c.gold.night];
    ambient.forEach((o, i) => {
      mesh.setColorAt(i, palette[o.color]);
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  useEffect(
    () => () => {
      if (owned) geometry.dispose();
    },
    [geometry, owned],
  );

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh || tier === 'low' || tier === 'static') return;
    const now = performance.now();
    const active = ambientIdle();
    const vp = state.viewport.getCurrentViewport(state.camera, centre);
    const time = state.clock.elapsedTime;
    ambient.forEach((o, i) => {
      if (now > o.start + o.life) respawn(o, now);
      const k = Math.min(1, Math.max(0, (now - o.start) / o.life));
      const fade = active
        ? smoothstep(k, 0, 0.2) * (1 - smoothstep(k, 0.7, 1)) * heart.ambientIn
        : 0;
      dummy.position.set(
        (o.x * vp.width) / 2,
        (o.y * vp.height) / 2 + 0.25 * easeOutCubic(k),
        0,
      );
      dummy.rotation.set(0, o.spin * time, 0);
      dummy.scale.setScalar(
        o.scale * fade * (1 + 0.12 * Math.sin(k * Math.PI * 2)),
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, undefined, AMBIENT]}
      frustumCulled={false}
    >
      <meshPhysicalMaterial
        metalness={1}
        roughness={0.22}
        clearcoat={0.6}
        clearcoatRoughness={0.15}
        envMap={env}
        envMapIntensity={1.2}
        emissive="#ffffff"
        emissiveIntensity={0.25}
        onBeforeCompile={tintEmissive}
      />
    </instancedMesh>
  );
}
