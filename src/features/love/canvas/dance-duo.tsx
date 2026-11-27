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

import { damp, dance, DANCE_POSES, poseAt } from '../engine/dance-state';
import { TIERS, type Tier } from '../engine/tiers';
import manifest from './dance-manifest.json';
import { type DancePoints, loadDancePoints } from './dance-points';
import { danceFragment, danceVertex } from './dance-shaders';
import { mulberry32 } from './heart-geometry';
import { readTokenColors } from './token-colors';

const COUNT = manifest.count;
const centre = new Vector3();
const CAMERA_DISTANCE = 6;
const TWIRL = DANCE_POSES.findIndex((p) => p.beat === 'twirl');

// Her centre line per pose (mean x of her particles), for the turn during the twirl.
const herCentres = (pts: DancePoints) =>
  pts.positions.map((pos, k) => {
    let sum = 0;
    let n = 0;
    for (let i = 0; i < pts.count; i++)
      if (!pts.flags[k][i * 2 + 1]) {
        sum += pos[i * 2];
        n++;
      }
    return n ? sum / n : 0;
  });

// Experience §19.6: the dancing couple as one glowing particle cloud, built like the heart.
// Blueprint 088: the couple is traced from the reference stills; scroll morphs pose to pose.
export function DanceDuo({ tier }: { tier: Tier }) {
  const points = useRef<Points>(null);
  const shown = useRef(-1);
  const segment = useRef(-1);
  const loaded = useRef<{ data: DancePoints; centres: number[] } | null>(null);

  useEffect(() => {
    let live = true;
    loadDancePoints(manifest)
      .then((d) => {
        if (live) loaded.current = { data: d, centres: herCentres(d) };
      })
      .catch((e: unknown) => {
        if (process.env.NODE_ENV !== 'production') console.warn(e);
      });
    return () => {
      live = false;
    };
  }, []);

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const attr = (name: string, size: number) =>
      g.setAttribute(
        name,
        new BufferAttribute(new Float32Array(COUNT * size), size),
      );
    attr('position', 3);
    attr('aFrom', 2);
    attr('aTo', 2);
    attr('aColFrom', 3);
    attr('aColTo', 3);
    attr('aFlagFrom', 2);
    attr('aFlagTo', 2);
    const rand = mulberry32(5);
    const r = new Float32Array(COUNT * 4).map(() => rand());
    g.setAttribute('aRand', new BufferAttribute(r, 4));
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
        uK: { value: 0 },
        uSwirl: { value: 0 },
        uHerX: { value: 0 },
        uTime: { value: 0 },
        uPR: { value: 1 },
        uGlow: { value: 0.7 },
        uVisible: { value: 0 },
        uColorLav: { value: c?.primary.night },
        uColorGold: { value: c?.gold.night },
      },
    });
  }, []);

  useEffect(() => {
    geometry.setDrawRange(0, Math.min(COUNT, TIERS[tier].danceParticles));
  }, [geometry, tier]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  const materialRef = useRef(material);
  const swayRef = useRef(1);
  useEffect(() => {
    swayRef.current = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches
      ? 0
      : 1;
  }, []);

  useFrame((state, delta) => {
    const p = points.current;
    const u = materialRef.current?.uniforms;
    const l = loaded.current;
    if (!p || !u || !l) return;
    const { data, centres } = l;
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
    p.scale.set(s, s, s);
    p.position.set(0, -vp.height * 0.47, z);
    u.uTime.value += delta * swayRef.current;
    u.uPR.value = state.gl.getPixelRatio();
    u.uVisible.value = dance.visible;

    shown.current =
      shown.current < 0
        ? dance.t
        : damp(shown.current, dance.t, Math.min(delta, 0.1));
    const last = data.positions.length - 1;
    const { index: raw, k } = poseAt(shown.current);
    const index = Math.min(raw, last - 1);
    if (index !== segment.current) {
      segment.current = index;
      const set = (name: string, values: Float32Array) => {
        const a = geometry.getAttribute(name) as BufferAttribute;
        (a.array as Float32Array).set(values);
        a.needsUpdate = true;
      };
      set('aFrom', data.positions[index]);
      set('aTo', data.positions[index + 1]);
      set('aColFrom', data.colors[index]);
      set('aColTo', data.colors[index + 1]);
      set('aFlagFrom', data.flags[index]);
      set('aFlagTo', data.flags[index + 1]);
    }
    u.uK.value = k;
    u.uSwirl.value = index === TWIRL ? Math.PI * 2 * k : 0;
    u.uHerX.value = centres[index] + (centres[index + 1] - centres[index]) * k;
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
