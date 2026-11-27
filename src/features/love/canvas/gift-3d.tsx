'use client';

import {
  ContactShadows,
  Environment,
  Lightformer,
  PerspectiveCamera,
  RoundedBox,
  View,
} from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { type RefObject, useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BackSide,
  CanvasTexture,
  Color,
  DoubleSide,
  type Group,
  MeshPhysicalMaterial,
  type PointLight,
  SpriteMaterial,
  Vector2,
  Vector3,
} from 'three';

import { createRibbon, drapeBand, smooth, updateRibbon } from './gift-ribbon';
import { registerGiftStage } from './gift-stage';
import { sharedGiftMaps } from './gift-textures';
import { readTokenColors } from './token-colors';

type Props = {
  progress: RefObject<{ value: number }>;
  /** 0 → 1 drop-in as the row scrolls into view (already eased by GSAP). */
  intro: RefObject<{ value: number }>;
  sealed: boolean;
};

const W = 1.3;
const H = 0.95;
const LID_H = 0.24;
const LID_W = W + 0.1;
const WALL = 0.05;
const BAND = 0.16;
const TOP = H / 2 + LID_H - 0.04;
const LID_EDGE = LID_W / 2;
const LID_BOT = H / 2 - 0.04;
const FLOOR = -H / 2;

/** Lid-and-face drape for one band: [distance from centre, height]. */
const profile = (e: number) =>
  [
    [0, TOP + e],
    [0.22, TOP + e],
    [0.46, TOP + e],
    [LID_EDGE - 0.06, TOP + e],
    [LID_EDGE + e, TOP - 0.05],
    [LID_EDGE + e, LID_BOT + 0.05],
    [LID_EDGE + e, LID_BOT],
    [W / 2 + e, LID_BOT - 0.03],
    [W / 2 + e, 0.05],
    [W / 2 + e, FLOOR + 0.02],
  ] as const;

const BANDS = [
  { dir: [1, 0], e: 0.008 },
  { dir: [-1, 0], e: 0.008 },
  { dir: [0, 1], e: 0.004 },
  { dir: [0, -1], e: 0.004 },
] as const;

const LOOP: [number, number, number][] = [
  [0, 0, 0],
  [-0.1, 0.1, 0.03],
  [-0.27, 0.17, 0.02],
  [-0.35, 0.07, 0],
  [-0.22, 0.0, -0.01],
  [-0.03, 0.0, 0],
];
const TAIL: [number, number, number][] = [
  [0, -0.01, 0.03],
  [-0.06, -0.025, 0.13],
  [-0.12, -0.035, 0.25],
  [-0.19, -0.035, 0.37],
];

const easeOutBack = (t: number) => {
  const c = 1.4;
  return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2;
};

const v3 = ([x, y, z]: readonly number[]) => new Vector3(x, y, z);

