'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  FloatType,
  NearestFilter,
  type Points,
  RGBAFormat,
  ShaderMaterial,
  Vector3,
} from 'three';

import { dance, frameAt } from '../engine/dance-state';
import { TIERS, type Tier } from '../engine/tiers';
import { buildDanceAttributes } from './dance-geometry';
import { danceFragment, danceVertex } from './dance-shaders';
import { readTokenColors } from './token-colors';

const MAX_PARTICLES = TIERS.high.danceParticles;
const centre = new Vector3();

// Experience §19.6: the dancing couple as one glowing particle silhouette, built like the heart.
export function DanceDuo({ tier }: { tier: Tier }) {
  const points = useRef<Points>(null);

  const attributes = useMemo(() => buildDanceAttributes(MAX_PARTICLES), []);
  const frames = useMemo(() => {
    const texture = new DataTexture(
      attributes.positions,
      attributes.width,
      attributes.height,
      RGBAFormat,
      FloatType,
    );
    texture.minFilter = NearestFilter;
    texture.magFilter = NearestFilter;
    texture.needsUpdate = true;
    return texture;
  }, [attributes]);

  const geometry = useMemo(() => {
    const a = attributes;
    const g = new BufferGeometry();
    g.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(MAX_PARTICLES * 3), 3),
    );
    g.setAttribute('aIndex', new BufferAttribute(a.index, 1));
    g.setAttribute('aRand', new BufferAttribute(a.rand, 4));
    g.setAttribute('aInfo', new BufferAttribute(a.info, 2));
    return g;
  }, [attributes]);

  const material = useMemo(() => {
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    const c = root ? readTokenColors(root) : null;
    return new ShaderMaterial({
      vertexShader: danceVertex,
      fragmentShader: danceFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uFrames: { value: frames },
        uRows: { value: attributes.rowsPerFrame },
        uFrame: { value: 0 },
        uTime: { value: 0 },
        uPR: { value: 1 },
        uGlow: { value: 0.7 },
        uVisible: { value: 0 },
        uColorLav: { value: c?.primary.night },
        uColorLilac: { value: c?.['primary-hover'].night },
        uColorGold: { value: c?.gold.night },
        uColorRose: { value: c?.secondary.night },
      },
    });
  }, [frames, attributes.rowsPerFrame]);

  useEffect(() => {
    geometry.setDrawRange(0, TIERS[tier].danceParticles);
  }, [geometry, tier]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      frames.dispose();
    },
    [geometry, material, frames],
  );

  const materialRef = useRef(material);

  useFrame((state, delta) => {
    const p = points.current;
    const u = materialRef.current?.uniforms;
    if (!p || !u) return;
    p.visible = dance.visible > 0.01;
    if (!p.visible) return;
    const vp = state.viewport.getCurrentViewport(state.camera, centre);
    // ≈ 2 units tall; stands on the lower part of the stage, under the copy.
    p.scale.setScalar((vp.height * 0.6) / 2);
    p.position.set(0, -vp.height * 0.47, 0);
    u.uTime.value += delta;
    u.uPR.value = state.gl.getPixelRatio();
    u.uFrame.value = frameAt(dance.t);
    u.uVisible.value = dance.visible;
  });

  return (
    <points
      ref={points}
      geometry={geometry}
      material={material}
      frustumCulled={false}
      visible={false}
    />
  );
}
