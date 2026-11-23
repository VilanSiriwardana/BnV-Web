'use client';

import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useSyncExternalStore } from 'react';

import { duration, ease } from '@/config/motion';

import { audio } from '../engine/audio-engine';

const serverMuted = () => false;

// Shared by the top-right toggle and the Finale's "Music on/off" button.
export function useMusicToggle() {
  const muted = useSyncExternalStore(
    audio.subscribe,
    audio.isMuted,
    serverMuted,
  );
  return { muted, toggle: () => (muted ? audio.unmute() : audio.mute()) };
}

export function MusicToggle() {
  const { muted, toggle } = useMusicToggle();
  const Icon = muted ? VolumeX : Volume2;
  return (
    <motion.button
      type="button"
      aria-pressed={!muted}
      aria-label="Music"
      onClick={toggle}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: duration.fast, ease: ease.standard }}
      className="border-border bg-surface/80 text-foreground focus-ring fixed top-4 right-4 z-20 flex size-11 items-center justify-center rounded-md border backdrop-blur-sm"
    >
      <Icon aria-hidden className="text-primary size-5" />
    </motion.button>
  );
}
