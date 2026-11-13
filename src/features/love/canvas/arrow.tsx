'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DoubleSide,
  type Group,
  MeshBasicMaterial,
  QuadraticBezierCurve3,
  Vector3,
} from 'three';

import { heart } from '../engine/heart-state';
import { heartWorld } from './heart';
import { emitSparks } from './sparks';
import { readTokenColors } from './token-colors';

const SHAFT = 1.2;
const TRAIL_EVERY = 0.05;
const LENGTH = 0.16; // arrow length as a fraction of the viewport height
const GLOW = 2.5; // pushes the gold above the Bloom threshold
const start = new Vector3();
const control = new Vector3();
const point = new Vector3();
const tangent = new Vector3();
const curve = new QuadraticBezierCurve3(start, control, heartWorld);

// Mounts only while heart.arrow > 0 (Experience §3.6); the edge check is the only state update.
export function Arrow() {
  const [live, setLive] = useState(false);
  useFrame(() => {
    const on = heart.arrow > 0;
    if (on !== live) setLive(on);
  });
  return live ? <ArrowFlight /> : null;
}

function ArrowFlight() {
  const group = useRef<Group>(null);
  const prev = useRef(0);
  const lastTrail = useRef(0);

  const material = useMemo(() => {
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    const c = root ? readTokenColors(root) : null;
    return new MeshBasicMaterial({
      color: c?.gold.night.clone().multiplyScalar(GLOW),
      side: DoubleSide,
      toneMapped: false,
    });
  }, []);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = heart.arrow;
    // Just outside the top-left edge at the heart's depth, on a gentle arc.
    const vp = state.viewport.getCurrentViewport(state.camera, heartWorld);
    g.scale.setScalar((vp.height * LENGTH) / SHAFT);
    start.set(
      heartWorld.x - vp.width * 0.55,
      heartWorld.y + vp.height * 0.55,
      heartWorld.z,
    );
    control.set(
      (start.x + heartWorld.x) / 2,
      Math.max(start.y, heartWorld.y) + vp.height * 0.2,
      heartWorld.z,
    );

    if (t >= 1) {
      if (prev.current < 1) emitSparks(40, heartWorld, { spread: 1.2 });
      g.visible = false;
    } else {
      curve.getPoint(t, point);
      curve.getTangent(Math.max(0.001, t), tangent);
      g.visible = true;
      g.position.copy(point);
      g.rotation.z = Math.atan2(tangent.y, tangent.x);
      lastTrail.current += delta;
      if (t > 0.05 && lastTrail.current > TRAIL_EVERY) {
        lastTrail.current = 0;
        emitSparks(1, point, { speed: 0.25, life: 0.7 });
      }
    }
    prev.current = t;
  });

  // Built along +x with the head at the origin so the tip lands exactly on the heart.
  return (
    <group ref={group} visible={false}>
      <mesh
        material={material}
        position={[-SHAFT / 2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.035, 0.035, SHAFT, 8]} />
      </mesh>
      <mesh
        material={material}
        position={[-0.12, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <coneGeometry args={[0.1, 0.24, 12]} />
      </mesh>
      {[0.45, -0.45].map((tilt) => (
        <mesh
          key={tilt}
          material={material}
          position={[-SHAFT + 0.12, Math.sign(tilt) * 0.06, 0]}
          rotation={[0, 0, tilt]}
        >
          <planeGeometry args={[0.3, 0.14]} />
        </mesh>
      ))}
    </group>
  );
}
