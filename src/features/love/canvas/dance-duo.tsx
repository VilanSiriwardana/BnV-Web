'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  type Points,
  ShaderMaterial,
  Vector3,
} from 'three';

import { damp, dance, poseAt } from '../engine/dance-state';
import { TIERS, type Tier } from '../engine/tiers';
import {
  buildDanceParticles,
  packedShapes,
  packShapes,
} from './dance-geometry';
import { danceFragment, danceVertex } from './dance-shaders';
import { buildPose, interpolateSpec, KEYFRAMES } from './dance-silhouettes';
import { readTokenColors } from './token-colors';

const MAX_PARTICLES = TIERS.high.danceParticles;
const centre = new Vector3();
const CAMERA_DISTANCE = 6;

// Experience §19.6: the dancing couple as one glowing particle silhouette, built like the heart.
// Blueprint 079: the pose is rebuilt live from the keyframes (damped scroll), and the couple is
// mirrored so she stands on the left as in the reference stills.
export function DanceDuo({ tier }: { tier: Tier }) {
  const points = useRef<Points>(null);
  const shown = useRef(-1);

  const geometry = useMemo(() => {
    const a = buildDanceParticles(MAX_PARTICLES);
    const g = new BufferGeometry();
    g.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(MAX_PARTICLES * 3), 3),
    );
    g.setAttribute('aShape', new BufferAttribute(a.shape, 1));
    g.setAttribute('aUV', new BufferAttribute(a.uv, 2));
    g.setAttribute('aRand', new BufferAttribute(a.rand, 4));
    g.setAttribute('aInfo', new BufferAttribute(a.info, 2));
    return g;
  }, []);

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
        uShapes: { value: packShapes(buildPose(KEYFRAMES[0]), packedShapes()) },
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
  }, []);

  useEffect(() => {
    geometry.setDrawRange(0, TIERS[tier].danceParticles);
  }, [geometry, tier]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  const materialRef = useRef(material);

  useFrame((state, delta) => {
    const p = points.current;
    const u = materialRef.current?.uniforms;
    if (!p || !u) return;
    p.visible = dance.visible > 0.01;
    if (!p.visible) return;
    // The camera rides the Memories rail and stays at its end, so the couple keeps the distance it was
    // designed at (camera z 6, couple z 0) in front of wherever the camera is.
    const z = state.camera.position.z - CAMERA_DISTANCE;
    const vp = state.viewport.getCurrentViewport(
      state.camera,
      centre.set(0, 0, z),
    );
    // ≈ 2 units tall; stands on the lower part of the stage, under the copy.
    const s = (vp.height * 0.6) / 2;
    p.scale.set(-s, s, s);
    p.position.set(0, -vp.height * 0.47, z);
    u.uTime.value += delta;
    u.uPR.value = state.gl.getPixelRatio();
    u.uVisible.value = dance.visible;

    const next =
      shown.current < 0
        ? dance.t
        : damp(shown.current, dance.t, Math.min(delta, 0.1));
    if (Math.abs(next - shown.current) < 1e-4) return;
    shown.current = next;
    const { index, k } = poseAt(next);
    packShapes(
      buildPose(interpolateSpec(KEYFRAMES[index], KEYFRAMES[index + 1], k)),
      u.uShapes.value,
    );
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
