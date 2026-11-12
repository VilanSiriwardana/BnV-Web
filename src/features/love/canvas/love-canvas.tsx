'use client';

import { PerformanceMonitor, Stats } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import type { Mesh } from 'three';

import { TIERS, type Tier } from '../engine/tiers';
import { readTokenColors } from './token-colors';

// Phase 2 smoke test: one lavender sphere proves R3F + bloom work in this repo.
function TestSphere() {
  const ref = useRef<Mesh>(null);
  const color = useMemo(() => {
    const root = document.querySelector<HTMLElement>('[data-love-root]');
    return root ? readTokenColors(root).primary.night : undefined;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.3;
    ref.current.rotation.x += delta * 0.1;
  });

  return (
    <mesh
      ref={ref}
      onClick={() => {
        if (process.env.NODE_ENV !== 'production')
          console.info('[love] canvas click');
      }}
    >
      <icosahedronGeometry args={[1, 3]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.4}
        flatShading
      />
    </mesh>
  );
}

type Props = {
  tier: Tier;
  onDecline: () => void;
  onIncline: () => void;
  debug?: boolean;
};

export default function LoveCanvas({
  tier,
  onDecline,
  onIncline,
  debug,
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
    >
      {/* Step down on decline; step up only after a long stable run (flipflops ends adaptation). */}
      <PerformanceMonitor
        onDecline={onDecline}
        onIncline={onIncline}
        flipflops={3}
      />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <TestSphere />
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
