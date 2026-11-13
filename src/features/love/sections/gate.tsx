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
  const enteringRef = useRef(false);
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
    if (!ready || !open || enteringRef.current) return;
    enteringRef.current = true;
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
    try {
      onEnter(seed);
    } catch (error) {
      // The page is still usable if the optional 3D entrance cannot start.
      console.error('Love site entrance animation failed', error);
    }
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
          className="love-gate text-foreground fixed inset-0 z-40 flex flex-col items-center overflow-hidden px-6 text-center"
        >
          <div
            aria-hidden
            className="love-gate-frame pointer-events-none absolute inset-4 rounded-[1.5rem] sm:inset-7"
          />
          <div
            aria-hidden
            className="love-gate-halo pointer-events-none absolute top-[12%] left-1/2 size-[min(90vw,34rem)] -translate-x-1/2 rounded-full"
          />
          <p className="text-gold relative z-10 mt-[max(2.5rem,7svh)] font-sans text-[0.65rem] font-semibold tracking-[0.38em] uppercase sm:text-xs">
            A moment made for you
          </p>
          <div className="relative z-10 mt-auto flex w-full max-w-xl flex-col items-center pb-6">
            <div className="relative grid size-36 place-items-center sm:size-44">
              <span
                aria-hidden
                className="border-gold/30 absolute inset-3 rotate-45 rounded-[2.4rem] border"
              />
              <span
                aria-hidden
                className="border-primary/15 absolute inset-0 rounded-full border"
              />
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
                className="size-24 rounded-full bg-[radial-gradient(circle,var(--gold)_0%,var(--primary)_18%,color-mix(in_oklab,var(--secondary)_55%,transparent)_44%,transparent_72%)]"
              />
            </div>
            <p className="text-primary mt-7 font-sans text-[0.65rem] font-semibold tracking-[0.32em] uppercase sm:text-xs">
              To my favourite person
            </p>
            <h2
              id="gate-title"
              className="font-display text-gold-text mt-3 text-[clamp(2.8rem,12vw,5rem)] leading-tight"
            >
              For {name}
            </h2>
            <p className="font-body text-foreground/90 mt-3 max-w-[30ch] text-[clamp(1.35rem,5vw,1.75rem)] leading-snug italic">
              A little something for you. A story waiting to unfold.
            </p>
            <div
              aria-hidden
              className="text-gold/70 mt-6 flex items-center gap-3"
            >
              <span className="h-px w-12 bg-current" />
              <span className="text-lg">✦</span>
              <span className="h-px w-12 bg-current" />
            </div>
          </div>
          <Button
            size="lg"
            autoFocus
            type="button"
            aria-disabled={!ready}
            onClick={enter}
            className="bg-primary hover:bg-primary-hover relative z-10 mb-[max(3.5rem,10svh)] min-h-14 min-w-48 rounded-full border border-white/20 px-8 text-base shadow-[0_12px_42px_color-mix(in_oklab,var(--primary)_25%,transparent)] sm:mb-[12svh]"
          >
            {ready ? 'Tap to begin' : 'Getting ready…'}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
