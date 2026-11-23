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
  stageProgress,
} from '../engine/gallery-path';
import {
  clearFocusedFrame,
  galleryPhotos,
  galleryState,
  setFocusedFrame,
} from '../engine/gallery-state';
import { useLoveScroll } from '../engine/scroll-engine';
import { useQuiet } from '../engine/use-quiet';
import { GalleryInspect } from '../ui/gallery-controls';
import { GalleryLightbox } from '../ui/lightbox';
import { HiddenHeart } from '../ui/hidden-heart';
import { HIDDEN_GALLERY_TILE } from '../ui/hidden-heart-placements';
import { LoveSection, sectionTitle } from './love-section';
import { LovePhoto } from './love-photo';

type Props = {
  title: string;
  photos: PhotoRef[];
  galleryEnd?: PhotoRef;
  /** Recipient name for the entrance welcome. */
  name: string;
  welcome?: string;
  lines?: string[];
};

const DEFAULT_LINES = [
  'Twelve moments, hung with love',
  "Walk slowly, she's in every frame",
  'Tap a frame to step closer',
];

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
  lines = DEFAULT_LINES,
}: Props) {
  const { scrollTo, stop, start } = useLoveScroll();
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
    scrollTo(top + stageProgress(stops[k] ?? 0) * travel, { duration: 0.8 });
  };

  return (
    <LoveSection id="gallery" depth={0.5} stage="650vh" className="min-h-svh">
      <div className="pointer-events-none absolute inset-0 grid place-items-center px-4">
        <span
          aria-hidden
          className="bg-scrim/60 col-start-1 row-start-1 size-[min(80vw,36rem)] rounded-full blur-3xl"
        />
        <h2
          id="gallery-title"
          data-gallery-welcome
          className="text-display text-gold-text col-start-1 row-start-1 text-center text-balance opacity-0 drop-shadow-[0_0_24px_var(--love-aurora-gold)]"
        >
          {welcome ?? `Welcome, ${name}`}
          <span className="sr-only">. {title}</span>
        </h2>
        {lines.map((line) => (
          <p
            key={line}
            data-gallery-line
            aria-hidden
            className="text-h3 text-gold-text col-start-1 row-start-1 text-center font-serif text-balance italic opacity-0"
          >
            {line}
          </p>
        ))}
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
      <button
        type="button"
        data-gallery-exit
        onClick={() => scrollTo('#dance')}
        className="focus-ring glass text-foreground border-gold/40 hover:border-gold text-small absolute right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] flex h-11 items-center gap-2 rounded-full border px-5 font-sans opacity-0 transition-colors focus-visible:opacity-100"
      >
        <DoorOpenIcon aria-hidden className="text-gold size-4" />
        Exit gallery
      </button>

      {state.mode !== 'walk' && (
        <GalleryInspect state={state} photos={photos} />
      )}
    </LoveSection>
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
