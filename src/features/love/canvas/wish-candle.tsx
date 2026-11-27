'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  DoubleSide,
  type Group,
  InstancedMesh,
  type Material,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NormalBlending,
  Object3D,
  PlaneGeometry,
  type PointLight,
  ShaderMaterial,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from 'three';

import { candle } from '../engine/candle-state';
import { ndcToWorld, WISH_STAR_NDC } from '../engine/heart-path';
import { TIERS, type Tier } from '../engine/tiers';
import { flameFragment, quadVertex, smokeFragment } from './candle-shaders';
import { readTokenColors } from './token-colors';

// Cake layout (world units, relative to the flame's base at the wish-star point).
const LOWER = { y: -0.78, h: 0.24, r: 0.55 };
const UPPER = { y: -0.52, h: 0.2, r: 0.4 };
const STICK = { y: -0.3, h: 0.3, w: 0.05 };
// Blueprint 065: a slight downward look so the frosted tops read as a cake.
const TILT = 0.32;
const PEARL = 0.022;

/** An open frosting skirt whose lower edge hangs in uneven drips. */
function dripGeometry(r: number, h: number) {
  const geo = new CylinderGeometry(r, r, h, 48, 6, true);
  const pos = geo.attributes.position;
  const top = h / 2;
  for (let i = 0; i < pos.count; i++) {
    const a = Math.atan2(pos.getZ(i), pos.getX(i));
    const wave = 0.5 + 0.5 * Math.sin(a * 7) * Math.cos(a * 3);
    const f = 0.3 + 0.7 * wave * wave;
    pos.setY(i, top - (top - pos.getY(i)) * f);
  }
  geo.computeVertexNormals();
  return geo;
}

function pearlRing(r: number, y: number, material: Material) {
  const n = Math.round((2 * Math.PI * r) / (PEARL * 2.3));
  const mesh = new InstancedMesh(new SphereGeometry(PEARL, 10, 8), material, n);
  const d = new Object3D();
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    d.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    d.updateMatrix();
    mesh.setMatrixAt(i, d.matrix);
  }
  return mesh;
}

function helixGeometry() {
  const r = STICK.w / 2 + 0.004;
  const pts = Array.from({ length: 61 }, (_, i) => {
    const t = i / 60;
    const a = t * Math.PI * 2 * 3;
    return new Vector3(
      Math.cos(a) * r,
      -STICK.h / 2 + t * STICK.h,
      Math.sin(a) * r,
    );
  });
  return new TubeGeometry(new CatmullRomCurve3(pts), 120, 0.006, 6, false);
}

