'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  DoubleSide,
  InstancedBufferAttribute,
  type InstancedMesh,
  MathUtils,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
} from 'three';

import { audio } from '../engine/audio-engine';
import { ndcToWorld } from '../engine/heart-path';
import { heart } from '../engine/heart-state';
import { TIERS, type Tier } from '../engine/tiers';
import { mulberry32 } from './heart-geometry';
import { readTokenColors } from './token-colors';

const origin = new Vector3();

// Experience §3.6 / §7: all motion on the GPU; the CPU only writes a few uniforms.
const vertex = /* glsl */ `
attribute vec4 aSeed;
attribute vec3 aColor;
uniform float uTime;
uniform float uRelease;
uniform vec3 uOrigin;
uniform vec2 uSpan;
uniform float uMobile;
varying vec3 vColor;
varying float vAlpha;
varying vec2 vUv;

mat3 rot(float a, float b) {
  float ca = cos(a), sa = sin(a), cb = cos(b), sb = sin(b);
  return mat3(cb, 0.0, -sb, 0.0, 1.0, 0.0, sb, 0.0, cb) *
         mat3(1.0, 0.0, 0.0, 0.0, ca, sa, 0.0, -sa, ca);
}

void main() {
  vec3 p = position;
  p.z += p.x * p.x * 2.5; // gently curved petal
  float t = uTime;
  float spawn = smoothstep(0.0, 1.0, clamp(uRelease * 1.25 - aSeed.w * 0.25, 0.0, 1.0));

  float fall = mod(aSeed.y * uSpan.y - t * (0.18 + aSeed.w * 0.12), uSpan.y);
  vec3 drift = vec3(
    (aSeed.x - 0.5) * uSpan.x + sin(t * 0.5 + aSeed.w * 6.28) * 0.35,
    fall - uSpan.y * 0.5,
    (aSeed.z - 0.5) * 3.0
  );
  // Fade at the loop seam so a wrapping petal never pops.
  float seam = smoothstep(0.0, 0.08, fall / uSpan.y) * smoothstep(1.0, 0.92, fall / uSpan.y);
  vec3 base = mix(uOrigin, drift, spawn);
  vec3 world = base + rot(t * (0.6 + aSeed.w) + aSeed.w * 6.28, t * 0.4 + aSeed.x * 6.28) * p;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
  vColor = aColor;
  // Romance Additions §9.2: dim petals behind the Bloom text (left third; lower third on phones).
  vec2 ndc = gl_Position.xy / gl_Position.w;
  float textZone = mix(smoothstep(-0.1, -0.3, ndc.x), smoothstep(-0.2, -0.45, ndc.y), uMobile);
  vAlpha = spawn * spawn * seam * mix(1.0, 0.4, textZone);
  vUv = uv;
}
`;

const fragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
varying vec2 vUv;
void main() {
  vec2 q = vUv - 0.5;
  float shape = 1.0 - smoothstep(0.35, 0.5, length(q * vec2(1.4, 1.0)));
  if (shape <= 0.0) discard;
  gl_FragColor = vec4(vColor, shape * vAlpha * 0.75);
}
`;

export function Petals({ tier }: { tier: Tier }) {
  const ref = useRef<InstancedMesh>(null);
  const count = TIERS[tier].petals;

  const geometry = useMemo(() => {
    const g = new PlaneGeometry(0.1, 0.15, 3, 3);
    const rand = mulberry32(23);
    const seeds = new Float32Array(count * 4).map(() => rand());
    g.setAttribute('aSeed', new InstancedBufferAttribute(seeds, 4));
    g.setAttribute(
      'aColor',
      new InstancedBufferAttribute(new Float32Array(count * 3), 3),
    );
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uRelease: { value: 0 },
          uOrigin: { value: new Vector3() },
          uSpan: { value: [8, 7] },
          uMobile: { value: 0 },
        },
      }),
    [],
  );
  const materialRef = useRef(material);
  const drift = useRef(1);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    const attr = ref.current?.geometry.getAttribute('aColor');
    if (!root || !attr) return;
    const c = readTokenColors(root);
    const palette = [c.secondary.night, c.primary.night, c.gold.night];
    for (let i = 0; i < count; i++) {
      const col = palette[i % palette.length];
      attr.setXYZ(i, col.r, col.g, col.b);
    }
    attr.needsUpdate = true;
  }, [count]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, delta) => {
    const mesh = ref.current;
    const u = materialRef.current.uniforms;
    if (!mesh) return;
    mesh.visible = heart.petalRelease > 0.001;
    if (!mesh.visible) return;
    // Integrate the audio-driven speed into the clock; scaling the clock itself made petals jump.
    drift.current = MathUtils.damp(
      drift.current,
      1 + audio.bands.mid * 0.3,
      2,
      delta,
    );
    u.uTime.value += delta * drift.current;
    u.uMobile.value = state.size.width < 768 ? 1 : 0;
    u.uRelease.value = heart.petalRelease;
    const vp = state.viewport.getCurrentViewport(
      state.camera,
      origin.set(0, 0, 0),
    );
    const w = ndcToWorld(heart.ndc, vp);
    u.uOrigin.value.set(w.x, w.y, 0);
    // Span only follows real resizes; tiny per-frame changes (mobile URL bar) shifted every petal.
    const [sw, sh] = u.uSpan.value as number[];
    if (
      Math.abs(sw - vp.width * 1.1) > 0.5 ||
      Math.abs(sh - vp.height * 1.3) > 0.5
    )
      u.uSpan.value = [vp.width * 1.1, vp.height * 1.3];
  });

  if (count === 0) return null;
  return (
    <instancedMesh
      key={count}
      ref={ref}
      args={[geometry, material, count]}
      frustumCulled={false}
      visible={false}
    />
  );
}
