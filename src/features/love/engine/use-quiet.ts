'use client';

import { useMotionPrefs } from './motion-prefs';
import { useTier } from './tier-provider';

// Calm mode, OS reduced motion, Save-Data or no WebGL: one static path (Tech Stack §7.5, §9.1).
export function useQuiet() {
  const { calm } = useMotionPrefs();
  const { tier } = useTier();
  return calm || tier === 'static';
}
