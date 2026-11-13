'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  Color,
  type Mesh,
  NormalBlending,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
} from 'three';

import { ndcToWorld, WISH_STAR_NDC } from '../engine/heart-path';
import { heart } from '../engine/heart-state';
import { readTokenColors } from './token-colors';

const vertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
// Four-point star + halo in one quad (Experience §3.6). uHold drives brightness and halo.
const fragment = /* glsl */ `
uniform vec3 uGold;
uniform vec3 uIvory;
uniform float uHold;
uniform float uVisible;
uniform float uTime;
varying vec2 vUv;
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float r = length(p);
  float ax = abs(p.x), ay = abs(p.y);
  float star = max(0.0, 1.0 - (ax * ay * 60.0 + r * 1.6));
  star = pow(star, 1.6);
  float halo = smoothstep(1.0, 0.0, r) * mix(0.2, 1.0, uHold) * 0.45;
  float twinkle = 0.9 + 0.1 * sin(uTime * 3.0);
  vec3 col = mix(uGold, uIvory, star * 0.6);
  float a = clamp(star * (0.7 + 0.5 * uHold) * twinkle + halo, 0.0, 1.0);
  gl_FragColor = vec4(col, a * uVisible);
}
`;

export function WishStar() {
  const ref = useRef<Mesh>(null);
  const point = useMemo(() => new Vector3(), []);
  const { geometry, material } = useMemo(() => {
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    const c = root ? readTokenColors(root) : null;
    return {
      geometry: new PlaneGeometry(1, 1),
      material: new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: NormalBlending,
        uniforms: {
          uGold: { value: c?.gold.day ?? new Color() },
          uIvory: { value: c?.background.day ?? new Color() },
          uHold: { value: 0 },
          uVisible: { value: 0 },
          uTime: { value: 0 },
        },
      }),
    };
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  const materialRef = useRef(material);
  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.visible = heart.star > 0.001;
    if (!mesh.visible) return;
    const u = materialRef.current.uniforms;
    u.uTime.value += delta;
    u.uHold.value = heart.starHold;
    u.uVisible.value = heart.star;
    const vp = state.viewport.getCurrentViewport(
      state.camera,
      point.set(0, 0, 0),
    );
    const w = ndcToWorld(WISH_STAR_NDC, vp);
    mesh.position.set(w.x, w.y, 0.1);
    mesh.scale.setScalar(0.9 * (1 + 0.6 * heart.starHold));
  });

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={material}
      visible={false}
      frustumCulled={false}
    />
  );
}