function useGiftParts() {
  const parts = useMemo(() => {
    const root =
      document.querySelector<HTMLElement>('[data-love-root]') ??
      document.documentElement;
    const c = readTokenColors(root);
    const lav = c.primary.night ?? new Color('#b9a3e3');
    const ivory = c.foreground.night ?? new Color('#f6efe6');
    const goldC = c.gold.night ?? new Color('#d4ac63');
    const box = lav.clone().multiplyScalar(0.82);
    const lid = lav.clone().lerp(ivory, 0.25);
    const { grain, weave } = sharedGiftMaps();
    const paper = (color: Color, sheen: Color) =>
      new MeshPhysicalMaterial({
        color,
        roughness: 0.62,
        sheen: 0.8,
        sheenRoughness: 0.5,
        sheenColor: sheen,
        clearcoat: 0.18,
        clearcoatRoughness: 0.5,
        bumpMap: grain,
        bumpScale: 0.6,
      });
    const satinGold = new MeshPhysicalMaterial({
      color: goldC,
      metalness: 0.55,
      roughness: 0.3,
      sheen: 1,
      sheenRoughness: 0.25,
      sheenColor: goldC.clone().lerp(ivory, 0.5),
      anisotropy: 0.7,
      clearcoat: 0.3,
      clearcoatRoughness: 0.25,
      bumpMap: weave,
      bumpScale: 0.35,
      side: DoubleSide,
    });

    const bands = BANDS.map((b) => {
      const pts = profile(b.e).map(([r, y]) =>
        v3([b.dir[0] * r, y, b.dir[1] * r]),
      );
      return createRibbon(pts, new Vector3(-b.dir[1], 0, b.dir[0]), BAND, 48);
    });
    const knotY = TOP + 0.03;
    const loops = [1, -1].map((m) =>
      createRibbon(
        LOOP.map(([x, y, z]) => v3([x * -m, y + knotY, z])),
        new Vector3(0, 0, 1),
        0.13,
        32,
      ),
    );
    const tails = [1, -1].map((m) =>
      createRibbon(
        TAIL.map(([x, y, z]) => v3([x * -m, y + knotY, z])),
        new Vector3(0.86, 0, 0.5 * m),
        0.12,
        16,
      ),
    );

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, `#${goldC.getHexString()}`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    }
    const glowTex = new CanvasTexture(canvas);

    return {
      boxC: box,
      lidC: lid,
      grey: new Color('#5d5866'),
      body: paper(box.clone(), lid),
      cap: paper(lid.clone(), ivory),
      liner: new MeshPhysicalMaterial({
        color: lav.clone().multiplyScalar(0.4),
        roughness: 0.9,
        side: BackSide,
      }),
      gold: new MeshPhysicalMaterial({
        color: goldC,
        metalness: 0.9,
        roughness: 0.35,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
      }),
      satinGold,
      grain,
      weave,
      bands,
      loops,
      tails,
      glowTex,
      glow: new SpriteMaterial({
        map: glowTex,
        blending: AdditiveBlending,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
      knotY,
    };
  }, []);
  useEffect(
    () => () => {
      Object.values(parts).forEach((p) => {
        if (p === parts.grain || p === parts.weave) return;
        if (p && typeof p === 'object' && 'dispose' in p) p.dispose();
      });
      [...parts.bands, ...parts.loops, ...parts.tails].forEach((r) =>
        r.geometry.dispose(),
      );
    },
    [parts],
  );
  return parts;
}

const tmp = new Vector2();
const origin = new Vector2();

function Gift({ progress, intro, sealed }: Props) {
  const p = useGiftParts();
  const root = useRef<Group>(null);
  const lid = useRef<Group>(null);
  const bow = useRef<Group>(null);
  const lock = useRef<Group>(null);
  const light = useRef<PointLight>(null);
  const last = useRef(-1);

  const partsRef = useRef(p);
  useFrame(({ clock }, dt) => {
    const p = partsRef.current;
    const v = progress.current?.value ?? 0;
    const k = intro.current?.value ?? 1;
    const t = clock.elapsedTime;

    if (root.current) {
      const idle = sealed || v > 0 ? 0 : 1;
      root.current.rotation.y = -0.55 + Math.sin(t * 0.7) * 0.08 * idle;
      root.current.rotation.z = (1 - k) * 0.18;
      root.current.position.y =
        -0.45 + (1 - k) * 0.9 + Math.sin(t * 1.1) * 0.02 * idle;
    }
    if (bow.current) {
      // Settling wobble after the drop, then the knot slips through and is gone.
      bow.current.rotation.z = Math.sin(t * 11) * (1 - k) * 0.35;
      bow.current.scale.setScalar(Math.max(0.0001, 1 - smooth(0.26, 0.4, v)));
    }

    // Ribbon geometry only rebuilds while the untie progress moves.
    if (Math.abs(v - last.current) > 1e-4) {
      last.current = v;
      const pull = smooth(0, 0.18, v);
      const collapse = smooth(0.1, 0.32, v);
      const slide = smooth(0.14, 0.42, v);
      p.tails.forEach((r, i) => {
        const m = i === 0 ? 1 : -1;
        r.curve.points.forEach((pt, j) => {
          const [x, y, z] = TAIL[j];
          const s = 1 + pull * 0.6 * (j / 3);
          pt.set(x * -m * s, y + p.knotY - pull * 0.01 * j, z * s);
        });
        updateRibbon(r);
      });
      p.loops.forEach((r, i) => {
        const m = i === 0 ? 1 : -1;
        // Pulling the tail draws the loop back through the knot.
        const s = 1 - collapse * 0.94 - pull * 0.12;
        r.curve.points.forEach((pt, j) => {
          const [x, y, z] = LOOP[j];
          tmp.set(x * -m, y).rotateAround(origin, m * collapse * 0.5);
          pt.set(tmp.x * s, tmp.y * s + p.knotY, z * s);
        });
        updateRibbon(r);
      });
      p.bands.forEach((r, i) => {
        drapeBand(
          r.curve.points,
          profile(BANDS[i].e),
          BANDS[i].dir,
          slide,
          LID_EDGE,
          FLOOR,
        );
        updateRibbon(r);
      });
    }

    const open = smooth(0.42, 0.82, v);
    if (lid.current) {
      lid.current.rotation.x = -easeOutBack(open) * 1.75;
      lid.current.position.y = H / 2 + Math.sin(Math.PI * open) * 0.12;
    }
    const s = sealed ? 0.65 : 0;
    p.body.color.copy(p.boxC).lerp(p.grey, s);
    p.cap.color.copy(p.lidC).lerp(p.grey, s);
    if (lock.current) {
      const l = lock.current.scale.x;
      lock.current.scale.setScalar(
        l + ((sealed ? 1 : 0) - l) * Math.min(1, dt * 8),
      );
      lock.current.visible = lock.current.scale.x > 0.01;
    }
    const spill = smooth(0.6, 1, v);
    if (light.current) light.current.intensity = spill * 2;
    p.glow.opacity = spill * 0.35;
  });

  return (
    <group ref={root} position={[0, -0.45, 0]}>
      {/* Blueprint 085: an open-top box (floor + four walls) so an opened gift reads hollow. */}
      <RoundedBox
        args={[W, WALL, W]}
        radius={0.02}
        position={[0, -H / 2 + WALL / 2, 0]}
        material={p.body}
      />
      {[1, -1].map((s) => (
        <RoundedBox
          key={`z${s}`}
          args={[W, H, WALL]}
          radius={0.02}
          position={[0, 0, s * (W / 2 - WALL / 2)]}
          material={p.body}
        />
      ))}
      {[1, -1].map((s) => (
        <RoundedBox
          key={`x${s}`}
          args={[WALL, H, W - WALL * 2]}
          radius={0.02}
          position={[s * (W / 2 - WALL / 2), 0, 0]}
          material={p.body}
        />
      ))}
      <mesh material={p.liner} position={[0, WALL / 2, 0]}>
        <boxGeometry
          args={[W - WALL * 2 - 0.004, H - WALL, W - WALL * 2 - 0.004]}
        />
      </mesh>
      {/* One continuous satin band per side: over the lid, down the face; it slides off and spills. */}
      {p.bands.map((r) => (
        <mesh
          key={r.geometry.uuid}
          geometry={r.geometry}
          material={p.satinGold}
        />
      ))}
      <group ref={bow} position={[0, 0, 0]}>
        {[...p.loops, ...p.tails].map((r) => (
          <mesh
            key={r.geometry.uuid}
            geometry={r.geometry}
            material={p.satinGold}
          />
        ))}
        <RoundedBox
          args={[0.12, 0.07, 0.15]}
          radius={0.03}
          position={[0, p.knotY, 0.005]}
          material={p.satinGold}
        />
      </group>
      <pointLight
        ref={light}
        position={[0, 0, 0]}
        color={p.gold.color}
        intensity={0}
        distance={2.5}
      />
      <sprite material={p.glow} position={[0, H / 2 - 0.2, 0]} scale={0.9} />
      {/* Lid hinges on its back-top edge. */}
      <group ref={lid} position={[0, H / 2, -LID_W / 2]}>
        <group position={[0, LID_H / 2 - 0.04, LID_W / 2]}>
          <RoundedBox
            args={[LID_W, LID_H, LID_W]}
            radius={0.05}
            smoothness={4}
            material={p.cap}
          />
        </group>
      </group>
      <group ref={lock} position={[0, -0.05, W / 2 + 0.06]}>
        <mesh position={[0, 0.1, 0]} material={p.gold}>
          <torusGeometry args={[0.08, 0.018, 12, 24, Math.PI]} />
        </mesh>
        <RoundedBox args={[0.24, 0.19, 0.06]} radius={0.03} material={p.gold} />
      </group>
    </group>
  );
}

function StageBridge() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    registerGiftStage(invalidate);
    return () => registerGiftStage(null);
  }, [invalidate]);
  return null;
}

