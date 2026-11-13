'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, type Mesh, ShaderMaterial } from 'three';

import { heart } from '../engine/heart-state';
import { heartWorld } from './heart';
import { readTokenColors } from './token-colors';

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// Radial fade across the ring's width, whole ring fades as it expands.
const fragment = /* glsl */ `
uniform vec3 uColor;
uniform float uProgress;
varying vec2 vUv;
void main() {
  float band = sin(vUv.x * 3.14159);
  float a = band * (1.0 - uProgress) * 0.8;
  gl_FragColor = vec4(uColor * a, a);
}`;

// Experience §3.6 shockwave ring, driven by heart.ring (0 → 1).
export function ShockRing() {
  const mesh = useRef<Mesh>(null);
  const material = useMemo(() => {
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    const c = root ? readTokenColors(root) : null;
    return new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uColor: { value: c?.gold.night }, uProgress: { value: 0 } },
    });
  }, []);

  useEffect(() => () => material.dispose(), [material]);
  const materialRef = useRef(material);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const r = heart.ring;
    m.visible = r > 0 && r < 1;
    if (!m.visible) return;
    m.position.copy(heartWorld);
    m.scale.setScalar(heart.scale * (0.3 + r * 2.5));
    materialRef.current.uniforms.uProgress.value = r;
  });

  return (
    <mesh ref={mesh} material={material} visible={false} renderOrder={3}>
      <ringGeometry args={[0.85, 1, 64, 1]} />
    </mesh>
  );
}
