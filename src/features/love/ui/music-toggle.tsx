'use client';

import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useSyncExternalStore } from 'react';

import { duration, ease } from '@/config/motion';

import { audio } from '../engine/audio-engine';

const serverMuted = () => false;

export function MusicToggle() {
  const muted = useSyncExternalStore(
    audio.subscribe,
    audio.isMuted,
    serverMuted,
  );
  const Icon = muted ? VolumeX : Volume2;
  return (
    <motion.button
      type="button"
      aria-pressed={!muted}
      aria-label="Music"
      onClick={() => (muted ? audio.unmute() : audio.mute())}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: duration.fast, ease: ease.standard }}
      className="border-border bg-surface/80 text-foreground focus-ring fixed top-4 right-4 z-20 flex size-11 items-center justify-center rounded-md border backdrop-blur-sm"
    >
      <Icon aria-hidden className="size-5" />
    </motion.button>
  );
}
