'use client';

import { PerformanceMonitor, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

import { TIERS, type Tier } from '../engine/tiers';
import { Heart } from './heart';
import { MiniHearts } from './mini-hearts';

type Props = {
  tier: Tier;
  onDecline: () => void;
  onIncline: () => void;
  debug?: boolean;
  onHeartTap?: () => void;
  onReady?: () => void;
};

export default function LoveCanvas({
  tier,
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
      {config.bloom !== 'off' && (
        <EffectComposer multisampling={0}>
          <Bloom
            mipmapBlur
            luminanceThreshold={0.6}
            intensity={config.bloom === 'on' ? 0.9 : 0.5}
          />
        </EffectComposer>
      )}
      {debug && <Stats />}
    </Canvas>
  );
}
