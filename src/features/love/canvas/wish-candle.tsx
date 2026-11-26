'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  Color,
  CylinderGeometry,
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
import { readTokenColors } from './token-colors';

// Cake layout (world units, relative to the flame's base at the wish-star point).
const LOWER = { y: -0.78, h: 0.24, r: 0.55 };
const UPPER = { y: -0.52, h: 0.2, r: 0.4 };
const STICK = { y: -0.3, h: 0.3, w: 0.05 };
// Blueprint 065: a slight downward look so the frosted tops read as a cake.
const TILT = 0.32;

function tierMaterial(
  base: Color,
  frost: Color,
  trim: Color,
  half: number,
  stripe = 0,
) {
  return new ShaderMaterial({
    vertexShader: cakeVertex,
    fragmentShader: cakeFragment,
    transparent: true,
    uniforms: {
      uBase: { value: base },
      uFrost: { value: frost },
      uTrim: { value: trim },
      uHalf: { value: half },
      uStripe: { value: stripe },
      uVisible: { value: 0 },
    },
  });
}

// Romance Additions F5: cake, candle, flame and smoke at the wish-star point. Mounted by
// love-canvas only while the Wish section is near (candle.visible > 0).
export function WishCandle({ tier }: { tier: Tier }) {
  const group = useRef<Group>(null);
  const point = useMemo(() => new Vector3(), []);
  // Low tiers keep the flat cake (two tinted planes).
  const solid = TIERS[tier].cakeParticles > 0;

  const parts = useMemo(() => {
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    const c = root ? readTokenColors(root) : null;
    const gold = c?.gold.night ?? new Color('#d4af37');
    const lav = c?.primary.night ?? new Color('#b9a3e3');
    const rose = c?.secondary.night ?? new Color('#e8a0b4');
    const ivory = c?.foreground.night ?? new Color('#fff');
    const cream = ivory.clone().lerp(rose, 0.18);
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
    const flatStick = new MeshBasicMaterial({
      color: gold,
      transparent: true,
      opacity: 0,
    });
    const lowerMat = tierMaterial(
      rose.clone().multiplyScalar(0.75),
      cream,
      gold,
      LOWER.h / 2,
    );
    const upperMat = tierMaterial(
      lav.clone().multiplyScalar(0.8),
      cream,
      gold,
      UPPER.h / 2,
    );
    const stickMat = tierMaterial(cream, cream, rose, STICK.h / 2, 1);
    return {
      quad,
      lowerGeo: new CylinderGeometry(LOWER.r, LOWER.r, LOWER.h, 48),
      upperGeo: new CylinderGeometry(UPPER.r, UPPER.r, UPPER.h, 48),
      stickGeo: new CylinderGeometry(STICK.w / 2, STICK.w / 2, STICK.h, 16),
      flame,
      smoke,
      flatLower,
      flatUpper,
      flatStick,
      lowerMat,
      upperMat,
      stickMat,
    };
  }, []);

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
    for (const m of [p.lowerMat, p.upperMat, p.stickMat]) {
      m.uniforms.uVisible.value = v;
      m.depthWrite = v > 0.99;
    }
    p.flatStick.opacity = v;
    p.flatLower.opacity = v * 0.55;
    p.flatUpper.opacity = v * 0.55;
    const vp = state.viewport.getCurrentViewport(
      state.camera,
      point.set(0, 0, 0),
    );
    const w = ndcToWorld(WISH_STAR_NDC, vp);
    // Blueprint 062: scale the cake to fit inside the medallion ring.
    // Blueprint 065: full height, cake base to flame tip (was negative, which mirrored the cake).
    const cakeH = 0.36 - (LOWER.y - LOWER.h / 2);
    const s = Math.min(1, (vp.height * 0.24) / cakeH);
    g.scale.setScalar(s);
    g.position.set(w.x, w.y + s * 0.25, 0.05);
  });

  return (
    <group ref={group} visible={false}>
      {solid ? (
        <group rotation={[TILT, 0, 0]}>
          <mesh
            geometry={parts.lowerGeo}
            material={parts.lowerMat}
            position={[0, LOWER.y, 0]}
          />
          <mesh
            geometry={parts.upperGeo}
            material={parts.upperMat}
            position={[0, UPPER.y, 0]}
          />
          <mesh
            geometry={parts.stickGeo}
            material={parts.stickMat}
            position={[0, STICK.y, 0]}
          />
        </group>
      ) : (
        <>
          <mesh
            geometry={parts.quad}
            material={parts.flatStick}
            position={[0, STICK.y, 0]}
            scale={[STICK.w, STICK.h, 1]}
          />
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
