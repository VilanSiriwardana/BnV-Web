'use client';

import { PerformanceMonitor, Stats } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Bloom,
  EffectComposer,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { Suspense } from 'react';

import type { LoveSiteConfig } from '../config';
import { TIERS, type Tier } from '../engine/tiers';
import { Arrow } from './arrow';
import { Confetti } from './confetti';
import { Heart } from './heart';
import { MemoryOrbs } from './memory-orbs';
import { GalleryWalk } from './gallery-walk';
import { AmbientHearts, MiniHearts } from './mini-hearts';
import { Petals } from './petals';
import { ReasonsBook } from './reasons-book';
import { ShockRing } from './shock-ring';
import { Sparks } from './sparks';
import { WishStar } from './wish-star';
import { WishCandle } from './wish-candle';
import { renderStats } from '../engine/render-stats';

type Props = {
  tier: Tier;
  memories: LoveSiteConfig['memories'];
  gallery: LoveSiteConfig['gallery'];
  galleryEnd?: LoveSiteConfig['galleryEnd'];
  /** Blueprint 061: Twelve Reasons book pages. */
  reasons?: string[];
  onDecline: () => void;
  debug?: boolean;
  onHeartTap?: () => void;
  onReady?: () => void;
  /** GPU context lost (driver reset, memory pressure): the page falls back to the static path. */
  onContextLost?: () => void;
  spell?: [string, string];
  /** F5: the Wish shows the candle instead of the star. */
  candleMode?: boolean;
};

export default function LoveCanvas({
  tier,
  memories,
  gallery,
  galleryEnd,
  reasons,
  onDecline,
  debug,
  onHeartTap,
  onReady,
  onContextLost,
  spell,
  candleMode,
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
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          'webglcontextlost',
          () => onContextLost?.(),
          { once: true },
        );
        onReady?.();
      }}
    >
      {/* Blueprint 076: one step down at most, never back up. */}
      <PerformanceMonitor onDecline={onDecline} flipflops={1} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1} />
      <Heart tier={tier} onTap={onHeartTap} spell={spell}>
        <MiniHearts tier={tier} />
      </Heart>
      <Petals tier={tier} />
      <AmbientHearts tier={tier} />
      <Suspense fallback={null}>
        <MemoryOrbs tier={tier} memories={memories} />
      </Suspense>
      <GalleryWalk tier={tier} gallery={gallery} galleryEnd={galleryEnd} />
      {tier !== 'low' && reasons && reasons.length > 0 && (
        <ReasonsBook tier={tier} items={reasons} />
      )}
      <ShockRing />
      <Sparks />
      <Arrow />
      <WishStar />
      {candleMode && <WishCandle tier={tier} />}
      <Confetti tier={tier} />
      {config.bloom !== 'off' && (
        <EffectComposer multisampling={0}>
          <NightBloom base={config.bloom === 'on' ? 0.45 : 0.28} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Vignette offset={0.3} darkness={0.5} />
        </EffectComposer>
      )}
      {debug && <Stats />}
      {debug && <RenderStatsProbe />}
    </Canvas>
  );
}

function NightBloom({ base }: { base: number }) {
  return <Bloom mipmapBlur luminanceThreshold={0.8} intensity={base} />;
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
