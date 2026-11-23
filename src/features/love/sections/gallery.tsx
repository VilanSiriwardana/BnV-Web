'use client';

import { DoorOpenIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { PhotoRef } from '../config';
import gsap from 'gsap';
import type { DirectorState } from '../engine/gallery-director-core';
import {
  bindGalleryDirector,
  galleryDirectorState,
  onGalleryDirector,
  sendGallery,
} from '../engine/gallery-director';
import {
  createGalleryCurve,
  createSlots,
  inspectOrder,
  progressForSlot,
} from '../engine/gallery-path';
import type { RitualMode } from '../engine/gallery-ritual-core';
import {
  bindGalleryRitual,
  exitGalleryRitual,
  onGalleryRitual,
  ritualState,
} from '../engine/gallery-ritual';
import {
  clearFocusedFrame,
  galleryPhotos,
  galleryState,
  setFocusedFrame,
} from '../engine/gallery-state';
import { useLoveScroll } from '../engine/scroll-engine';
import { useQuiet } from '../engine/use-quiet';
import { GalleryInspect } from '../ui/gallery-controls';
import { GalleryRitualOverlay } from '../ui/gallery-ritual-overlay';
import { GalleryLightbox } from '../ui/lightbox';
import { HiddenHeart } from '../ui/hidden-heart';
import { HIDDEN_GALLERY_TILE } from '../ui/hidden-heart-placements';
import { TinyHeart } from './letter-ornaments';
import { LoveSection, sectionTitle } from './love-section';
import { LovePhoto } from './love-photo';

type Props = {
  title: string;
  photos: PhotoRef[];
  galleryEnd?: PhotoRef;
  /** Recipient name for the entrance welcome. */
  name: string;
  welcome?: string;
  /** Unlock ritual prompts: swipe, take the key, place it. */
  ritual?: [string, string, string];
};

// Phase 12: with motion the section is a tall sticky stage and the canvas draws the corridor walk
// (story.ts buildGallery). Quiet (Calm, reduced motion, static tier) keeps the masonry + lightbox.
export function Gallery(props: Props) {
  return useQuiet() ? (
    <GalleryMasonry {...props} />
  ) : (
    <GalleryWalkStage {...props} />
  );
}

function GalleryWalkStage({
  title,
  photos: gallery,
  galleryEnd,
  name,
  welcome,
  ritual: ritualPrompts,
}: Props) {
  const { scrollTo, stop, start } = useLoveScroll();
  const [welcomeWord, welcomeName] = splitWelcome(welcome, name);
  const photos = useMemo(
    () => galleryPhotos(gallery, galleryEnd),
    [gallery, galleryEnd],
  );
  const stops = useMemo(() => {
    const length = createGalleryCurve().getLength();
    return inspectOrder(createSlots(gallery.length)).map((slot) =>
      progressForSlot(slot, length),
    );
  }, [gallery.length]);
  const [state, setState] = useState<DirectorState>(galleryDirectorState);
  const [ritual, setRitual] = useState<RitualMode>(() => ritualState.mode);
  const twins = useRef<(HTMLButtonElement | null)[]>([]);
  const opener = useRef<HTMLElement | null>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      bindGalleryDirector({
        count: photos.length,
        io: { stop, start, scrollTo: (y) => scrollTo(y, { immediate: true }) },
      }),
    [photos.length, stop, start, scrollTo],
  );

  useEffect(
    () =>
      bindGalleryRitual({
        io: { stop, start, scrollTo: (y) => scrollTo(y, { immediate: true }) },
      }),
    [stop, start, scrollTo],
  );
  useEffect(() => onGalleryRitual(setRitual), []);

  const exit = () => {
    if (ritual !== 'idle' && ritual !== 'open') exitGalleryRitual();
    scrollTo('#dance');
  };

  // React state changes once per move, never per frame. Focus returns to the twin on close.
  useEffect(
    () =>
      onGalleryDirector((next) => {
        setState(next);
        if (next.mode === 'walk' && opener.current) {
          opener.current.focus({ preventScroll: true });
          opener.current = null;
        }
      }),
    [],
  );

  // Focus ring follows the projected frame (no React state per frame), as in memories.tsx.
  useEffect(() => {
    const tick = () => {
      const el = ring.current;
      if (!el) return;
      const s = galleryState.screen[galleryState.focused];
      if (!s?.visible || state.mode !== 'walk') {
        el.style.opacity = '0';
        return;
      }
      const size = Math.max(44, s.r * 2 + 16);
      el.style.opacity = '1';
      el.style.width = el.style.height = `${size}px`;
      el.style.transform = `translate(${s.x - size / 2}px, ${s.y - size / 2}px)`;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      clearFocusedFrame();
    };
  }, [state.mode]);

  const focusTwin = (k: number) => {
    setFocusedFrame(k);
    if (state.mode !== 'walk') return;
    const section = document.getElementById('gallery');
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    scrollTo(top + (stops[k] ?? 0) * travel, { duration: 0.8 });
  };

  return (
    <LoveSection id="gallery" depth={0.5} stage="550vh" className="min-h-svh">
      <div className="pointer-events-none absolute inset-0 grid place-items-center px-4">
        <div
          data-gallery-welcome
          className="relative flex flex-col items-center opacity-0 [perspective:600px]"
        >
          <span
            aria-hidden
            data-welcome-bloom
            className="absolute top-1/2 left-1/2 size-[min(80vw,34rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--love-aurora-gold)_45%,transparent),transparent_65%)] opacity-0 blur-2xl"
          />
          <h2
            id="gallery-title"
            className="text-gold-text relative flex flex-col items-center text-center drop-shadow-[0_0_24px_var(--love-aurora-gold)]"
          >
            <span className="flex items-center gap-3 md:gap-5">
              <WelcomeFlourish side="left" />
              <span
                data-welcome-word
                className="font-display text-small md:text-h3 tracking-[0.4em] uppercase"
              >
                {welcomeWord}
              </span>
              <WelcomeFlourish side="right" />
            </span>
            <span className="relative mt-1 pr-2">
              <span
                data-welcome-name
                className="font-body text-display block italic"
              >
                {welcomeName}
              </span>
              <span
                aria-hidden
                data-welcome-shine
                className="font-body text-display love-foil pointer-events-none absolute inset-0 pr-2 italic"
              >
                {welcomeName}
              </span>
            </span>
            <span className="sr-only">. {title}</span>
          </h2>
          <span aria-hidden data-welcome-dot className="mt-2">
            <TinyHeart className="text-gold size-4" />
          </span>
        </div>
      </div>

      <ul className="sr-only">
        {photos.map((p, k) => (
          <li key={`${p.src}-${k}`}>
            <button
              type="button"
              ref={(el) => {
                twins.current[k] = el;
              }}
              onFocus={() => focusTwin(k)}
              onBlur={() => {
                clearFocusedFrame(k);
              }}
              onClick={(e) => {
                opener.current = e.currentTarget;
                sendGallery({ type: 'open', index: k });
              }}
            >
              {k === photos.length - 1
                ? `Open the portrait at the end of the hall: ${p.alt}`
                : `Open photo ${k + 1} of ${gallery.length}: ${p.alt}`}
            </button>
          </li>
        ))}
      </ul>
      <div
        ref={ring}
        aria-hidden
        className="ring-ring pointer-events-none fixed top-0 left-0 rounded-md opacity-0 ring-2 transition-opacity"
      />

      <HiddenHeart id="gallery" className="absolute right-6 bottom-24" />
      {(ritual === 'idle' || ritual === 'open') && (
        <button
          type="button"
          data-gallery-exit
          onClick={exit}
          className="focus-ring glass text-foreground border-gold/40 hover:border-gold text-small absolute right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] flex h-11 items-center gap-2 rounded-full border px-5 font-sans transition-colors"
        >
          <DoorOpenIcon aria-hidden className="text-gold size-4" />
          Exit gallery
        </button>
      )}

      {ritual !== 'idle' && ritual !== 'open' && (
        <GalleryRitualOverlay
          mode={ritual}
          prompts={ritualPrompts}
          onExit={exit}
        />
      )}
      {state.mode !== 'walk' && (
        <GalleryInspect state={state} photos={photos} />
      )}
    </LoveSection>
  );
}

