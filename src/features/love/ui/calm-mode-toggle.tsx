'use client';

import { motion } from 'framer-motion';

import { duration, ease, hoverScale } from '@/config/motion';

import { useMotionPrefs } from '../engine/motion-prefs';

export function CalmModeToggle() {
  const { calm, setCalm } = useMotionPrefs();
  return (
    <motion.button
      type="button"
      aria-pressed={calm}
      onClick={() => setCalm(!calm)}
      whileHover={calm ? undefined : { scale: hoverScale }}
      whileTap={calm ? undefined : { scale: 0.97 }}
      transition={{ duration: duration.fast, ease: ease.standard }}
      className="border-border bg-surface/80 text-small text-foreground focus-ring aria-pressed:bg-primary aria-pressed:text-primary-foreground fixed bottom-4 left-4 z-20 min-h-11 min-w-11 rounded-md border px-4 font-sans backdrop-blur-sm"
    >
      Calm mode
    </motion.button>
  );
}
