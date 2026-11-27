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
import { lazy, Suspense, useEffect } from 'react';

import type { LoveSiteConfig } from '../config';
import { TIERS, type Tier } from '../engine/tiers';
import { Arrow } from './arrow';
import { Confetti } from './confetti';
import { Heart } from './heart';
import { AmbientHearts, MiniHearts } from './mini-hearts';
import { Petals } from './petals';
import { ShockRing } from './shock-ring';
import { Sparks } from './sparks';
import { renderStats } from '../engine/render-stats';
import { markAllNear, useNear } from '../engine/act-state';

// Blueprint 089: later acts load their code and textures only when their section is near.
const MemoryOrbs = lazy(() =>
  import('./memory-orbs').then((m) => ({ default: m.MemoryOrbs })),
);
const GalleryWalk = lazy(() =>
  import('./gallery-walk').then((m) => ({ default: m.GalleryWalk })),
);
const ReasonsBook = lazy(() =>
  import('./reasons-book').then((m) => ({ default: m.ReasonsBook })),
);
const WishStar = lazy(() =>
  import('./wish-star').then((m) => ({ default: m.WishStar })),
);
const WishCandle = lazy(() =>
  import('./wish-candle').then((m) => ({ default: m.WishCandle })),
);

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
  const memoriesNear = useNear('memories');
  const galleryNear = useNear('gallery');
  const reasonsNear = useNear('reasons');
  const wishNear = useNear('wish');
  useEffect(() => {
    if (debug) markAllNear();
  }, [debug]);
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
        {memoriesNear && <MemoryOrbs tier={tier} memories={memories} />}
      </Suspense>
      <Suspense fallback={null}>
        {galleryNear && (
          <GalleryWalk tier={tier} gallery={gallery} galleryEnd={galleryEnd} />
        )}
      </Suspense>
      <Suspense fallback={null}>
        {reasonsNear && tier !== 'low' && reasons && reasons.length > 0 && (
          <ReasonsBook tier={tier} items={reasons} />
        )}
      </Suspense>
      <ShockRing />
      <Sparks />
      <Arrow />
      <Suspense fallback={null}>
        {wishNear && <WishStar />}
        {wishNear && candleMode && <WishCandle tier={tier} />}
      </Suspense>
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
