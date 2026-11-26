'use client';

import gsap from 'gsap';
import { Mic, X } from 'lucide-react';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils/cn';

import { director } from '../engine/heart-director';
import { candle } from '../engine/candle-state';
import { WISH_BLOW_TOP, WISH_REST, WISH_TOP } from '../engine/heart-path';
import { heart } from '../engine/heart-state';
import { useQuiet } from '../engine/use-quiet';
import { onSessionReset, session } from '../engine/session';
import { useBlow } from '../hooks/use-blow';
import { useHold } from '../hooks/use-hold';
import { LoveSection, sectionTitle } from './love-section';

const HOLD_MS = 2400;
const RING_R = 46;
const RING_C = 2 * Math.PI * RING_R;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Phase = 'idle' | 'merging' | 'done';
type Props = {
  name: string;
  prompt: string;
  done: string;
  /** F5: a candle replaces the star (config wish.mode !== 'star' and a mic API exists). */
  candleMode?: boolean;
  blowHint?: string;
  children?: ReactNode;
};

const TICKS = Array.from({ length: 60 }, (_, i) => i * 6);
const sparkles = [0, 120, 240];
const MERGING: ReadonlySet<string | null> = new Set(['wishMerge', 'candleOut']);

export function Wish({
  name,
  prompt,
  done,
  candleMode = false,
  blowHint = "I'll listen for your breath. Nothing is recorded or sent.",
  children,
}: Props) {
  const quiet = useQuiet();
  const sectionRef = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const pill = useRef<HTMLParagraphElement>(null);
  const timer = useRef<gsap.core.Tween | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [writing, setWriting] = useState(false);
  const writeToggle = useRef<HTMLButtonElement>(null);
  const writePanel = useRef<HTMLDivElement>(null);
  const closeWriting = useCallback(() => {
    setWriting(false);
    writeToggle.current?.focus();
  }, []);
  useEffect(() => {
    if (!writing) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeWriting();
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!writePanel.current?.contains(t) && !writeToggle.current?.contains(t))
        setWriting(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [writing, closeWriting]);
  const fieldId = useId();
  const ringGradient = `wish-ring-${fieldId.replace(/[^a-z0-9]/gi, '')}`;
  const snuff = candleMode && !quiet;

  const onProgress = useCallback((p: number) => {
    if (ring.current)
      ring.current.style.strokeDashoffset = `${RING_C * (1 - p)}`;
    pill.current?.toggleAttribute('data-holding', p > 0 && p < 1);
    if (MERGING.has(director.current())) return;
    // Blueprint 065: the hidden heart stays hidden while the candle burns.
    if (candle.visible > 0 && candle.out < 1) {
      candle.blow = p * 0.6;
      return;
    }
    heart.starHold = p;
    heart.ndc.y = lerp(WISH_REST.y, WISH_TOP.y, p);
    heart.scale = lerp(WISH_REST.scale, WISH_TOP.scale, p);
  }, []);

  const onComplete = useCallback(() => {
    if (session.wishDone) return;
    session.wishDone = true;
    setPhase('merging');
    director.interrupt(snuff ? 'candleOut' : 'wishMerge');
    try {
      navigator.vibrate?.(10);
    } catch {}
    timer.current = gsap.delayedCall(quiet ? 0 : snuff ? 4 : 2, () =>
      setPhase('done'),
    );
  }, [quiet, snuff]);

  // Breath bends the flame and lifts the heart only part of the way (WISH_BLOW_TOP).
  const onBlow = useCallback((b: number) => {
    candle.blow = b;
    if (ring.current)
      ring.current.style.strokeDashoffset = `${RING_C * (1 - b)}`;
    if (MERGING.has(director.current()) || candle.out < 1) return;
    heart.ndc.y = lerp(WISH_REST.y, WISH_BLOW_TOP.y, b);
    heart.scale = lerp(WISH_REST.scale, WISH_BLOW_TOP.scale, b);
  }, []);

  const blow = useBlow({
    enabled: snuff,
    sectionRef,
    onProgress: onBlow,
    onBlown: onComplete,
  });

  const { handlers, complete, reset } = useHold({
    duration: HOLD_MS,
    onProgress,
    onComplete,
    completeOnClick: quiet,
  });

  const again = useCallback(() => {
    timer.current?.kill();
    session.wishDone = false;
    reset();
    candle.out = 0;
    if (snuff)
      gsap.to(heart, {
        star: 0,
        scale: 0.001,
        duration: 0.4,
        overwrite: 'auto',
      });
    candle.blow = 0;
    if (ring.current) ring.current.style.strokeDashoffset = `${RING_C}`;
    setPhase('idle');
  }, [reset, snuff]);

  useEffect(() => onSessionReset(again), [again]);
  useEffect(() => () => void timer.current?.kill(), []);

  const busy = phase !== 'idle';

  return (
    <LoveSection id="wish" depth={1} stage="200vh" className="bg-surface">
      <h2 id="wish-title" className={sectionTitle}>
        {prompt}, <span className="text-primary">{name}</span>.
      </h2>
      <div
        ref={sectionRef}
        data-wish-candle={snuff ? '' : undefined}
        className={cn(
          'flex flex-col items-center',
          quiet
            ? 'mt-10'
            : 'pointer-events-none absolute inset-0 justify-start gap-8 pt-[14svh]',
        )}
      >
        {/* The whole medallion is the hold target; its centre stays clear so the 3D star shows. */}
        <button
          type="button"
          {...handlers}
          disabled={busy}
          aria-describedby={`${fieldId}-hint`}
          className="focus-ring pointer-events-auto relative grid size-[min(62vw,18rem)] touch-none place-items-center rounded-full select-none disabled:cursor-default"
        >
          <span
            aria-hidden
            className="border-gold/40 bg-background/10 absolute inset-0 rounded-full border"
          />
          <span
            aria-hidden
            className="border-gold/20 absolute inset-3 rounded-full border"
          />
          {!quiet &&
            sparkles.map((deg) => (
              <span
                key={deg}
                aria-hidden
                className="absolute inset-0 animate-[spin_24s_linear_infinite] motion-reduce:animate-none"
                style={{ rotate: `${deg}deg` }}
              >
                <span className="bg-gold/70 absolute top-1 left-1/2 size-1 -translate-x-1/2 rounded-full" />
              </span>
            ))}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            className="absolute inset-0 size-full -rotate-90"
          >
            <defs>
              <linearGradient id={ringGradient} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--primary)" />
                <stop offset="1" stopColor="var(--gold)" />
              </linearGradient>
            </defs>
            {TICKS.map((deg) => (
              <line
                key={deg}
                x1="50"
                y1="1.5"
                x2="50"
                y2={deg % 30 === 0 ? 4 : 2.8}
                className="stroke-gold/35"
                strokeWidth="0.4"
                transform={`rotate(${deg} 50 50)`}
              />
            ))}
            <circle
              cx="50"
              cy="50"
              r={RING_R}
              fill="none"
              className="stroke-border"
              strokeWidth="1"
            />
            <circle
              ref={ring}
              cx="50"
              cy="50"
              r={RING_R}
              fill="none"
              stroke={`url(#${ringGradient})`}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C}
            />
          </svg>
          {children ??
            (quiet &&
              (candleMode ? (
                <FlatCandle lit={phase === 'idle'} />
              ) : (
                <span aria-hidden className="text-gold-text text-h3">
                  ✦
                </span>
              )))}
          <span className="sr-only">Make a wish</span>
        </button>
        {/* Blueprint 062: grouped controls under the ring */}
        <div className="pointer-events-auto flex flex-col items-center gap-3">
          <p
            ref={pill}
            id={`${fieldId}-hint`}
            className="group text-label border-gold/40 bg-surface flex items-center gap-2 rounded-full border px-4 py-1.5 font-sans"
          >
            <span aria-hidden className="text-gold-text">
              ☝
            </span>
            {quiet ? (
              candleMode ? (
                'Tap the candle'
              ) : (
                'Tap the star'
              )
            ) : (
              <>
                <span className="group-data-holding:hidden">
                  {snuff ? 'Hold the candle' : 'Press and hold'}
                </span>
                <span className="hidden group-data-holding:inline">
                  Keep holding…
                </span>
              </>
            )}
          </p>
          {!quiet && !busy && (
            <Button variant="love-link" size="inline" onClick={complete}>
              Or tap once
            </Button>
          )}
          {snuff && blow.supported && !busy && (
            <div className="flex max-w-xs flex-col items-center gap-2">
              {blow.status === 'listening' ? (
                <p
                  role="status"
                  className="text-label text-gold-text flex items-center gap-2 font-sans"
                >
                  <span
                    aria-hidden
                    className="bg-gold size-2 animate-pulse rounded-full motion-reduce:animate-none"
                  />
                  Listening… blow gently
                  <Button
                    variant="love-link"
                    size="inline"
                    onClick={() => blow.stop()}
                  >
                    Stop
                  </Button>
                </p>
              ) : blow.status === 'denied' ? (
                <p role="status" className="text-small font-sans opacity-80">
                  No problem, just hold the candle.
                </p>
              ) : (
                <>
                  <Button
                    variant="love-ghost"
                    size="sm"
                    disabled={blow.status === 'starting'}
                    onClick={() => void blow.start()}
                  >
                    <Mic aria-hidden className="text-secondary" />
                    Use my microphone to blow
                  </Button>
                  <p className="text-small font-sans opacity-70">{blowHint}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div
        className={cn(
          'flex flex-col items-center px-4',
          quiet ? 'mt-8' : 'mt-2',
        )}
      >
        <p
          aria-live="polite"
          className="text-body-lg font-display text-gold-text min-h-[1.5em]"
        >
          {phase === 'done' ? done : ''}
        </p>
        {phase === 'done' && (
          <Button
            variant="love-ghost"
            size="sm"
            onClick={again}
            className="mt-3"
          >
            Make another wish
          </Button>
        )}
        <Button
          ref={writeToggle}
          variant="love-link"
          size="inline"
          aria-expanded={writing}
          aria-controls={fieldId}
          onClick={() => setWriting((w) => !w)}
          className="text-small mt-4"
        >
          Write your wish
        </Button>
        {writing && (
          // Never stored or sent (Tech Stack §9.3): uncontrolled, no name, no form.
          <div
            ref={writePanel}
            className="love-parchment relative mt-3 w-full max-w-sm rounded-lg p-4 pt-12 text-left max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-30 max-md:max-w-none max-md:rounded-b-none max-md:pb-[max(1rem,env(safe-area-inset-bottom))]"
          >
            <button
              type="button"
              onClick={closeWriting}
              aria-label="Close"
              className="focus-ring hover:bg-gold/20 text-secondary absolute top-1.5 right-1.5 grid size-10 place-items-center rounded-full transition-colors"
            >
              <X className="size-4" />
            </button>
            <Textarea
              id={fieldId}
              aria-label="Your wish"
              autoComplete="off"
              rows={3}
              className="font-serif text-lg"
            />
            <p className="text-small mt-2 font-sans opacity-70">
              Stays on this device, never sent.
            </p>
          </div>
        )}
      </div>
    </LoveSection>
  );
}

// Calm / static (F5): a flat candle; one click blows it out (opacity only, no mic).
function FlatCandle({ lit }: { lit: boolean }) {
  return (
    // Blueprint 065: a flat birthday cake with one candle.
    <svg aria-hidden viewBox="0 0 64 72" className="h-24 w-20">
      <path
        d="M32 4 C37 12 37 17 32 20 C27 17 27 12 32 4 Z"
        className="fill-gold transition-opacity duration-500"
        style={{ opacity: lit ? 1 : 0 }}
      />
      <rect
        x="30"
        y="22"
        width="4"
        height="14"
        rx="1"
        className="fill-gold/70"
      />
      <rect
        x="14"
        y="36"
        width="36"
        height="12"
        rx="3"
        className="fill-primary/60"
      />
      <path
        d="M14 40 q4.5 5 9 0 q4.5 5 9 0 q4.5 5 9 0 q4.5 5 9 0"
        className="stroke-foreground/70 fill-none"
        strokeWidth="1.5"
      />
      <rect
        x="6"
        y="48"
        width="52"
        height="16"
        rx="3"
        className="fill-secondary/60"
      />
      <rect
        x="4"
        y="64"
        width="56"
        height="3"
        rx="1.5"
        className="fill-gold/60"
      />
    </svg>
  );
}
