'use client';

import { PerformanceMonitor, Stats } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Suspense } from 'react';

import type { LoveSiteConfig } from '../config';
import { TIERS, type Tier } from '../engine/tiers';
import { Arrow } from './arrow';
import { Confetti } from './confetti';
import { Heart } from './heart';
import { MemoryOrbs } from './memory-orbs';
import { MiniHearts } from './mini-hearts';
import { Petals } from './petals';
import { ShockRing } from './shock-ring';
import { Sparks } from './sparks';
import { WishStar } from './wish-star';
import { renderStats } from '../engine/render-stats';

type Props = {
  tier: Tier;
  memories: LoveSiteConfig['memories'];
  onDecline: () => void;
  onIncline: () => void;
  debug?: boolean;
  onHeartTap?: () => void;
  onReady?: () => void;
};

export default function LoveCanvas({
  tier,
  memories,
  onDecline,
  onIncline,
  debug,
  onHeartTap,
  onReady,
}: Props) {
  const config = TIERS[tier];
  return (
    <Canvas
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        width: '100%',
        height: '100lvh',
        touchAction: 'pan-y',
      }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      dpr={[1, config.dpr]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      onCreated={onReady}
    >
      {/* Step down on decline; step up only after a long stable run (flipflops ends adaptation). */}
      <PerformanceMonitor
        onDecline={onDecline}
        onIncline={onIncline}
        flipflops={3}
      />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1} />
      <Heart tier={tier} onTap={onHeartTap}>
        <MiniHearts tier={tier} />
      </Heart>
      <Petals tier={tier} />
      <Suspense fallback={null}>
        <MemoryOrbs tier={tier} memories={memories} />
      </Suspense>
      <ShockRing />
      <Sparks />
      <Arrow />
      <WishStar />
      <Confetti tier={tier} />
      {config.bloom !== 'off' && (
        <EffectComposer multisampling={0}>
          <NightBloom base={config.bloom === 'on' ? 0.9 : 0.5} />
        </EffectComposer>
      )}
      {debug && <Stats />}
      {debug && <RenderStatsProbe />}
    </Canvas>
  );
}

function NightBloom({ base }: { base: number }) {
  return <Bloom mipmapBlur luminanceThreshold={0.6} intensity={base} />;
}

function RenderStatsProbe() {
  useFrame(({ gl }) => {
    renderStats.calls = gl.info.render.calls;
    renderStats.triangles = gl.info.render.triangles;
    renderStats.textures = gl.info.memory.textures;
    renderStats.geometries = gl.info.memory.geometries;
  });
  return null;
}
