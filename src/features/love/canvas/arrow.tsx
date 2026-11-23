'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AdditiveBlending,
  CanvasTexture,
  DoubleSide,
  type Group,
  MeshBasicMaterial,
  QuadraticBezierCurve3,
  Shape,
  ShapeGeometry,
  Vector3,
} from 'three';

import { heart } from '../engine/heart-state';
import { heartWorld } from './heart';
import { emitSparks } from './sparks';
import { readTokenColors } from './token-colors';

const SHAFT = 1.2;
const TRAIL_EVERY = 0.05;
const LENGTH = 0.16; // arrow length as a fraction of the viewport height
const GLOW = 4.2; // well above the Bloom threshold: the arrow outshines the heart
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
  // Fletching sits dimmer than the head so only one end reads as the point.
  const feather = useMemo(
    () =>
      new MeshBasicMaterial({
        color: material.color.clone().multiplyScalar(0.45),
        side: DoubleSide,
        transparent: true,
        opacity: 0.85,
        toneMapped: false,
      }),
    [material],
  );
  const vane = useMemo(() => {
    const v = new Shape();
    v.moveTo(0, 0);
    v.lineTo(-0.3, 0);
    v.lineTo(-0.38, 0.13);
    v.lineTo(-0.1, 0.05);
    v.closePath();
    return new ShapeGeometry(v);
  }, []);
  const halo = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 64;
    const ctx = cv.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,236,190,1)');
      g.addColorStop(0.35, 'rgba(230,190,110,0.45)');
      g.addColorStop(1, 'rgba(230,190,110,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    }
    return new MeshBasicMaterial({
      map: new CanvasTexture(cv),
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
    });
  }, []);
  useEffect(
    () => () => {
      material.dispose();
      feather.dispose();
      vane.dispose();
      halo.map?.dispose();
      halo.dispose();
    },
    [material, feather, vane, halo],
  );

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
        emitSparks(2, point, { speed: 0.3, life: 0.9 });
      }
    }
    prev.current = t;
  });

  // Built along +x with the head at the origin so the tip lands exactly on the heart.
  return (
    <group ref={group} visible={false}>
      <mesh material={halo} position={[-0.12, 0, -0.01]}>
        <planeGeometry args={[0.9, 0.9]} />
      </mesh>
      <mesh material={halo} position={[-SHAFT / 2, 0, -0.01]}>
        <planeGeometry args={[SHAFT, 0.22]} />
      </mesh>
      <mesh
        material={material}
        position={[-(SHAFT + 0.3) / 2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.022, 0.022, SHAFT - 0.3, 8]} />
      </mesh>
      <mesh
        material={material}
        position={[-0.17, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <coneGeometry args={[0.12, 0.34, 16]} />
      </mesh>
      {[1, -1].map((side) => (
        <mesh
          key={side}
          geometry={vane}
          material={feather}
          position={[-SHAFT + 0.4, 0, 0]}
          scale={[1, side, 1]}
        />
      ))}
    </group>
  );
}
