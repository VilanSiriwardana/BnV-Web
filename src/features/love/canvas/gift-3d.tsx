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
  CatmullRomCurve3,
  Color,
  type Group,
  MeshPhysicalMaterial,
  type PointLight,
  SpriteMaterial,
  TubeGeometry,
  Vector3,
} from 'three';

import { registerGiftStage } from './gift-stage';
import { readTokenColors } from './token-colors';

type Props = {
  progress: RefObject<{ value: number }>;
  sealed: boolean;
};

const W = 1.3;
const H = 0.95;
const LID_H = 0.24;
const LID_W = W + 0.1;
const WALL = 0.05;
const BAND = 0.18;
const HALF = (LID_W + 0.02) / 2;
/** Lid half-bands: direction in the lid plane and the hinge axis they tip around. */
const BANDS = [
  { dir: [1, 0], rot: 0 },
  { dir: [-1, 0], rot: Math.PI },
  { dir: [0, 1], rot: -Math.PI / 2 },
  { dir: [0, -1], rot: Math.PI / 2 },
] as const;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const curve = (pts: [number, number, number][]) =>
  new CatmullRomCurve3(pts.map((p) => new Vector3(...p)));

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
    const satin = (color: Color, sheen: Color) =>
      new MeshPhysicalMaterial({
        color,
        roughness: 0.55,
        sheen: 1,
        sheenRoughness: 0.4,
        sheenColor: sheen,
        clearcoat: 0.25,
        clearcoatRoughness: 0.4,
      });
    const gold = (fade = false) =>
      new MeshPhysicalMaterial({
        color: goldC,
        metalness: 0.9,
        roughness: 0.35,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
        transparent: fade,
      });
    const loopL = curve([
      [0, 0, 0],
      [-0.12, 0.14, 0.02],
      [-0.32, 0.2, 0],
      [-0.38, 0.07, -0.02],
      [-0.18, 0.02, 0],
      [0, 0, 0],
    ]);
    const loopR = curve(loopL.points.map((p) => [-p.x, p.y, p.z]));
    const tailL = curve([
      [0, 0, 0.02],
      [-0.08, -0.03, 0.14],
      [-0.16, -0.05, 0.3],
      [-0.22, -0.06, 0.42],
    ]);
    const tailR = curve(tailL.points.map((p) => [-p.x, p.y, p.z]));
    const tube = (cv: CatmullRomCurve3, closed = false) =>
      new TubeGeometry(cv, 48, 0.035, 8, closed);

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
      body: satin(box.clone(), lid),
      cap: satin(lid.clone(), ivory),
      liner: new MeshPhysicalMaterial({
        color: lav.clone().multiplyScalar(0.4),
        roughness: 0.9,
        side: BackSide,
      }),
      gold: gold(),
      bowGold: gold(true),
      bandGold: gold(true),
      loopL: tube(loopL),
      loopR: tube(loopR),
      tailL: tube(tailL),
      tailR: tube(tailR),
      glowTex,
      glow: new SpriteMaterial({
        map: glowTex,
        blending: AdditiveBlending,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    };
  }, []);
  useEffect(
    () => () =>
      Object.values(parts).forEach((p) => {
        if ('dispose' in p) p.dispose();
      }),
    [parts],
  );
  return parts;
}

