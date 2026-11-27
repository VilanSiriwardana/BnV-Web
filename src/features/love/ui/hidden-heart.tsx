'use client';

import { createContext, useContext } from 'react';

import { cn } from '@/lib/utils/cn';

import { playChime } from '../engine/chime';
import { exitGalleryRitual } from '../engine/gallery-ritual';
import { director } from '../engine/heart-director';
import {
  type HiddenHeartId,
  hiddenHearts,
  usePersistedSet,
} from '../engine/hidden-hearts';
import { TinyHeart } from '../sections/letter-ornaments';
import { gsap, sparkBurst } from './afterglow-motion';
import { HIDDEN_HEART_PLACEMENTS } from './hidden-heart-placements';

// The slug reaches section mounts without threading a prop through every section.
export const LoveSlugContext = createContext('');

// Romance Additions F9: a tiny real button tucked into a section; found once per device.
export function HiddenHeart({
  id,
  className,
}: {
  id: HiddenHeartId;
  className?: string;
}) {
  const slug = useContext(LoveSlugContext);
  const set = hiddenHearts(slug);
  const found = usePersistedSet(set).includes(id);

  return (
    <button
      type="button"
      data-hidden-heart={id}
      aria-label="A tiny hidden heart"
      aria-pressed={found}
      onClick={() => {
        if (found) return;
        set.add(id);
        playChime(set.count());
        void director.play('hiddenFound');
      }}
      className={cn(
        'focus-ring absolute z-10 grid size-11 place-items-center rounded-full',
        className ?? HIDDEN_HEART_PLACEMENTS[id],
      )}
    >
      <TinyHeart
        className={cn(
          'size-6 md:size-7',
          found ? 'text-gold opacity-80' : 'text-gold-text love-hidden-twinkle',
        )}
      />
    </button>
  );
}

type ScrollTo = (
  target: HTMLElement,
  opts: { offset?: number; duration?: number; force?: boolean },
) => void;

/** Blueprint 085: a hint chip glides to its heart, then the heart pulses so she spots it. */
export function focusHiddenHeart(id: HiddenHeartId, scrollTo: ScrollTo) {
  if (id === 'gallery') exitGalleryRitual();
  const el = Array.from(
    document.querySelectorAll<HTMLElement>(`[data-hidden-heart="${id}"]`),
  ).find((e) => e.offsetParent !== null);
  if (!el) return;
  scrollTo(el, {
    offset: -window.innerHeight * 0.4,
    duration: 1.6,
    force: true,
  });
  gsap.delayedCall(1.7, () => {
    gsap.fromTo(
      el,
      { scale: 1 },
      { scale: 1.6, repeat: 5, yoyo: true, duration: 0.3, ease: 'sine.inOut' },
    );
    sparkBurst(el);
  });
}
