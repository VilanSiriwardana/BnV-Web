'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  BackSide,
  Color,
  ExtrudeGeometry,
  type Group,
  type Material,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  ShaderMaterial,
} from 'three';

import { heart } from '../engine/heart-state';
import type { Tier } from '../engine/tiers';
import { heartShape } from './mini-hearts';
import { readTokenColors } from './token-colors';

const rimVertex = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;
const rimFragment = /* glsl */ `
uniform vec3 uGold;
uniform float uOpacity;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  float f = pow(1.0 - abs(dot(vNormal, vView)), 2.5);
  gl_FragColor = vec4(uGold, f * uOpacity);
}
`;
const shadowFragment = /* glsl */ `
uniform float uOpacity;
uniform vec3 uTint;
varying vec2 vUv;
void main() {
  float d = length((vUv - 0.5) * vec2(1.0, 2.6));
  gl_FragColor = vec4(uTint, smoothstep(0.5, 0.0, d) * 0.22 * uOpacity);
}
`;
const uvVertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

// Experience §3.3 Pearl skin: satin extruded heart, gold fresnel rim, fake contact shadow.
// Lives inside the Heart group, so it shares position, scale and rotation with the particles.
export function HeartPearl({ tier }: { tier: Tier }) {
  const group = useRef<Group>(null);

  const parts = useMemo(() => {
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    const c = root ? readTokenColors(root) : null;
    const body = (c?.primary.day ?? new Color()).clone();
    if (c) body.lerp(c.background.day, 0.45);
    const gold = c?.gold.day ?? new Color();

    const geometry = new ExtrudeGeometry(heartShape(64), {
      depth: 0.18,
      bevelEnabled: true,
      bevelSize: 0.04,
      bevelThickness: 0.04,
      bevelSegments: 3,
      curveSegments: 8,
    });
    geometry.center();

    // Phase 5 §11: MeshPhysicalMaterial only on high; cheaper standard material elsewhere.
    const surface: MeshPhysicalMaterial | MeshStandardMaterial =
      tier === 'high'
        ? new MeshPhysicalMaterial({
            color: body,
            roughness: 0.35,
            clearcoat: 0.6,
            clearcoatRoughness: 0.3,
            sheen: 1,
            sheenColor: gold,
            transparent: true,
            opacity: 0,
          })
        : new MeshStandardMaterial({
            color: body,
            roughness: 0.4,
            metalness: 0.05,
            transparent: true,
            opacity: 0,
          });

    const rim = new ShaderMaterial({
      vertexShader: rimVertex,
      fragmentShader: rimFragment,
      transparent: true,
      depthWrite: false,
      side: BackSide,
      uniforms: { uGold: { value: gold }, uOpacity: { value: 0 } },
    });
    const shadow = new ShaderMaterial({
      vertexShader: uvVertex,
      fragmentShader: shadowFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uOpacity: { value: 0 },
        uTint: { value: c?.foreground.day ?? new Color() },
      },
    });
    return {
      geometry,
      plane: new PlaneGeometry(2.2, 0.8),
      surface,
      rim,
      shadow,
    };
  }, [tier]);

  useEffect(
    () => () => {
      parts.geometry.dispose();
      parts.plane.dispose();
      [parts.surface, parts.rim, parts.shadow].forEach((m: Material) =>
        m.dispose(),
      );
    },
    [parts],
  );

  const partsRef = useRef(parts);
  useEffect(() => {
    partsRef.current = parts;
  }, [parts]);
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const s = heart.skin;
    g.visible = s > 0.001;
    if (!g.visible) return;
    const p = partsRef.current;
    p.surface.opacity = s;
    p.rim.uniforms.uOpacity.value = s * (0.8 + heart.pearlRim * 0.6);
    p.shadow.uniforms.uOpacity.value = s * (1 - heart.burst);
    // Dissolves with the particles during a burst.
    g.scale.setScalar(1 - heart.burst * 0.9);
  });

  return (
    <group ref={group} visible={false}>
      <mesh geometry={parts.geometry} material={parts.surface} />
      <mesh geometry={parts.geometry} material={parts.rim} scale={1.03} />
      <mesh
        geometry={parts.plane}
        material={parts.shadow}
        position={[0, -1.15, -0.2]}
      />
    </group>
  );
}
