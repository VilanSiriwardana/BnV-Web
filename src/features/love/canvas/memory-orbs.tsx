'use client';

import { Billboard, useTexture } from '@react-three/drei';
import { type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  type Group,
  MathUtils,
  ShaderMaterial,
  SRGBColorSpace,
  type Texture,
  Vector3,
} from 'three';

import type { LoveSiteConfig } from '../config';
import { isMobileViewport } from '../engine/heart-path';
import { heart } from '../engine/heart-state';
import { memoriesState, requestOpenMemory } from '../engine/memories-state';
import { orbPosition } from '../engine/memory-layout';
import { TIERS, type Tier } from '../engine/tiers';
import {
  photoFragment,
  photoVertex,
  shellFragment,
  shellVertex,
} from './orb-shaders';
import { projectRadius, projectToScreen } from './projection';
import { readTokenColors } from './token-colors';
import { CURSOR_POINTER } from '../ui/cursor-svgs';

const SHELL_R = 0.8;
const HIT_R = 1.1; // larger than the shell: ≥ 44 px projected whenever an orb is near
const UPDATE_RANGE = 14;
const LEAN_MAX = 0.15;
const { damp } = MathUtils;
const world = new Vector3();

type Memory = LoveSiteConfig['memories'][number];
type Props = { tier: Tier; memories: Memory[] };

export function MemoryOrbs({ tier, memories }: Props) {
  const items = memories.slice(0, TIERS[tier].orbs);
  const textures = useTexture(items.map((m) => m.orb ?? m.photo.src));
  return <Orbs items={items} textures={textures} />;
}

function Orbs({ items, textures }: { items: Memory[]; textures: Texture[] }) {
  const { camera, size } = useThree();
  const groups = useRef<(Group | null)[]>([]);
  const hover = useRef<number[]>([]);
  const fade = useRef(0);
  const mobile = isMobileViewport();

  const materials = useMemo(() => {
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    const c = root ? readTokenColors(root) : null;
    return textures.map((map) => ({
      shell: new ShaderMaterial({
        vertexShader: shellVertex,
        fragmentShader: shellFragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uColorLav: { value: c?.primary.night },
          uColorGold: { value: c?.gold.night },
          uHover: { value: 0 },
          uEmissive: { value: 1 },
          uFade: { value: 0 },
        },
      }),
      photo: new ShaderMaterial({
        vertexShader: photoVertex,
        fragmentShader: photoFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uMap: { value: map },
          uSaturation: { value: 0 },
          uFade: { value: 0 },
        },
      }),
    }));
  }, [textures]);

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = SRGBColorSpace;
      t.needsUpdate = true;
    });
  }, [textures]);

  useEffect(
    () => () => {
      materials.forEach((m) => {
        m.shell.dispose();
        m.photo.dispose();
      });
      textures.forEach((t) => t.dispose());
      memoriesState.hovered = -1;
      memoriesState.screen = [];
      heart.lean.x = 0;
      heart.lean.y = 0;
      document.body.style.cursor = '';
    },
    [materials, textures],
  );

  useFrame((_, delta) => {
    fade.current = damp(fade.current, memoriesState.active ? 1 : 0, 6, delta);
    const target =
      memoriesState.hovered >= 0
        ? memoriesState.hovered
        : memoriesState.focused;
    let leanX = 0;
    let leanY = 0;

    items.forEach((_, i) => {
      const g = groups.current[i];
      const m = materials[i];
      if (!g || !m) return;
      const base = orbPosition(i, mobile);
      g.visible = fade.current > 0.01 && base.z < camera.position.z - 0.5;
      if (!g.visible || Math.abs(base.z - camera.position.z) > UPDATE_RANGE) {
        memoriesState.screen[i] = { x: 0, y: 0, r: 0, visible: false };
        return;
      }
      const h = damp(hover.current[i] ?? 0, target === i ? 1 : 0, 12, delta);
      hover.current[i] = h;
      g.position.set(base.x, base.y, base.z + h * 0.4);
      g.scale.setScalar(1 + h * 0.1);
      m.shell.uniforms.uHover.value = h;
      m.shell.uniforms.uEmissive.value = 1 + heart.beat * 0.05;
      m.shell.uniforms.uFade.value = fade.current;
      m.photo.uniforms.uSaturation.value = h;
      m.photo.uniforms.uFade.value = fade.current;

      g.getWorldPosition(world);
      const s = projectToScreen(world, camera, size);
      const r = projectRadius(world, SHELL_R * g.scale.x, camera, size);
      memoriesState.screen[i] = { x: s.x, y: s.y, r, visible: s.visible };
      if (target === i) {
        const dx = s.ndc.x - heart.ndc.x;
        const dy = s.ndc.y - heart.ndc.y;
        const len = Math.hypot(dx, dy) || 1;
        const k = Math.min(LEAN_MAX, len) / len;
        leanX = dx * k;
        leanY = dy * k;
      }
    });

    heart.lean.x = damp(heart.lean.x, leanX, 6, delta);
    heart.lean.y = damp(heart.lean.y, leanY, 6, delta);
  });

  const over = (i: number) => (e: ThreeEvent<PointerEvent>) => {
    if (!memoriesState.active || e.pointerType !== 'mouse') return;
    e.stopPropagation();
    memoriesState.hovered = i;
    document.body.style.cursor = CURSOR_POINTER;
  };
  const out = (i: number) => () => {
    if (memoriesState.hovered === i) memoriesState.hovered = -1;
    document.body.style.cursor = '';
  };
  const click = (i: number) => (e: ThreeEvent<MouseEvent>) => {
    if (!memoriesState.active || !groups.current[i]?.visible) return;
    e.stopPropagation();
    requestOpenMemory(i);
  };

  return (
    <>
      {items.map((m, i) => (
        <group
          key={m.id}
          ref={(el) => {
            groups.current[i] = el;
          }}
          visible={false}
        >
          <mesh material={materials[i].shell} renderOrder={2}>
            <sphereGeometry args={[SHELL_R, 32, 24]} />
          </mesh>
          <Billboard>
            <mesh material={materials[i].photo} renderOrder={1}>
              <planeGeometry args={[SHELL_R * 1.5, SHELL_R * 1.5]} />
            </mesh>
          </Billboard>
          <mesh
            onPointerOver={over(i)}
            onPointerOut={out(i)}
            onClick={click(i)}
          >
            <sphereGeometry args={[HIT_R, 12, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}
