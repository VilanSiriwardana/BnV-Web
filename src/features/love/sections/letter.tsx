'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { type FormEvent, useCallback, useId, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';

import type { LoveSiteConfig } from '../config';
import { director } from '../engine/heart-director';
import { useMotionPrefs } from '../engine/motion-prefs';
import { useHold } from '../hooks/use-hold';
import { labelText, LoveSection, sectionTitle } from './love-section';

const HOLD_MS = 1200;
type Props = { title: string; letter: LoveSiteConfig['letter'] };

const normalise = (s: string) => s.trim().toLowerCase();

// The 3D heart docks behind the envelope; a round hole at the seal lets it show as the seal.
const sealHole = (at: string, r: number) => {
  const mask = `radial-gradient(circle ${r}px at ${at}, transparent 97%, black 100%)`;
  return { maskImage: mask, WebkitMaskImage: mask };
};

// Experience §13. GSAP only on these elements (no Motion). The 3D heart docks onto [data-seal]
// (story.ts buildLetter), so the seal *is* the heart.
export function Letter({ title, letter }: Props) {
  const { calm } = useMotionPrefs();
  const quiet = calm;
  const root = useRef<HTMLDivElement>(null);
  const opened = useRef(false);
  const [open, setOpen] = useState(false);
  const [wrong, setWrong] = useState(false);
  const passId = useId();
  const showOpen = open || quiet;
  const sealR = letter.passphrase ? 40 : 46;

  // Gentle float while sealed (paused in Calm / reduced motion).
  useGSAP(
    () => {
      if (quiet) return;
      gsap.to('[data-envelope]', {
        y: -6,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: root, dependencies: [quiet] },
  );

  const { contextSafe } = useGSAP({ scope: root });

  const unlock = useCallback(() => {
    if (opened.current) return;
    opened.current = true;
    if (quiet) {
      setOpen(true);
      return;
    }
    contextSafe(() => {
      gsap.killTweensOf('[data-envelope]');
      gsap
        .timeline({ onComplete: () => setOpen(true) })
        .to(
          '[data-seal-half="left"]',
          { x: -10, rotate: -12, autoAlpha: 0, duration: 0.3 },
          0,
        )
        .to(
          '[data-seal-half="right"]',
          { x: 10, rotate: 12, autoAlpha: 0, duration: 0.3 },
          0,
        )
        .call(() => void director.play('sealBreak'), [], 0)
        .to(
          '[data-flap]',
          { rotateX: -180, duration: 0.7, ease: 'power2.inOut' },
          0.2,
        )
        .fromTo(
          '[data-letter-card]',
          { autoAlpha: 0, y: 60, scale: 0.6 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' },
          0.7,
        )
        .to('[data-envelope]', { autoAlpha: 0, duration: 0.5 }, 0.9)
        .fromTo(
          '[data-letter-p]',
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.4,
            ease: 'power2.out',
          },
          1.4,
        );
    })();
  }, [quiet, contextSafe]);

  const { handlers } = useHold({
    duration: HOLD_MS,
    onProgress: () => {},
    onComplete: unlock,
    completeOnClick: quiet,
  });

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get('passphrase');
    // Soft lock only (Tech Stack §9.3): no storage, no network, no lockout.
    if (
      letter.passphrase &&
      typeof value === 'string' &&
      normalise(value) === normalise(letter.passphrase)
    ) {
      setWrong(false);
      unlock();
    } else setWrong(true);
  };

  return (
    <LoveSection id="letter" dawn={1} stage="200vh">
      <div ref={root} className="flex w-full flex-col items-center">
        <h2 id="letter-title" className={sectionTitle}>
          {title}
        </h2>

        {!showOpen && (
          <div
            data-envelope
            className="relative mt-12 aspect-[3/2] w-[80vw] max-w-md [perspective:900px]"
          >
            <div
              className="border-border bg-surface absolute inset-0 rounded-lg border shadow-sm"
              style={
                quiet
                  ? undefined
                  : sealHole(letter.passphrase ? '50% 50%' : '50% 60%', sealR)
              }
            />
            <div
              data-flap
              aria-hidden
              style={
                quiet || letter.passphrase
                  ? undefined
                  : sealHole('50% 100%', sealR)
              }
              className="bg-surface-elevated border-border absolute inset-x-0 top-0 h-3/5 origin-top border [backface-visibility:hidden] [clip-path:polygon(0_0,100%_0,50%_100%)]"
            />
            {letter.passphrase ? (
              <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
                <span aria-hidden data-seal className="size-20" />
              </div>
            ) : (
              <div className="absolute inset-x-0 top-[60%] flex -translate-y-1/2 justify-center">
                <button
                  type="button"
                  data-seal
                  {...handlers}
                  aria-describedby={`${passId}-hint`}
                  className="focus-ring relative size-24 touch-none rounded-full select-none"
                >
                  <span
                    data-seal-half="left"
                    aria-hidden
                    className="border-gold absolute inset-0 rounded-full border-3 [clip-path:inset(0_50%_0_0)]"
                  />
                  <span
                    data-seal-half="right"
                    aria-hidden
                    className="border-gold absolute inset-0 rounded-full border-3 [clip-path:inset(0_0_0_50%)]"
                  />
                  <span className="sr-only">Open the letter</span>
                </button>
              </div>
            )}
          </div>
        )}

        {!showOpen && !letter.passphrase && (
          <p id={`${passId}-hint`} className={cn(labelText, 'mt-6')}>
            {quiet ? 'Tap the seal to open.' : 'Hold the seal to open.'}
          </p>
        )}

        {!showOpen && letter.passphrase && (
          <form
            onSubmit={submit}
            className="mt-8 flex w-full max-w-sm flex-col gap-2"
          >
            <label htmlFor={passId} className={labelText}>
              Our word
            </label>
            <div className="flex gap-2">
              <Input
                id={passId}
                name="passphrase"
                autoComplete="off"
                aria-invalid={wrong || undefined}
                aria-describedby={`${passId}-msg`}
              />
              <Button type="submit">Open</Button>
            </div>
            <p
              id={`${passId}-msg`}
              aria-live="polite"
              className="text-small text-muted-foreground min-h-[1.5em] font-sans"
            >
              {wrong ? 'Not quite, try again' : ''}
            </p>
          </form>
        )}

        <article
          data-letter-card
          data-lenis-prevent
          aria-hidden={!showOpen}
          className={cn(
            'border-border bg-surface-elevated w-full max-w-2xl overflow-y-auto rounded-lg border p-8 text-left shadow-sm md:p-12',
            quiet
              ? 'mt-12 max-h-[70svh]'
              : 'absolute inset-x-4 top-[56%] mx-auto max-h-[64svh] w-auto -translate-y-1/2',
            !showOpen && 'invisible',
          )}
        >
          <div className="text-body mx-auto flex max-w-[60ch] flex-col gap-5 text-pretty break-words">
            {letter.paragraphs.map((p, i) => (
              <p key={i} data-letter-p>
                {p}
              </p>
            ))}
            <p data-letter-p className="mt-4 italic">
              {letter.signoff}
            </p>
          </div>
        </article>
      </div>
    </LoveSection>
  );
}
