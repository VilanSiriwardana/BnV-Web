'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils/cn';

import {
  HIDDEN_HEART_IDS,
  hiddenHearts,
  usePersistedSet,
} from '../engine/hidden-hearts';
import { useQuiet } from '../engine/use-quiet';
import { TinyHeart } from '../sections/letter-ornaments';
import { gsap } from './afterglow-motion';

const SHOW_MS = 3000;

// Romance Additions F9 + blueprint 060: "3 of 5" beside the music toggle for 3 s after each find;
// a frosted pill that drops in, pops its heart and fills one more dot.
export function FoundChip({ slug }: { slug: string }) {
  const quiet = useQuiet();
  const count = usePersistedSet(hiddenHearts(slug)).length;
  const last = useRef(count);
  const chip = useRef<HTMLParagraphElement>(null);
  const heart = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = chip.current;
    if (count === last.current || !el) return;
    last.current = count;
    if (count === 0) return;
    const tl = gsap.timeline();
    if (quiet) tl.set(el, { autoAlpha: 1 });
    else
      tl.fromTo(
        el,
        { autoAlpha: 0, y: -8, filter: 'blur(4px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.45,
          ease: 'power3.out',
        },
      ).fromTo(
        heart.current,
        { scale: 0.6 },
        { scale: 1, duration: 0.5, ease: 'back.out(3)' },
        0.15,
      );
    tl.to(
      el,
      {
        autoAlpha: 0,
        y: quiet ? 0 : -6,
        duration: quiet ? 0.2 : 0.4,
        ease: 'power2.in',
      },
      SHOW_MS / 1000,
    );
    return () => {
      tl.kill();
      gsap.set(el, { autoAlpha: 0 });
    };
  }, [count, quiet]);

  return (
    <p
      ref={chip}
      role="status"
      aria-live="polite"
      style={{ opacity: 0, visibility: 'hidden' }}
      className="glass border-gold/40 text-small fixed top-4 right-17 z-20 flex h-11 items-center gap-2.5 rounded-full border px-4 font-sans shadow-[0_0_24px_-10px_var(--gold)]"
    >
      <span ref={heart} className="inline-grid">
        <TinyHeart className="text-gold size-3.5" />
      </span>
      {count > 0 && (
        <>
          <span>
            {count} of {HIDDEN_HEART_IDS.length} hidden hearts
          </span>
          <span aria-hidden className="flex gap-1">
            {HIDDEN_HEART_IDS.map((id, i) => (
              <span
                key={id}
                className={cn(
                  'size-1.5 rounded-full',
                  i < count ? 'bg-gold' : 'bg-gold/25',
                )}
              />
            ))}
          </span>
        </>
      )}
    </p>
  );
}
