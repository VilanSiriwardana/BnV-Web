'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import { audio } from '../engine/audio-engine';
import { useMotionPrefs } from '../engine/motion-prefs';
import { useLoveScroll } from '../engine/scroll-engine';
import { useTier } from '../engine/tier-provider';

const LOAD_TIMEOUT_MS = 6000;
const RING_R = 54;
const RING_C = 2 * Math.PI * RING_R;

type Props = {
  name: string;
  musicSrc: string;
  /** True once the canvas has rendered its first frame, or when there is no canvas. */
  sceneReady: boolean;
  /** Seed centre in NDC: the ribbons' meeting point. */
  onEnter: (seed: { x: number; y: number }) => void;
};

// Experience §5: a fixed overlay. No scroll and no sound until the tap.
export function Gate({ name, musicSrc, sceneReady, onEnter }: Props) {
  const [open, setOpen] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  const { calm } = useMotionPrefs();
  const { tier, setTier } = useTier();
  const { start, stop } = useLoveScroll();
  const seedRef = useRef<HTMLDivElement>(null);
  const ready = sceneReady || timedOut;

  useEffect(() => {
    if (!open) return;
    stop();
    const html = document.documentElement;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = '';
    };
  }, [open, stop]);

  useEffect(() => {
    if (ready) return;
    const id = window.setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [ready]);

  useEffect(() => {
    if (timedOut && !sceneReady && (tier === 'high' || tier === 'mid'))
      setTier('low');
  }, [timedOut, sceneReady, tier, setTier]);

  function enter() {
    if (!ready || !open) return;
    // Synchronous inside the gesture: iOS only unlocks audio here.
    audio.start(musicSrc);
    const r = seedRef.current?.getBoundingClientRect();
    const seed = r
      ? {
          x: ((r.left + r.width / 2) / window.innerWidth) * 2 - 1,
          y: 1 - ((r.top + r.height / 2) / window.innerHeight) * 2,
        }
      : { x: 0, y: 0 };
    setOpen(false);
    start();
    onEnter(seed);
  }

  const shown = ready ? 100 : 35;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal
          aria-labelledby="gate-title"
          aria-busy={!ready}
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-background text-foreground fixed inset-0 z-40 flex flex-col items-center px-4 text-center"
        >
          <h2 id="gate-title" className="sr-only">
            Welcome
          </h2>
          <div className="mt-[22svh] flex flex-col items-center md:mt-auto">
            <div className="relative grid size-32 place-items-center">
              <svg
                aria-hidden
                viewBox="0 0 120 120"
                className={`absolute inset-0 size-full -rotate-90 ${ready || calm ? '' : '[animation-duration:2.4s] motion-safe:animate-spin'}`}
              >
                <circle
                  cx="60"
                  cy="60"
                  r={RING_R}
                  fill="none"
                  strokeWidth="1"
                  className="stroke-primary transition-[stroke-dashoffset,opacity] duration-500"
                  strokeDasharray={RING_C}
                  strokeDashoffset={RING_C * (1 - shown / 100)}
                  opacity={ready ? 0 : 0.6}
                />
              </svg>
              <div
                ref={seedRef}
                aria-hidden
                data-love-seed={calm ? undefined : ''}
                className="size-20 rounded-full bg-[radial-gradient(circle,var(--primary)_0%,color-mix(in_oklab,var(--primary)_35%,transparent)_40%,transparent_70%)]"
              />
            </div>
            <p className="text-body-lg mt-10 max-w-[60ch] text-balance break-words italic">
              A little something for you, {name}.
            </p>
          </div>
          <Button
            size="lg"
            autoFocus
            aria-disabled={!ready}
            onClick={enter}
            className="mt-auto mb-[16svh] min-h-12 md:mt-10 md:mb-auto"
          >
            {ready ? 'Tap to begin' : 'Getting ready…'}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
