'use client';

import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  DoubleSide,
  InstancedBufferAttribute,
  type InstancedMesh,
  MathUtils,
  type PerspectiveCamera,
  PlaneGeometry,
  ShaderMaterial,
} from 'three';

import { audio } from '../engine/audio-engine';
import { heart } from '../engine/heart-state';
import { TIERS, type Tier } from '../engine/tiers';
import { mulberry32 } from './heart-geometry';
import { readTokenColors } from './token-colors';

// Blueprint 061: petals live in camera space, so scroll (camera dolly, heart moves) never moves them.
const DEPTH = 4;

// Experience §3.6 / §7: all motion on the GPU; the CPU only writes a few uniforms.
const vertex = /* glsl */ `
attribute vec4 aSeed;
attribute vec3 aColor;
uniform float uTime;
uniform float uRelease;
uniform vec2 uSpan;
uniform float uMobile;
uniform vec2 uOrigin;
uniform float uGather;
uniform float uShiver;
uniform float uDim;
uniform float uAbsorb;
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
  p.z += p.x * p.x * 2.5;
  float t = uTime;
  float d = aSeed.w * 0.5;
  float grow = smoothstep(d, d + 0.5, uRelease);

  // Blueprint 062: gather shrinks petals toward the heart.
  // Every petal reaches the heart at full gather (staggered by seed), then dissolves into it.
  float g = smoothstep(0.0, 1.0, clamp(uGather * 1.3 - aSeed.w * 0.3, 0.0, 1.0));
  grow = max(grow, step(0.001, uRelease) * (1.0 - g));
  p *= mix(mix(0.3, 1.0, grow), 0.15, g);

  float fall = mod(aSeed.y * uSpan.y - t * (0.18 + aSeed.w * 0.12), uSpan.y);
  vec3 base = vec3(
    (aSeed.x - 0.5) * uSpan.x + sin(t * 0.5 + aSeed.w * 6.28) * 0.35,
    fall - uSpan.y * 0.5,
    (aSeed.z - 0.5) * 2.0
  );
  // Blueprint 062: pull toward the heart origin when gathered.
  vec3 core = vec3(uOrigin + (aSeed.xy - 0.5) * 0.12, 0.0);
  base = mix(base, core, g);
  // Spray outward while leaving (or entering) the heart, so petals read as shot from it.
  base.xy += normalize(base.xy - core.xy + vec2(1e-4)) * sin(g * 3.1416) * 0.8;
  // Blueprint 062: shiver during the arrow flight.
  base.xy += uShiver * 0.04 * vec2(sin(t * 55.0 + aSeed.x * 40.0), cos(t * 61.0 + aSeed.y * 40.0));
  // Memories: petals fly out of the screen toward the viewer (like the orbs), staggered by seed.
  float a = smoothstep(0.0, 1.0, clamp(uAbsorb * 2.0 - aSeed.z, 0.0, 1.0));
  vec3 outward = vec3(base.xy * 1.2 + vec2(0.0, -0.4), 3.7);
  base = mix(base, outward, a);

  float seam = smoothstep(0.0, 0.08, fall / uSpan.y) * smoothstep(1.0, 0.92, fall / uSpan.y);
  seam = mix(seam, 1.0, g);
  vec3 local = base + rot(t * (0.6 + aSeed.w) + aSeed.w * 6.28, t * 0.4 + aSeed.x * 6.28) * p;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(local, 1.0);
  vColor = aColor;
  vec2 ndc = gl_Position.xy / gl_Position.w;
  float textZone = mix(smoothstep(-0.1, -0.3, ndc.x), smoothstep(-0.2, -0.45, ndc.y), uMobile);
  vAlpha = grow * grow * seam * mix(1.0, 0.4, textZone) * (1.0 - uDim)
    * (1.0 - smoothstep(0.75, 1.0, g)) * (1.0 - smoothstep(0.7, 1.0, a));
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
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);
  const size = useThree((s) => s.size);

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
          uSpan: { value: [8, 7] },
          uMobile: { value: 0 },
          uOrigin: { value: [0, 0] },
          uGather: { value: 0 },
          uShiver: { value: 0 },
          uDim: { value: 0 },
          uAbsorb: { value: 0 },
        },
      }),
    [],
  );
  const materialRef = useRef(material);
  const drift = useRef(1);
  const span = useRef<[number, number]>([8, 7]);
  const origin = useRef<[number, number]>([0, 0]);

  // A camera child renders only while the camera is in the scene graph.
  useEffect(() => {
    if (camera.parent) return;
    scene.add(camera);
    return () => {
      scene.remove(camera);
    };
  }, [camera, scene]);

  // Span follows real resizes only (frustum at DEPTH, independent of the camera dolly).
  useEffect(() => {
    const fov = (camera as PerspectiveCamera).fov ?? 50;
    const h = 2 * DEPTH * Math.tan(MathUtils.degToRad(fov) / 2);
    const w = h * (size.width / Math.max(1, size.height));
    span.current = [w * 1.1, h * 1.3];
    const u = materialRef.current.uniforms;
    u.uSpan.value = span.current;
    u.uMobile.value = size.width < 768 ? 1 : 0;
  }, [camera, size.width, size.height]);

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

  useFrame((_, delta) => {
    const mesh = ref.current;
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
    const u = materialRef.current.uniforms;
    u.uTime.value += delta * drift.current;
    u.uRelease.value = heart.petalRelease;
    // Blueprint 062: damp the origin so gathered petals track the heart smoothly.
    const s = span.current;
    const tx = (heart.ndc.x * s[0]) / 1.1 / 2;
    const ty = (heart.ndc.y * s[1]) / 1.3 / 2;
    origin.current[0] = MathUtils.damp(origin.current[0], tx, 8, delta);
    origin.current[1] = MathUtils.damp(origin.current[1], ty, 8, delta);
    u.uOrigin.value = origin.current;
    u.uGather.value = heart.petalGather;
    u.uShiver.value = heart.petalShiver;
    u.uDim.value = heart.petalDim;
    u.uAbsorb.value = heart.petalAbsorb;
  });

  if (count === 0) return null;
  return createPortal(
    <instancedMesh
      key={count}
      ref={ref}
      args={[geometry, material, count]}
      position={[0, 0, -DEPTH]}
      frustumCulled={false}
      visible={false}
    />,
    camera,
  );
}
