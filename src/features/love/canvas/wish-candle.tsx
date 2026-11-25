'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  type Group,
  MeshBasicMaterial,
  NormalBlending,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
} from 'three';

import { candle } from '../engine/candle-state';
import { ndcToWorld, WISH_STAR_NDC } from '../engine/heart-path';
import { TIERS, type Tier } from '../engine/tiers';
import {
  cakeFragment,
  cakeVertex,
  flameFragment,
  quadVertex,
  smokeFragment,
} from './candle-shaders';
import { mulberry32 } from './heart-geometry';
import { readTokenColors } from './token-colors';

// Cake layout (world units, relative to the flame's base at the wish-star point).
const LOWER = { y: -0.78, h: 0.24, r: 0.55 };
const UPPER = { y: -0.52, h: 0.2, r: 0.4 };
const STICK = { y: -0.3, h: 0.3, w: 0.05 };

function cakeAttributes(count: number) {
  const rand = mulberry32(21);
  const pos = new Float32Array(count * 3);
  const aRand = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const upper = rand() < 0.42;
    const tier = upper ? UPPER : LOWER;
    const rim = rand() < 0.14;
    const a = rand() * Math.PI * 2;
    // Front-facing shell plus a filled top: reads as a cylinder from the camera.
    const top = !rim && rand() < 0.3;
    const r = top ? tier.r * Math.sqrt(rand()) : tier.r;
    const y = rim
      ? tier.y + tier.h / 2
      : top
        ? tier.y + tier.h / 2
        : tier.y + (rand() - 0.5) * tier.h;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(a) * r * 0.35;
    aRand[i * 4] = rand();
    aRand[i * 4 + 1] = 0.6 + rand() * 0.8;
    aRand[i * 4 + 2] = rim ? 2 : upper ? 1 : 0;
    aRand[i * 4 + 3] = rand();
  }
  return { pos, aRand };
}

// Romance Additions F5: cake, candle, flame and smoke at the wish-star point. Mounted by
// love-canvas only while the Wish section is near (candle.visible > 0).
export function WishCandle({ tier }: { tier: Tier }) {
  const group = useRef<Group>(null);
  const point = useMemo(() => new Vector3(), []);
  const count = TIERS[tier].cakeParticles;

  const parts = useMemo(() => {
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    const c = root ? readTokenColors(root) : null;
    const gold = c?.gold.night ?? new Color('#d4af37');
    const lav = c?.primary.night ?? new Color('#b9a3e3');
    const rose = c?.secondary.night ?? new Color('#e8a0b4');
    const ivory = c?.foreground.night ?? new Color('#fff');
    const quad = new PlaneGeometry(1, 1);
    const flame = new ShaderMaterial({
      vertexShader: quadVertex,
      fragmentShader: flameFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uGold: { value: gold },
        uIvory: { value: ivory },
        uRose: { value: rose },
        uTime: { value: 0 },
        uBlow: { value: 0 },
        uOut: { value: 0 },
        uVisible: { value: 0 },
      },
    });
    const smoke = new ShaderMaterial({
      vertexShader: quadVertex,
      fragmentShader: smokeFragment,
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
      uniforms: {
        uColor: { value: ivory },
        uTime: { value: 0 },
        uOut: { value: 0 },
        uVisible: { value: 0 },
      },
    });
    const stick = new MeshBasicMaterial({
      color: gold,
      transparent: true,
      opacity: 0,
    });
    // Low tier: flat cake (two tinted planes) instead of particles.
    const flatLower = new MeshBasicMaterial({
      color: lav,
      transparent: true,
      opacity: 0,
    });
    const flatUpper = new MeshBasicMaterial({
      color: gold,
      transparent: true,
      opacity: 0,
    });
    const cakeMaterial = new ShaderMaterial({
      vertexShader: cakeVertex,
      fragmentShader: cakeFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uPR: { value: 1 },
        uTime: { value: 0 },
        uVisible: { value: 0 },
        uColorLav: { value: lav },
        uColorGold: { value: gold },
        uColorRose: { value: rose },
      },
    });
    return { quad, flame, smoke, stick, flatLower, flatUpper, cakeMaterial };
  }, []);

  const cake = useMemo(() => {
    if (!count) return null;
    const { pos, aRand } = cakeAttributes(count);
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(pos, 3));
    g.setAttribute('aRand', new BufferAttribute(aRand, 4));
    return g;
  }, [count]);

  useEffect(() => () => cake?.dispose(), [cake]);
  useEffect(
    () => () => Object.values(parts).forEach((p) => p.dispose()),
    [parts],
  );

  const partsRef = useRef(parts);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.visible = candle.visible > 0.001;
    if (!g.visible) return;
    const p = partsRef.current;
    const v = candle.visible;
    const fu = p.flame.uniforms;
    fu.uTime.value += delta;
    fu.uBlow.value = candle.blow;
    fu.uOut.value = candle.out;
    fu.uVisible.value = v;
    const su = p.smoke.uniforms;
    su.uTime.value = fu.uTime.value;
    su.uOut.value = candle.out;
    su.uVisible.value = v;
    const cu = p.cakeMaterial.uniforms;
    cu.uTime.value = fu.uTime.value;
    cu.uPR.value = state.gl.getPixelRatio();
    cu.uVisible.value = v;
    p.stick.opacity = v;
    p.flatLower.opacity = v * 0.55;
    p.flatUpper.opacity = v * 0.55;
    const vp = state.viewport.getCurrentViewport(
      state.camera,
      point.set(0, 0, 0),
    );
    const w = ndcToWorld(WISH_STAR_NDC, vp);
    // Blueprint 062: scale the cake to fit inside the medallion ring.
    const cakeH = UPPER.y + UPPER.h / 2;
    g.scale.setScalar(Math.min(1, (vp.height * 0.18) / cakeH));
    g.position.set(w.x, w.y, 0.05);
  });

  return (
    <group ref={group} visible={false}>
      <mesh
        geometry={parts.quad}
        material={parts.stick}
        position={[0, STICK.y, 0]}
        scale={[STICK.w, STICK.h, 1]}
      />
      {cake ? (
        <points
          geometry={cake}
          material={parts.cakeMaterial}
          frustumCulled={false}
        />
      ) : (
        <>
          <mesh
            geometry={parts.quad}
            material={parts.flatLower}
            position={[0, LOWER.y, 0]}
            scale={[LOWER.r * 2, LOWER.h, 1]}
          />
          <mesh
            geometry={parts.quad}
            material={parts.flatUpper}
            position={[0, UPPER.y, 0]}
            scale={[UPPER.r * 2, UPPER.h, 1]}
          />
        </>
      )}
      <mesh
        geometry={parts.quad}
        material={parts.smoke}
        position={[0, 0.45, -0.01]}
        scale={[0.4, 0.9, 1]}
        frustumCulled={false}
      />
      <mesh
        geometry={parts.quad}
        material={parts.flame}
        position={[0, 0.08, 0]}
        scale={[0.4, 0.55, 1]}
        frustumCulled={false}
      />
    </group>
  );
}
