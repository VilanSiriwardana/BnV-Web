'use client';

import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Button } from '@/components/ui/button';

import { audio } from '../engine/audio-engine';
import { playChime } from '../engine/chime';
import { useMotionPrefs } from '../engine/motion-prefs';
import { useLoveScroll } from '../engine/scroll-engine';
import { useTier } from '../engine/tier-provider';
import { useHold } from '../hooks/use-hold';

const LOAD_TIMEOUT_MS = 6000;
const HEART_D =
  'M50 88 C 20 66, 4 48, 4 28 C 4 13, 15 4, 28 4 C 38 4, 46 10, 50 19 C 54 10, 62 4, 72 4 C 85 4, 96 13, 96 28 C 96 48, 80 66, 50 88 Z';
// Blueprint 065: fixed seeds so server and client render the same ambient hearts.
const AMBIENT = Array.from({ length: 14 }, (_, i) => {
  const r = (k: number) =>
    (((Math.sin((i + 1) * 12.9898 * k) * 43758.5453) % 1) + 1) % 1;
  return {
    left: `${(4 + r(1) * 92).toFixed(2)}%`,
    size: 10 + Math.round(r(2) * 16),
    dur: `${(10 + r(3) * 8).toFixed(2)}s`,
    delay: `${(-r(4) * 14).toFixed(2)}s`,
    sway: `${Math.round((r(5) - 0.5) * 60)}px`,
  };
});
const GATE_HOLD_MS = 1400;
const GATE_REST_SEP = 0.5;
const GATE_LOAD_SEP = 0.62;
const GATE_QUIET_SEP = 0.2;
const GATE_IDLE_NUDGE_MS = 4000;
const GATE_REFRESH_MS = 650;
const isHoldKey = (key: string) => key === ' ' || key === 'Enter';

type Props = {
  name: string;
  musicSrc: string;
  /** True once the canvas has rendered its first frame, or when there is no canvas. */
  sceneReady: boolean;
  /** Seed centre in NDC: the ribbons' meeting point. */
  onEnter: (seed: { x: number; y: number }) => void;
  eyebrow?: string;
  hint?: string;
};

