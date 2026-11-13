'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  ShaderMaterial,
  type Vector3,
} from 'three';

import { readTokenColors } from './token-colors';

// Experience §3.6: one 60-point pool shared by the arrow trail, the arrow dissolve and glints.
const POOL = 60;
const pool = {
  origin: new Float32Array(POOL * 3),
  velocity: new Float32Array(POOL * 3),
  birth: new Float32Array(POOL).fill(-100),
  life: new Float32Array(POOL).fill(1),
  next: 0,
  dirty: false,
};

const now = () => performance.now() / 1000;

export type SparkOptions = { spread?: number; speed?: number; life?: number };

export function emitSparks(
  n: number,
  origin: Vector3,
  opts: SparkOptions = {},
) {
  const { spread = 1, speed = 0.8, life = 0.9 } = opts;
  const t = now();
  for (let k = 0; k < n; k++) {
    const i = pool.next;
    pool.next = (pool.next + 1) % POOL;
    const a = Math.random() * Math.PI * 2;
    const b = Math.acos(Math.random() * 2 - 1);
    const v = speed * (0.4 + Math.random() * 0.6);
    pool.origin.set([origin.x, origin.y, origin.z], i * 3);
    pool.velocity.set(
      [
        Math.sin(b) * Math.cos(a) * v * spread,
        Math.sin(b) * Math.sin(a) * v * spread,
        Math.cos(b) * v * 0.3,
      ],
      i * 3,
    );
    pool.birth[i] = t;
    pool.life[i] = life * (0.7 + Math.random() * 0.6);
  }
  pool.dirty = true;
}

const vertex = /* glsl */ `
attribute vec3 aVelocity;
attribute float aBirth;
attribute float aLife;
uniform float uTime;
uniform float uPR;
varying float vAlpha;
void main() {
  float t = uTime - aBirth;
  float k = clamp(t / aLife, 0.0, 1.0);
  vAlpha = (t < 0.0 || t > aLife) ? 0.0 : 1.0 - k;
  vec3 p = position + aVelocity * t * (1.0 - 0.45 * k);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uPR * (10.0 / -mv.z) * (0.6 + 0.4 * vAlpha);
  gl_Position = projectionMatrix * mv;
}`;

const fragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  gl_FragColor = vec4(uColor * a, a);
}`;

export function Sparks() {
  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(pool.origin, 3));
    g.setAttribute('aVelocity', new BufferAttribute(pool.velocity, 3));
    g.setAttribute('aBirth', new BufferAttribute(pool.birth, 1));
    g.setAttribute('aLife', new BufferAttribute(pool.life, 1));
    return g;
  }, []);

  const material = useMemo(() => {
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    const c = root ? readTokenColors(root) : null;
    return new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: now() },
        uPR: { value: 1 },
        uColor: { value: c?.gold.night },
      },
    });
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  const materialRef = useRef(material);

  useFrame((state) => {
    const u = materialRef.current.uniforms;
    u.uTime.value = now();
    u.uPR.value = state.gl.getPixelRatio();
    if (!pool.dirty) return;
    pool.dirty = false;
    for (const name of ['position', 'aVelocity', 'aBirth', 'aLife'])
      geometry.getAttribute(name).needsUpdate = true;
  });

  return (
    <points geometry={geometry} material={material} frustumCulled={false} />
  );
}