// Blueprint 085: one shared, on-demand Canvas for the whole gift row; each GiftBox draws into
// its own button through a drei View (one WebGL context instead of three).
export default function GiftCanvas({
  onLost,
  dpr = [1, 1.25],
}: {
  onLost?: () => void;
  dpr?: [number, number];
}) {
  return (
    <Canvas
      aria-hidden
      frameloop="demand"
      dpr={dpr}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', () => onLost?.(), {
          once: true,
        });
      }}
    >
      <StageBridge />
      <View.Port />
    </Canvas>
  );
}

export function GiftView({
  track,
  ...props
}: Props & { track: RefObject<HTMLElement | null> }) {
  return (
    <View track={track as RefObject<HTMLElement>}>
      <GiftScene {...props} />
    </View>
  );
}

function GiftScene(props: Props) {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 1.5, 4.8]}
        fov={30}
        onUpdate={(c) => c.lookAt(0, 0.1, 0)}
      />
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 3]} intensity={1.4} />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.6}
        color="#e9d3a4"
      />
      <Environment resolution={64} frames={1}>
        <Lightformer
          intensity={2.2}
          position={[0, 3, 2]}
          scale={[6, 2, 1]}
          color="#fff4e0"
        />
        <Lightformer
          intensity={1.2}
          position={[-4, 0, 1]}
          rotation-y={Math.PI / 2}
          scale={[4, 4, 1]}
          color="#cdb9ef"
        />
        <Lightformer
          intensity={1.6}
          position={[4, 1, -1]}
          rotation-y={-Math.PI / 2}
          scale={[3, 3, 1]}
          color="#e3c27e"
        />
        <Lightformer
          intensity={0.8}
          position={[0, -2, 3]}
          rotation-x={-Math.PI / 3}
          scale={[5, 1, 1]}
          color="#f6efe6"
        />
      </Environment>
      <Gift {...props} />
      <ContactShadows
        position={[0, -0.93, 0]}
        opacity={0.45}
        scale={3.2}
        blur={2.6}
        far={1.6}
        frames={1}
        color="#000000"
      />
    </>
  );
}
