'use client';

import gsap from 'gsap';
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
import { WISH_REST, WISH_TOP } from '../engine/heart-path';
import { heart } from '../engine/heart-state';
import { useQuiet } from '../engine/use-quiet';
import { onSessionReset, session } from '../engine/session';
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
  children?: ReactNode;
};

const TICKS = Array.from({ length: 60 }, (_, i) => i * 6);
const sparkles = [0, 120, 240];

export function Wish({ name, prompt, done, children }: Props) {
  const quiet = useQuiet();
  const ring = useRef<SVGCircleElement>(null);
  const pill = useRef<HTMLParagraphElement>(null);
  const timer = useRef<gsap.core.Tween | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [writing, setWriting] = useState(false);
  const fieldId = useId();
  const ringGradient = `wish-ring-${fieldId.replace(/[^a-z0-9]/gi, '')}`;

  const onProgress = useCallback((p: number) => {
    if (ring.current)
      ring.current.style.strokeDashoffset = `${RING_C * (1 - p)}`;
    pill.current?.toggleAttribute('data-holding', p > 0 && p < 1);
    if (director.current() === 'wishMerge') return;
    heart.starHold = p;
    heart.ndc.y = lerp(WISH_REST.y, WISH_TOP.y, p);
    heart.scale = lerp(WISH_REST.scale, WISH_TOP.scale, p);
  }, []);

  const onComplete = useCallback(() => {
    if (session.wishDone) return;
    session.wishDone = true;
    setPhase('merging');
    director.interrupt('wishMerge');
    try {
      navigator.vibrate?.(10);
    } catch {}
    timer.current = gsap.delayedCall(quiet ? 0 : 2, () => setPhase('done'));
  }, [quiet]);

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
    if (ring.current) ring.current.style.strokeDashoffset = `${RING_C}`;
    setPhase('idle');
  }, [reset]);

  useEffect(() => onSessionReset(again), [again]);
  useEffect(() => () => void timer.current?.kill(), []);

  const busy = phase !== 'idle';

  return (
    <LoveSection id="wish" depth={1} stage="200vh" className="bg-surface">
      <p className="text-label text-gold-text font-sans tracking-[0.2em] uppercase">
        Make a wish
      </p>
      <h2 id="wish-title" className={cn(sectionTitle, 'mt-3')}>
        {prompt}, <span className="text-primary">{name}</span>.
      </h2>
      <div
        className={cn(
          'flex flex-col items-center',
          quiet
            ? 'mt-10'
            : 'pointer-events-none absolute inset-0 justify-center',
        )}
      >
        {/* The whole medallion is the hold target; its centre stays clear so the 3D star shows. */}
        <button
          type="button"
          {...handlers}
          disabled={busy}
          aria-describedby={`${fieldId}-hint`}
          className="focus-ring pointer-events-auto relative grid size-[min(70vw,20rem)] touch-none place-items-center rounded-full select-none disabled:cursor-default"
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
            (quiet && (
              <span aria-hidden className="text-gold-text text-h3">
                ✦
              </span>
            ))}
          <span className="sr-only">Make a wish</span>
        </button>
        <p
          ref={pill}
          id={`${fieldId}-hint`}
          className="group text-label border-gold/40 bg-surface pointer-events-auto mt-5 flex items-center gap-2 rounded-full border px-4 py-1.5 font-sans"
        >
          <span aria-hidden className="text-gold-text">
            ☝
          </span>
          {quiet ? (
            'Tap the star'
          ) : (
            <>
              <span className="group-data-[holding]:hidden">
                Press and hold
              </span>
              <span className="hidden group-data-[holding]:inline">
                Keep holding…
              </span>
            </>
          )}
        </p>
        {!quiet && !busy && (
          <Button
            variant="love-link"
            size="inline"
            onClick={complete}
            className="pointer-events-auto mt-3"
          >
            Or tap once
          </Button>
        )}
      </div>
      <div
        className={cn(
          'flex flex-col items-center px-4',
          quiet ? 'mt-8' : 'absolute inset-x-0 bottom-10 md:bottom-16',
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
          <div className="love-parchment relative mt-3 w-full max-w-sm rounded-lg p-4 text-left max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-30 max-md:max-w-none max-md:rounded-b-none max-md:pb-[max(1rem,env(safe-area-inset-bottom))]">
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
