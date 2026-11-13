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