// Experience §5 (Blueprint 072, Two Lights): a fixed overlay. No scroll and no sound until the
// press; holding brings the two lights together and the merge point seeds the ribbon weave.
export function Gate({
  name,
  musicSrc,
  sceneReady,
  onEnter,
  eyebrow,
  hint,
}: Props) {
  const [open, setOpen] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  const { calm } = useMotionPrefs();
  const { tier, setTier } = useTier();
  const { start, stop, scrollTo, resize } = useLoveScroll();
  const rootRef = useRef<HTMLDivElement>(null);
  const seedRef = useRef<HTMLDivElement>(null);
  const enteringRef = useRef(false);
  const engagedRef = useRef(false);
  const audioRef = useRef(false);
  const sepState = useRef({ v: 1 });
  const sepTween = useRef<gsap.core.Tween | null>(null);
  const ready = sceneReady || timedOut;

  const setSep = useCallback((v: number) => {
    sepState.current.v = v;
    rootRef.current?.style.setProperty('--sep', String(v));
  }, []);

  const tweenSep = useCallback(
    (to: number, vars: gsap.TweenVars) => {
      sepTween.current?.kill();
      sepTween.current = gsap.to(sepState.current, {
        v: to,
        ...vars,
        onUpdate: () => setSep(sepState.current.v),
      });
    },
    [setSep],
  );

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
    if (timedOut && !sceneReady && tier === 'high') setTier('mid');
  }, [timedOut, sceneReady, tier, setTier]);

  // Intro drift (1 → load → rest) and one idle nudge; GSAP only writes --sep.
  useEffect(() => {
    if (calm) {
      sepTween.current?.kill();
      setSep(GATE_QUIET_SEP);
      return;
    }
    if (engagedRef.current) return;
    if (!ready) {
      setSep(1);
      tweenSep(GATE_LOAD_SEP, { duration: 5, ease: 'sine.out' });
      return;
    }
    tweenSep(GATE_REST_SEP, { duration: 1.2, ease: 'power2.out' });
    const id = window.setTimeout(() => {
      if (engagedRef.current) return;
      tweenSep(GATE_REST_SEP - 0.05, {
        duration: 0.6,
        yoyo: true,
        repeat: 1,
        ease: 'sine.inOut',
      });
    }, GATE_IDLE_NUDGE_MS);
    return () => window.clearTimeout(id);
  }, [calm, ready, setSep, tweenSep]);

  useEffect(() => () => void sepTween.current?.kill(), []);

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
    // A restored scroll position would leave the weave off-screen.
    scrollTo(0, { immediate: true, force: true });
    start();
    try {
      onEnter(seed);
    } catch (error) {
      // The page is still usable if the optional 3D entrance cannot start.
      console.error('Love site entrance animation failed', error);
    }
    // Re-measure once the overlay has faded (fonts and layout may have settled under it).
    window.setTimeout(() => {
      resize();
      ScrollTrigger.refresh();
    }, GATE_REFRESH_MS);
  }

  const { handlers } = useHold({
    duration: GATE_HOLD_MS,
    completeOnClick: calm,
    onProgress: (p) => {
      if (!calm) setSep(GATE_REST_SEP * (1 - p * p));
    },
    onComplete: () => {
      seedRef.current?.classList.add('love-gate-merge');
      playChime(0);
      enter();
    },
  });

  // First real gesture: hide the hint and unlock audio synchronously (a timer is not a gesture).
  function engage() {
    if (!ready || enteringRef.current) return false;
    if (!engagedRef.current) {
      engagedRef.current = true;
      if (rootRef.current) rootRef.current.dataset.engaged = '';
      sepTween.current?.kill();
    }
    if (!audioRef.current) {
      audioRef.current = true;
      audio.start(musicSrc);
    }
    return true;
  }

  function tapOnce() {
    if (!engage()) return;
    if (calm) return enter();
    tweenSep(0, { duration: 0.5, ease: 'power1.in', onComplete: enter });
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={rootRef}
          role="dialog"
          aria-modal
          aria-labelledby="gate-title"
          aria-busy={!ready}
          data-quiet={calm ? 'true' : undefined}
          data-lenis-prevent
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="love-gate text-foreground fixed inset-0 z-40 flex min-h-svh flex-col items-center overflow-hidden px-6 text-center"
        >
          <div
            aria-hidden
            className="love-grain pointer-events-none absolute inset-0"
          />
          {!calm && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              {AMBIENT.map((h, i) => (
                <svg
                  key={i}
                  viewBox="0 0 100 92"
                  className="love-gate-heart"
                  style={
                    {
                      left: h.left,
                      width: h.size,
                      '--dur': h.dur,
                      '--delay': h.delay,
                      '--sway': h.sway,
                    } as CSSProperties
                  }
                >
                  <path d={HEART_D} fill="currentColor" />
                </svg>
              ))}
            </div>
          )}
          <span aria-hidden className="love-gate-line love-gate-line--t" />
          <span aria-hidden className="love-gate-line love-gate-line--r" />
          <span aria-hidden className="love-gate-line love-gate-line--b" />
          <span aria-hidden className="love-gate-line love-gate-line--l" />
          <div className="relative z-10 mt-[14svh] flex w-full max-w-xl flex-col items-center">
            <p className="love-gate-eyebrow love-gate-rise text-label text-foreground/70 font-sans tracking-[0.3em] uppercase">
              {eyebrow ?? 'Made for you'}
            </p>
            <h2
              id="gate-title"
              className="font-display love-gate-rise mt-3 text-[clamp(2.6rem,8vw,4.2rem)] leading-tight"
            >
              <span className="love-gate-shimmer">For {name}</span>
            </h2>
            <p className="font-body text-foreground/80 love-gate-rise mt-4 text-[clamp(1.1rem,4vw,1.4rem)] italic [animation-delay:.4s]">
              A story waiting to unfold.
            </p>
          </div>
          <div aria-hidden className="love-gate-halo-soft" />
          <div
            aria-hidden
            className="love-gate-light love-gate-light--lavender"
          >
            <span />
          </div>
          <div aria-hidden className="love-gate-light love-gate-light--gold">
            <span />
          </div>
          <button
            type="button"
            autoFocus
            aria-label={ready ? 'Begin' : 'Getting ready'}
            aria-disabled={!ready}
            aria-describedby="gate-instr"
            className="peer absolute inset-0 z-20 cursor-pointer touch-none bg-transparent outline-none"
            {...handlers}
            onPointerDown={(e) => {
              if (engage()) handlers.onPointerDown(e);
            }}
            onKeyDown={(e) => {
              if (isHoldKey(e.key) && !e.repeat && !engage()) {
                e.preventDefault();
                return;
              }
              handlers.onKeyDown(e);
            }}
          />
          <div
            ref={seedRef}
            aria-hidden
            className="love-gate-core peer-focus-visible:outline-gold rounded-full peer-focus-visible:outline-2 peer-focus-visible:outline-offset-8"
          />
          <p id="gate-instr" className="sr-only">
            Press and hold to bring the two lights together, or tap once.
          </p>
          <p aria-live="polite" className="sr-only">
            {ready ? '' : 'Getting ready…'}
          </p>
          <div className="love-gate-hint absolute bottom-[12svh] z-30 flex flex-col items-center gap-1">
            <p className="font-body text-foreground/70 italic">
              {hint ?? 'Press and hold'}
            </p>
            <Button variant="love-link" size="inline" onClick={tapOnce}>
              Or tap once
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
