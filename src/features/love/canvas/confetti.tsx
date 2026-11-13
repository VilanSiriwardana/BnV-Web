'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  Color,
  DoubleSide,
  InstancedBufferAttribute,
  type InstancedMesh,
  Matrix4,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
} from 'three';

import { confetti, LIFE_S } from '../engine/confetti-state';
import { TIERS, type Tier } from '../engine/tiers';
import { heartWorld } from './heart';
import { mulberry32 } from './heart-geometry';
import { readTokenColors } from './token-colors';

const MAX = TIERS.high.confetti;

// Experience §3.6: p = p0 + v t + ½ g t², with drag and flutter. All motion on the GPU.
const vertex = /* glsl */ `
attribute vec3 aVel;
attribute vec3 aSpin;
attribute vec3 aColor;
uniform float uT;
uniform vec3 uOrigin;
varying vec3 vColor;
varying float vAlpha;

mat3 rot(vec3 a) {
  vec3 c = cos(a), s = sin(a);
  return mat3(c.y * c.z, c.y * s.z, -s.y,
              s.x * s.y * c.z - c.x * s.z, s.x * s.y * s.z + c.x * c.z, s.x * c.y,
              c.x * s.y * c.z + s.x * s.z, c.x * s.y * s.z - s.x * c.z, c.x * c.y);
}

void main() {
  float t = uT;
  float k = 1.4; // drag
  vec3 drift = aVel * (1.0 - exp(-k * t)) / k;
  vec3 g = vec3(0.0, -1.6, 0.0);
  vec3 p = uOrigin + drift + 0.5 * g * t * t * 0.6;
  p.x += sin(t * 3.0 + aSpin.x * 6.0) * 0.08 * t;
  vec3 local = rot(aSpin * t * 4.0) * position;
  vColor = aColor;
  vAlpha = 1.0 - smoothstep(${(LIFE_S * 0.6).toFixed(1)}, ${LIFE_S.toFixed(1)}, t);
  gl_Position = projectionMatrix * viewMatrix * vec4(p + local, 1.0);
}
`;
const fragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() { gl_FragColor = vec4(vColor, vAlpha); }
`;

export function Confetti({ tier }: { tier: Tier }) {
  const ref = useRef<InstancedMesh>(null);
  const seen = useRef(-Infinity);

  const { geometry, material } = useMemo(() => {
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    const c = root ? readTokenColors(root) : null;
    const palette = c
      ? [c.primary.day, c.secondary.day, c.gold.day, c.background.day]
      : [new Color()];
    const rand = mulberry32(11);
    const vel = new Float32Array(MAX * 3);
    const spin = new Float32Array(MAX * 3);
    const col = new Float32Array(MAX * 3);
    for (let i = 0; i < MAX; i++) {
      // Upward cone, ±35° around +y.
      const a = (rand() - 0.5) * 1.2;
      const z = (rand() - 0.5) * 0.8;
      const speed = 2.2 + rand() * 2.4;
      vel.set([Math.sin(a) * speed, Math.cos(a) * speed, z * speed], i * 3);
      spin.set([rand() * 3, rand() * 3, rand() * 3], i * 3);
      palette[i % palette.length].toArray(col, i * 3);
    }
    const g = new PlaneGeometry(0.06, 0.03);
    g.setAttribute('aVel', new InstancedBufferAttribute(vel, 3));
    g.setAttribute('aSpin', new InstancedBufferAttribute(spin, 3));
    g.setAttribute('aColor', new InstancedBufferAttribute(col, 3));
    const m = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      uniforms: { uT: { value: 0 }, uOrigin: { value: new Vector3() } },
    });
    return { geometry: g, material: m };
  }, []);

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const id = new Matrix4();
    for (let i = 0; i < MAX; i++) mesh.setMatrixAt(i, id);
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  const materialRef = useRef(material);
  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = materialRef.current;
    const t = (performance.now() - confetti.launchedAt) / 1000;
    mesh.visible = t >= 0 && t < LIFE_S;
    if (!mesh.visible) return;
    if (seen.current !== confetti.launchedAt) {
      seen.current = confetti.launchedAt;
      m.uniforms.uOrigin.value.copy(heartWorld);
    }
    m.uniforms.uT.value = t;
    mesh.count = Math.round(TIERS[tier].confetti * confetti.scale);
  });

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, MAX]}
      frustumCulled={false}
      visible={false}
    />
  );
}
