'use client';

import gsap from 'gsap';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils/cn';

import { director } from '../engine/heart-director';
import { WISH_REST, WISH_TOP } from '../engine/heart-path';
import { heart } from '../engine/heart-state';
import { useMotionPrefs } from '../engine/motion-prefs';
import { onSessionReset, session } from '../engine/session';
import { useHold } from '../hooks/use-hold';
import { LoveSection, sectionTitle } from './love-section';

const HOLD_MS = 2400;
const RING_R = 46;
const RING_C = 2 * Math.PI * RING_R;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Phase = 'idle' | 'merging' | 'done';
type Props = { name: string; prompt: string; done: string };

export function Wish({ name, prompt, done }: Props) {
  const { calm } = useMotionPrefs();
  const quiet = calm;
  const ring = useRef<SVGCircleElement>(null);
  const timer = useRef<gsap.core.Tween | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [writing, setWriting] = useState(false);
  const fieldId = useId();

  const onProgress = useCallback((p: number) => {
    if (ring.current)
      ring.current.style.strokeDashoffset = `${RING_C * (1 - p)}`;
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
    <LoveSection id="wish" dawn={1} stage="200vh" className="bg-surface">
      <h2 id="wish-title" className={sectionTitle}>
        {prompt}, {name}.
      </h2>
      <div
        className={cn(
          'flex flex-col items-center',
          quiet
            ? 'mt-10'
            : 'pointer-events-none absolute inset-0 justify-center',
        )}
      >
        <button
          type="button"
          {...handlers}
          disabled={busy}
          aria-describedby={`${fieldId}-hint`}
          className="focus-ring pointer-events-auto relative grid size-24 touch-none place-items-center rounded-full select-none disabled:cursor-default"
        >
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            className="absolute inset-0 size-full -rotate-90"
          >
            <circle
              cx="50"
              cy="50"
              r={RING_R}
              fill="none"
              className="stroke-border"
              strokeWidth="2"
            />
            <circle
              ref={ring}
              cx="50"
              cy="50"
              r={RING_R}
              fill="none"
              className="stroke-gold"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C}
            />
          </svg>
          {quiet && (
            <span aria-hidden className="text-gold-text text-h3">
              ✦
            </span>
          )}
          <span className="sr-only">Make a wish</span>
        </button>
        <p
          id={`${fieldId}-hint`}
          className="text-label text-muted-foreground mt-4 font-sans"
        >
          {quiet ? 'Tap the star' : 'Press and hold'}
        </p>
        {!quiet && !busy && (
          <button
            type="button"
            onClick={complete}
            className="text-label text-muted-foreground focus-ring mt-1 rounded-sm font-sans underline underline-offset-4"
          >
            Or tap once
          </button>
        )}
      </div>
      <div
        className={cn(
          'flex flex-col items-center px-4',
          quiet ? 'mt-8' : 'absolute inset-x-0 bottom-16 md:bottom-24',
        )}
      >
        <p aria-live="polite" className="text-body-lg min-h-[1.5em] italic">
          {phase === 'done' ? done : ''}
        </p>
        {phase === 'done' && (
          <button
            type="button"
            onClick={again}
            className="text-label text-muted-foreground focus-ring mt-2 rounded-sm font-sans underline underline-offset-4"
          >
            Make another wish
          </button>
        )}
        <button
          type="button"
          aria-expanded={writing}
          aria-controls={fieldId}
          onClick={() => setWriting((w) => !w)}
          className="text-small text-muted-foreground focus-ring mt-4 rounded-sm font-sans underline underline-offset-4"
        >
          Write your wish (stays on this device, never sent)
        </button>
        {writing && (
          // Never stored or sent (Tech Stack §9.3): uncontrolled, no name, no form.
          <Textarea
            id={fieldId}
            aria-label="Your wish"
            autoComplete="off"
            rows={3}
            className="mt-3 w-full max-w-sm"
          />
        )}
      </div>
    </LoveSection>
  );
}