/** "Welcome, Buwi" → ["Welcome", "Buwi"]; a custom line without a comma stays whole. */
function splitWelcome(welcome: string | undefined, name: string) {
  if (!welcome) return ['Welcome', name] as const;
  const i = welcome.indexOf(',');
  return i < 0
    ? (['', welcome] as const)
    : ([welcome.slice(0, i).trim(), welcome.slice(i + 1).trim()] as const);
}

// Gilt flourish beside "WELCOME": a scroll that draws in from the centre (DrawSVG).
function WelcomeFlourish({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 24"
      className={`text-gold h-4 w-16 md:h-6 md:w-28 ${side === 'left' ? '-scale-x-100' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path
        data-welcome-flourish
        d="M2 12 H58 C70 12 74 4 84 4 C94 4 96 14 88 16 C82 17 80 10 86 9 M58 12 C72 12 78 20 92 20 C104 20 110 12 118 12"
      />
    </svg>
  );
}

function GalleryMasonry({ title, photos }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <LoveSection id="gallery" depth={0.5}>
      <h2 id="gallery-title" className={sectionTitle}>
        {title}
      </h2>
      <ul className="mt-12 w-full columns-2 gap-4 md:columns-3">
        {photos.map((p, i) => (
          <li
            key={p.src}
            data-love-tile
            className="border-gold/30 bg-surface-elevated relative mb-4 break-inside-avoid overflow-hidden rounded-lg border p-2"
          >
            {i === HIDDEN_GALLERY_TILE && <HiddenHeart id="gallery" />}
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Open photo ${i + 1} of ${photos.length}: ${p.alt}`}
              className="group focus-ring relative block w-full cursor-zoom-in overflow-hidden rounded-md"
            >
              <span data-tile-img className="block">
                <LovePhoto
                  photo={p}
                  sizes="(min-width: 768px) 33vw, 50vw"
                  priority={i < 3}
                  className="h-auto w-full rounded-md transition-transform duration-250 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              </span>
              <span
                aria-hidden
                className="from-scrim/70 text-small text-background pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent px-3 pt-8 pb-2 text-left font-sans opacity-0 transition-opacity duration-250 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {p.alt}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <GalleryLightbox
        photos={photos}
        index={index}
        onClose={() => setIndex(null)}
      />
    </LoveSection>
  );
}
