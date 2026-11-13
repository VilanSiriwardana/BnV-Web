'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
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
import { heart } from '../engine/heart-state';
import { TIERS, type Tier } from '../engine/tiers';
import { buildHeartAttributes } from './heart-geometry';
import { heartFragment, heartVertex } from './heart-shaders';
import { readTokenColors } from './token-colors';

const MAX_PARTICLES = TIERS.high.particles;
const { damp } = MathUtils;
const depthPoint = new Vector3();

type Props = { tier: Tier; onTap?: () => void };

export function Heart({ tier, onTap }: Props) {
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
        uSkin: { value: 0 },
        uColorLav: { value: c?.primary.night },
        uColorLilac: { value: c?.['primary-hover'].night },
        uColorGold: { value: c?.gold.night },
        uColorRose: { value: c?.secondary.night },
      },
    });
  }, []);

  useEffect(() => {
    geometry.setDrawRange(0, TIERS[tier].particles);
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
    u.uSkin.value = heart.skin;

    const cam = state.camera;
    cam.position.z = damp(cam.position.z, heart.cameraZ, 6, delta);

    const g = group.current;
    if (!g) return;
    const vp = state.viewport.getCurrentViewport(
      cam,
      depthPoint.set(0, 0, heart.depth),
    );
    const w = ndcToWorld(heart.ndc, vp);
    g.position.x = damp(g.position.x, w.x, 6, delta);
    g.position.y = damp(g.position.y, w.y, 6, delta);
    g.position.z = heart.depth;
    const s = heart.scale * (1 + heart.idleScale);
    g.scale.setScalar(damp(g.scale.x, s, 8, delta));
    g.rotation.y = damp(g.rotation.y, heart.yaw, 4, delta);
    g.rotation.z = heart.roll;
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
      {onTap && (
        <mesh onClick={onTap}>
          <circleGeometry args={[0.95, 24]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