function Gift({ progress, sealed }: Props) {
  const p = useGiftParts();
  const root = useRef<Group>(null);
  const lid = useRef<Group>(null);
  const bow = useRef<Group>(null);
  const loops = useRef<(Group | null)[]>([]);
  const tails = useRef<(Group | null)[]>([]);
  const bands = useRef<(Group | null)[]>([]);
  const lock = useRef<Group>(null);
  const light = useRef<PointLight>(null);

  const partsRef = useRef(p);
  useFrame(({ clock }, dt) => {
    const p = partsRef.current;
    const v = progress.current?.value ?? 0;
    const pull = smooth(0, 0.18, v);
    const shrink = smooth(0.08, 0.32, v);
    const lift = smooth(0.28, 0.42, v);
    const slide = smooth(0.18, 0.42, v);
    const open = smooth(0.42, 0.8, v);
    const spill = smooth(0.6, 1, v);
    const t = clock.elapsedTime;

    if (root.current) {
      root.current.rotation.y = -0.55 + (sealed ? 0 : Math.sin(t * 0.7) * 0.08);
      root.current.position.y = -0.45 + (sealed ? 0 : Math.sin(t * 1.1) * 0.02);
    }
    tails.current.forEach((g, i) => {
      if (!g) return;
      const side = i === 0 ? 1 : -1;
      g.rotation.y = side * pull * 0.5;
      g.rotation.z = side * pull * 0.25;
    });
    loops.current.forEach((g) => g?.scale.setScalar(1 - shrink * 0.75));
    if (bow.current) bow.current.position.y = LID_H / 2 + lift * 0.15;
    p.bowGold.opacity = 1 - lift;
    bands.current.forEach((g, i) => {
      if (!g) return;
      const [dx, dz] = BANDS[i].dir;
      const out = slide * 0.35;
      g.position.set(dx * out, -0.5 * slide * slide, dz * out);
      g.children[0].rotation.z = -slide * 0.6;
    });
    p.bandGold.opacity = 1 - smooth(0.3, 0.42, v);
    if (lid.current) {
      lid.current.rotation.x = -open * 0.45;
      lid.current.position.y = H / 2 + open * 0.25;
    }
    const s = sealed ? 0.65 : 0;
    p.body.color.copy(p.boxC).lerp(p.grey, s);
    p.cap.color.copy(p.lidC).lerp(p.grey, s);
    if (lock.current) {
      const k = lock.current.scale.x;
      lock.current.scale.setScalar(
        k + ((sealed ? 1 : 0) - k) * Math.min(1, dt * 8),
      );
      lock.current.visible = lock.current.scale.x > 0.01;
    }
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
      {[1, -1].map((s) => (
        <mesh
          key={`bz${s}`}
          material={p.gold}
          position={[0, 0, s * (W / 2 + 0.006)]}
        >
          <boxGeometry args={[BAND, H, 0.012]} />
        </mesh>
      ))}
      {[1, -1].map((s) => (
        <mesh
          key={`bx${s}`}
          material={p.gold}
          position={[s * (W / 2 + 0.006), 0, 0]}
        >
          <boxGeometry args={[0.012, H, BAND]} />
        </mesh>
      ))}
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
        <group>
          <group position={[0, LID_H / 2 - 0.04, LID_W / 2]}>
            <RoundedBox
              args={[LID_W, LID_H, LID_W]}
              radius={0.05}
              smoothness={4}
              material={p.cap}
            />
            {BANDS.map((b, i) => (
              <group
                key={b.rot}
                ref={(g) => {
                  bands.current[i] = g;
                }}
              >
                <group rotation-y={b.rot}>
                  <mesh position={[HALF / 2, 0, 0]} material={p.bandGold}>
                    <boxGeometry args={[HALF, LID_H + 0.02, BAND]} />
                  </mesh>
                </group>
              </group>
            ))}
            <group ref={bow} position={[0, LID_H / 2, 0]}>
              {[p.tailL, p.tailR].map((geo, i) => (
                <group
                  key={geo.uuid}
                  ref={(g) => {
                    tails.current[i] = g;
                  }}
                >
                  <mesh
                    geometry={geo}
                    material={p.bowGold}
                    scale={[1, 0.5, 1]}
                  />
                </group>
              ))}
              {[p.loopL, p.loopR].map((geo, i) => (
                <group
                  key={geo.uuid}
                  ref={(g) => {
                    loops.current[i] = g;
                  }}
                >
                  <mesh
                    geometry={geo}
                    material={p.bowGold}
                    scale={[1, 1, 0.4]}
                  />
                </group>
              ))}
              <mesh
                material={p.bowGold}
                scale={[1, 0.8, 0.8]}
                position={[0, 0.02, 0]}
              >
                <sphereGeometry args={[0.06, 24, 16]} />
              </mesh>
            </group>
          </group>
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
export default function GiftCanvas({ onLost }: { onLost?: () => void }) {
  return (
    <Canvas
      aria-hidden
      frameloop="demand"
      dpr={[1, 1.25]}
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
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 3]} intensity={1.4} />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.6}
        color="#e9d3a4"
      />
      <Environment resolution={64} frames={1}>
        <Lightformer
          intensity={2}
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
          intensity={1.4}
          position={[4, 1, -1]}
          rotation-y={-Math.PI / 2}
          scale={[3, 3, 1]}
          color="#e3c27e"
        />
      </Environment>
      <Gift {...props} />
      <ContactShadows
        position={[0, -0.93, 0]}
        opacity={0.45}
        scale={2.6}
        blur={2.6}
        far={1.6}
        frames={1}
        color="#000000"
      />
    </>
  );
}