// Romance Additions F5 + blueprint 084: a lit lavender, ivory and gold cake with a candle, flame
// and smoke at the wish-star point. Mounted by love-canvas only while the Wish section is near.
export function WishCandle({ tier }: { tier: Tier }) {
  const group = useRef<Group>(null);
  const flameLight = useRef<PointLight>(null);
  const point = useMemo(() => new Vector3(), []);
  // Low tiers keep the flat cake (tinted planes).
  const solid = TIERS[tier].cakeParticles > 0;

  const parts = useMemo(() => {
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    const c = root ? readTokenColors(root) : null;
    const gold = c?.gold.night ?? new Color('#d4af37');
    const lav = c?.primary.night ?? new Color('#b9a3e3');
    const rose = c?.secondary.night ?? new Color('#e8a0b4');
    const ivory = c?.foreground.night ?? new Color('#fff');
    const cream = ivory.clone().lerp(gold, 0.08);
    const quad = new PlaneGeometry(1, 1);
    const flame = new ShaderMaterial({
      vertexShader: quadVertex,
      fragmentShader: flameFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uGold: { value: gold },
        uIvory: { value: ivory },
        uRose: { value: rose },
        uTime: { value: 0 },
        uBlow: { value: 0 },
        uOut: { value: 0 },
        uVisible: { value: 0 },
      },
    });
    const smoke = new ShaderMaterial({
      vertexShader: quadVertex,
      fragmentShader: smokeFragment,
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
      uniforms: {
        uColor: { value: ivory },
        uTime: { value: 0 },
        uOut: { value: 0 },
        uVisible: { value: 0 },
      },
    });
    const flat = (color: Color) =>
      new MeshBasicMaterial({ color, transparent: true, opacity: 0 });
    const sponge = new MeshPhysicalMaterial({
      color: lav.clone().multiplyScalar(0.85),
      roughness: 0.8,
      sheen: 1,
      sheenRoughness: 0.5,
      sheenColor: cream,
      transparent: true,
      opacity: 0,
    });
    const frost = new MeshPhysicalMaterial({
      color: cream,
      roughness: 0.35,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3,
      side: DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const goldMat = new MeshPhysicalMaterial({
      color: gold,
      metalness: 0.9,
      roughness: 0.3,
      transparent: true,
      opacity: 0,
    });
    const wax = new MeshPhysicalMaterial({
      color: ivory,
      roughness: 0.5,
      sheen: 0.6,
      sheenColor: gold,
      transparent: true,
      opacity: 0,
    });
    return {
      quad,
      flame,
      smoke,
      flatLower: flat(lav),
      flatUpper: flat(ivory),
      flatStick: flat(gold),
      sponge,
      frost,
      goldMat,
      wax,
      lowerGeo: new CylinderGeometry(LOWER.r, LOWER.r, LOWER.h, 48),
      upperGeo: new CylinderGeometry(UPPER.r, UPPER.r, UPPER.h, 48),
      lowerCap: new CylinderGeometry(LOWER.r + 0.01, LOWER.r + 0.01, 0.03, 48),
      upperCap: new CylinderGeometry(UPPER.r + 0.01, UPPER.r + 0.01, 0.03, 48),
      lowerDrip: dripGeometry(LOWER.r + 0.012, LOWER.h * 0.45),
      upperDrip: dripGeometry(UPPER.r + 0.012, UPPER.h * 0.45),
      board: new CylinderGeometry(LOWER.r + 0.08, LOWER.r + 0.1, 0.03, 48),
      stickGeo: new CylinderGeometry(STICK.w / 2, STICK.w / 2, STICK.h, 16),
      helix: helixGeometry(),
      lowerPearls: pearlRing(
        LOWER.r + 0.006,
        LOWER.y - LOWER.h / 2 + PEARL,
        goldMat,
      ),
      upperPearls: pearlRing(
        UPPER.r + 0.006,
        UPPER.y - UPPER.h / 2 + PEARL,
        goldMat,
      ),
    };
  }, []);

  useEffect(
    () => () =>
      Object.values(parts).forEach((p) => {
        if (p instanceof InstancedMesh) p.geometry.dispose();
        p.dispose();
      }),
    [parts],
  );

  const partsRef = useRef(parts);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.visible = candle.visible > 0.001;
    if (!g.visible) return;
    const p = partsRef.current;
    const v = candle.visible;
    const fu = p.flame.uniforms;
    fu.uTime.value += delta;
    fu.uBlow.value = candle.blow;
    fu.uOut.value = candle.out;
    fu.uVisible.value = v;
    const su = p.smoke.uniforms;
    su.uTime.value = fu.uTime.value;
    su.uOut.value = candle.out;
    su.uVisible.value = v;
    for (const m of [p.sponge, p.frost, p.goldMat, p.wax]) {
      m.opacity = v;
      m.depthWrite = v > 0.99;
    }
    if (flameLight.current)
      flameLight.current.intensity =
        v *
        (1 - candle.out) *
        (1 - 0.3 * candle.blow) *
        (2.2 + 0.1 * Math.sin(fu.uTime.value * 23));
    p.flatStick.opacity = v;
    p.flatLower.opacity = v * 0.55;
    p.flatUpper.opacity = v * 0.55;
    const vp = state.viewport.getCurrentViewport(
      state.camera,
      point.set(0, 0, 0),
    );
    const w = ndcToWorld(WISH_STAR_NDC, vp);
    // Blueprint 062: scale the cake to fit inside the medallion ring.
    // Blueprint 065: full height, cake base to flame tip (was negative, which mirrored the cake).
    const cakeH = 0.36 - (LOWER.y - LOWER.h / 2);
    const s = Math.min(1, (vp.height * 0.24) / cakeH);
    g.scale.setScalar(s);
    g.position.set(w.x, w.y + s * 0.25, 0.05);
  });

  const tierTop = (t: typeof LOWER) => t.y + t.h / 2;

  return (
    <group ref={group} visible={false}>
      {solid ? (
        <group rotation={[TILT, 0, 0]}>
          <pointLight
            ref={flameLight}
            position={[0, 0.1, 0.15]}
            color={parts.goldMat.color}
            intensity={0}
            distance={2.5}
          />
          <mesh
            geometry={parts.board}
            material={parts.goldMat}
            position={[0, LOWER.y - LOWER.h / 2 - 0.015, 0]}
          />
          {[
            [LOWER, parts.lowerGeo, parts.lowerCap, parts.lowerDrip],
            [UPPER, parts.upperGeo, parts.upperCap, parts.upperDrip],
          ].map(([t, body, cap, drip]) => {
            const tt = t as typeof LOWER;
            const dripH = tt.h * 0.45;
            return (
              <group key={tt.y}>
                <mesh
                  geometry={body as CylinderGeometry}
                  material={parts.sponge}
                  position={[0, tt.y, 0]}
                />
                <mesh
                  geometry={cap as CylinderGeometry}
                  material={parts.frost}
                  position={[0, tierTop(tt), 0]}
                />
                <mesh
                  geometry={drip as CylinderGeometry}
                  material={parts.frost}
                  position={[0, tierTop(tt) - dripH / 2, 0]}
                />
              </group>
            );
          })}
          <primitive object={parts.lowerPearls} />
          <primitive object={parts.upperPearls} />
          <group position={[0, STICK.y, 0]}>
            <mesh geometry={parts.stickGeo} material={parts.wax} />
            <mesh geometry={parts.helix} material={parts.goldMat} />
          </group>
        </group>
      ) : (
        <>
          <mesh
            geometry={parts.quad}
            material={parts.flatStick}
            position={[0, STICK.y, 0]}
            scale={[STICK.w, STICK.h, 1]}
          />
          <mesh
            geometry={parts.quad}
            material={parts.flatLower}
            position={[0, LOWER.y, 0]}
            scale={[LOWER.r * 2, LOWER.h, 1]}
          />
          <mesh
            geometry={parts.quad}
            material={parts.flatUpper}
            position={[0, UPPER.y, 0]}
            scale={[UPPER.r * 2, UPPER.h, 1]}
          />
        </>
      )}
      <mesh
        geometry={parts.quad}
        material={parts.smoke}
        position={[0, 0.45, -0.01]}
        scale={[0.4, 0.9, 1]}
        frustumCulled={false}
      />
      <mesh
        geometry={parts.quad}
        material={parts.flame}
        position={[0, 0.08, 0]}
        scale={[0.4, 0.55, 1]}
        frustumCulled={false}
      />
    </group>
  );
}
