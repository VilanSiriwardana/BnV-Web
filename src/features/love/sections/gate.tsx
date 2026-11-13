'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

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
            className="love-gate-frame-inner pointer-events-none absolute inset-6 rounded-[1.25rem] sm:inset-10"
          />
          <div
            aria-hidden
            className="love-grain pointer-events-none absolute inset-0"
          />
          <div
            aria-hidden
            className="love-gate-halo pointer-events-none absolute top-[12%] left-1/2 size-[min(90vw,34rem)] -translate-x-1/2 rounded-full"
          />
          <p className="text-gold relative z-10 mt-[max(2.5rem,7svh)] font-sans text-[0.65rem] font-semibold tracking-[0.38em] uppercase sm:text-xs">
            A moment made for you
          </p>
          <div className="relative z-10 my-auto flex w-full max-w-xl flex-col items-center py-6">
            <div className="relative">
              <div
                aria-hidden
                className="text-gold-text absolute right-[calc(100%-2.5rem)] bottom-[calc(100%-1.75rem)] flex w-32 flex-col items-start sm:w-40"
              >
                <span className="font-body -rotate-6 text-[clamp(1.4rem,5vw,1.8rem)] italic">
                  Tap this
                </span>
                <svg viewBox="0 0 120 70" className="-mt-1 ml-6 w-24 sm:w-28">
                  <motion.path
                    d="M 8 6 C 30 40, 62 58, 104 56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: calm ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 1.2,
                      delay: 0.4,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.path
                    d="M 94 47 L 106 56 L 93 64"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: calm ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.5 }}
                  />
                </svg>
              </div>
              <motion.button
                type="button"
                autoFocus
                aria-label={ready ? 'Begin' : 'Getting ready'}
                aria-disabled={!ready}
                onClick={enter}
                animate={calm || !ready ? undefined : { scale: [1, 1.04, 1] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="focus-ring relative grid size-40 cursor-pointer place-items-center rounded-full sm:size-48"
              >
                <span
                  aria-hidden
                  className="border-gold/30 absolute inset-2 rounded-full border"
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
                  className="absolute size-28 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--gold)_55%,transparent)_0%,color-mix(in_oklab,var(--primary)_35%,transparent)_40%,transparent_72%)] blur-md"
                />
                <svg
                  aria-hidden
                  viewBox="0 0 100 92"
                  className="relative w-20 drop-shadow-[0_0_18px_var(--gold)] sm:w-24"
                >
                  <defs>
                    <radialGradient id="gate-heart" cx="40%" cy="35%" r="75%">
                      <stop offset="0%" stopColor="var(--gold)" />
                      <stop offset="45%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="var(--secondary)" />
                    </radialGradient>
                  </defs>
                  <path
                    d="M50 88 C 20 66, 4 48, 4 28 C 4 13, 15 4, 28 4 C 38 4, 46 10, 50 19 C 54 10, 62 4, 72 4 C 85 4, 96 13, 96 28 C 96 48, 80 66, 50 88 Z"
                    fill="url(#gate-heart)"
                    stroke="var(--gold)"
                    strokeWidth="2"
                  />
                </svg>
              </motion.button>
            </div>
            <p
              aria-live="polite"
              className="text-gold-text mt-4 font-sans text-[0.65rem] font-semibold tracking-[0.32em] uppercase sm:text-xs"
            >
              {ready ? 'Open your story' : 'Getting ready…'}
            </p>
            <p className="text-primary mt-8 font-sans text-[0.65rem] font-semibold tracking-[0.32em] uppercase sm:text-xs">
              To my favourite person
            </p>
            <h2
              id="gate-title"
              className="font-display text-gold-text mt-3 text-[clamp(2.6rem,11vw,4.6rem)] leading-tight"
            >
              For {name}
            </h2>
            <p className="font-body text-foreground/90 mt-3 max-w-[30ch] text-[clamp(1.3rem,5vw,1.7rem)] leading-snug italic">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
