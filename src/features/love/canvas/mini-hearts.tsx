'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  type Color,
  ExtrudeGeometry,
  type InstancedMesh,
  MathUtils,
  Object3D,
  Shape,
  Vector3,
} from 'three';

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

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const { smoothstep } = MathUtils;

export function MiniHearts({ tier }: { tier: Tier }) {
  const ref = useRef<InstancedMesh>(null);
  const burstCount = TIERS[tier].miniHearts;
  const total = burstCount + TAP_POOL;

  const geometry = useMemo(() => {
    const g = new ExtrudeGeometry(heartShape(), {
      depth: 0.25,
      bevelEnabled: true,
      bevelSize: 0.06,
      bevelThickness: 0.06,
      bevelSegments: 2,
      curveSegments: 6,
    });
    g.center();
    return g;
  }, []);

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
    const palette: Color[] = [
      c.primary.night,
      c.secondary.night,
      c.gold.night,
      c.foreground.night,
      c['primary-hover'].night,
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

  useEffect(() => () => geometry.dispose(), [geometry]);

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
      <meshStandardMaterial
        emissive="#ffffff"
        emissiveIntensity={0.15}
        roughness={0.5}
      />
    </instancedMesh>
  );
}

// Experience ?19.5: independent twinkles around the frame.
const AMBIENT = 12;
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
  const geometry = useMemo(() => {
    const g = new ExtrudeGeometry(heartShape(), {
      depth: 0.2,
      bevelEnabled: true,
      bevelSize: 0.05,
      bevelThickness: 0.05,
      bevelSegments: 2,
      curveSegments: 6,
    });
    g.center();
    return g;
  }, []);

  useEffect(() => {
    const mesh = ref.current;
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    if (!mesh || !root) return;
    const c = readTokenColors(root);
    const palette: Color[] = [c.gold.night, c.primary.night, c.secondary.night];
    ambient.forEach((o, i) => {
      mesh.setColorAt(i, palette[o.color]);
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

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
        ? smoothstep(k, 0, 0.2) * (1 - smoothstep(k, 0.7, 1))
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
      <meshStandardMaterial
        emissive="#ffffff"
        emissiveIntensity={1.6}
        roughness={0.5}
        toneMapped={false}
        onBeforeCompile={(shader) => {
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
        }}
      />
    </instancedMesh>
  );
}
