'use client';

import { useFrame } from '@react-three/fiber';
import { type ReactNode, useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  type Group,
  MathUtils,
  ShaderMaterial,
  Vector3,
} from 'three';

import { ndcToWorld } from '../engine/heart-path';
import { director } from '../engine/heart-director';
import { heart } from '../engine/heart-state';
import { TIERS, type Tier } from '../engine/tiers';
import { buildHeartAttributes } from './heart-geometry';
import { heartFragment, heartVertex } from './heart-shaders';
import { readTokenColors } from './token-colors';

const MAX_PARTICLES = TIERS.high.particles;
const { clamp, damp } = MathUtils;
const depthPoint = new Vector3();
const SNAP_DISTANCE = 10;
// The heart's world centre, for effects that live outside its group (arrow, ring, orbs).
export const heartWorld = new Vector3();

type Props = { tier: Tier; onTap?: () => void; children?: ReactNode };

export function Heart({ tier, onTap, children }: Props) {
  const group = useRef<Group>(null);

  const geometry = useMemo(() => {
    const a = buildHeartAttributes(MAX_PARTICLES, 7);
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(a.aHeart, 3));
    g.setAttribute('aHeart', new BufferAttribute(a.aHeart, 3));
    g.setAttribute('aRibbon', new BufferAttribute(a.aRibbon, 3));
    g.setAttribute('aScatter', new BufferAttribute(a.aScatter, 3));
    g.setAttribute('aRand', new BufferAttribute(a.aRand, 4));
    return g;
  }, []);

  const material = useMemo(() => {
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    const c = root ? readTokenColors(root) : null;
    return new ShaderMaterial({
      vertexShader: heartVertex,
      fragmentShader: heartFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uForm: { value: heart.form },
        uBurst: { value: heart.burst },
        uTime: { value: 0 },
        uPR: { value: 1 },
        uBeat: { value: 0 },
        uBeatScale: { value: 1 },
        uShine: { value: 0 },
        uGlow: { value: heart.glow },
        uGold: { value: 0 },
        uScale: { value: 1 },
        uColorLav: { value: c?.primary.night },
        uColorLilac: { value: c?.['primary-hover'].night },
        uColorGold: { value: c?.gold.night },
        uColorRose: { value: c?.secondary.night },
      },
    });
  }, []);

  const drawn = useRef(0);
  useEffect(() => {
    drawn.current = TIERS[tier].particles;
    geometry.setDrawRange(0, drawn.current);
  }, [geometry, tier]);

  const materialRef = useRef(material);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, delta) => {
    const u = materialRef.current?.uniforms;
    if (!u) return;
    u.uTime.value += delta;
    u.uPR.value = state.gl.getPixelRatio();
    // Director tweens are already eased; a fast damp only removes sub-frame jitter.
    u.uForm.value = damp(u.uForm.value, heart.form, 20, delta);
    u.uBurst.value = damp(u.uBurst.value, heart.burst, 20, delta);
    u.uShine.value = heart.shine;
    u.uGlow.value = damp(u.uGlow.value, heart.glow + heart.idleGlow, 8, delta);
    u.uBeat.value = heart.beat;
    u.uBeatScale.value = damp(
      u.uBeatScale.value,
      director.baseline() === 'hero' ? 0.4 : 1,
      2,
      delta,
    );
    // All-night theme: the heart turns more golden section by section and on the letter seal.
    u.uGold.value = damp(
      u.uGold.value,
      Math.max(heart.gold, heart.sealRim),
      4,
      delta,
    );

    const cam = state.camera;
    // Section hand-offs that jump the rail (Memories → Timeline) snap instead of flying back.
    const snap = Math.abs(cam.position.z - heart.cameraZ) > SNAP_DISTANCE;
    cam.position.z = snap
      ? heart.cameraZ
      : damp(cam.position.z, heart.cameraZ, 6, delta);
    const shake = heart.cameraShake;
    cam.position.x = shake ? (Math.random() * 2 - 1) * shake : 0;
    cam.position.y = shake ? (Math.random() * 2 - 1) * shake : 0;

    const g = group.current;
    if (!g) return;
    // Depth damps at the camera's rate so the heart keeps its distance while the rail moves.
    g.position.z = snap
      ? heart.depth
      : damp(g.position.z, heart.depth, 6, delta);
    const vp = state.viewport.getCurrentViewport(
      cam,
      depthPoint.set(0, 0, g.position.z),
    );
    const w = ndcToWorld(
      { x: heart.ndc.x + heart.lean.x, y: heart.ndc.y + heart.lean.y },
      vp,
    );
    g.position.x = damp(g.position.x, w.x, 6, delta);
    g.position.y = damp(g.position.y, w.y, 6, delta);
    heartWorld.copy(g.position);
    const s = heart.scale * (1 + heart.idleScale + heart.flinch);
    g.scale.setScalar(damp(g.scale.x, s, 8, delta));
    u.uScale.value = g.scale.x;
    // A small heart needs fewer sprites; any prefix stays balanced (ribbonSide alternates).
    const n = Math.round(TIERS[tier].particles * clamp(g.scale.x, 0.25, 1));
    if (n !== drawn.current) {
      drawn.current = n;
      geometry.setDrawRange(0, n);
    }
    g.rotation.y = damp(g.rotation.y, heart.yaw, 4, delta);
    g.rotation.z = heart.roll;
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
      {children}
      {onTap && (
        <mesh onClick={onTap}>
          <circleGeometry args={[0.95, 24]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
