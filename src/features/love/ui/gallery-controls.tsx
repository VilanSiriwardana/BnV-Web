'use client';

import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';

import type { PhotoRef } from '../config';
import type { DirectorState } from '../engine/gallery-director-core';
import { sendGallery } from '../engine/gallery-director';
import { GalleryNote } from './gallery-note';

const control =
  'focus-ring glass text-foreground grid size-11 place-items-center rounded-full border font-sans';
const SWIPE_PX = 50;
const TAP_PX = 10;

type Props = { state: DirectorState; photos: PhotoRef[] };

// FR-08: Back, Esc, tap outside, Previous / Next and swipe while a frame is open. The overlay
// catches every pointer and wheel event so the page never scrolls under the camera move.
export function GalleryInspect({ state, photos }: Props) {
  const overlay = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const down = useRef<{ x: number; y: number } | null>(null);
  const count = photos.length;
  const shown =
    state.mode === 'inspect'
      ? state.index
      : state.target >= 0
        ? state.target
        : state.index;
  const photo = photos[shown];

  useEffect(() => {
    const el = overlay.current;
    if (!el) return;
    const stopWheel = (e: WheelEvent) => e.preventDefault();
    el.addEventListener('wheel', stopWheel, { passive: false });
    back.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') sendGallery({ type: 'close' });
      else if (e.key === 'ArrowRight') sendGallery({ type: 'next' });
      else if (e.key === 'ArrowLeft') sendGallery({ type: 'prev' });
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      el.removeEventListener('wheel', stopWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div
      ref={overlay}
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label="Photo on the wall"
      className="pointer-events-auto fixed inset-0 z-20 touch-none select-none"
      onPointerDown={(e) => {
        down.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const start = down.current;
        down.current = null;
        if (!start || (e.target as Element).closest('button')) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy))
          sendGallery({ type: dx < 0 ? 'next' : 'prev' });
        else if (Math.hypot(dx, dy) < TAP_PX) sendGallery({ type: 'close' });
      }}
    >
      <p className="sr-only" aria-live="polite">
        {photo ? `Photo ${shown + 1} of ${count}: ${photo.alt}` : ''}
      </p>
      <div className="absolute inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-4 px-4">
        {state.mode === 'inspect' && <GalleryNote note={photo?.note} />}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous photo"
            className={control}
            onClick={() => sendGallery({ type: 'prev' })}
          >
            <ChevronLeftIcon aria-hidden className="size-5" />
          </button>
          <button
            ref={back}
            type="button"
            className="focus-ring glass text-foreground text-small flex h-11 items-center gap-2 rounded-full border px-5 font-sans"
            onClick={() => sendGallery({ type: 'close' })}
          >
            <XIcon aria-hidden className="size-4" />
            Back to the walk
          </button>
          <button
            type="button"
            aria-label="Next photo"
            className={control}
            onClick={() => sendGallery({ type: 'next' })}
          >
            <ChevronRightIcon aria-hidden className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
