'use client';

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
import {
  clearFocusedFrame,
  galleryPhotos,
  galleryState,
  setFocusedFrame,
  setGalleryComfort,
} from '../engine/gallery-state';
import { useLoveScroll } from '../engine/scroll-engine';
import { useQuiet } from '../engine/use-quiet';
import { GalleryInspect } from '../ui/gallery-controls';
import { GalleryLightbox } from '../ui/lightbox';
import { HiddenHeart } from '../ui/hidden-heart';
import { HIDDEN_GALLERY_TILE } from '../ui/hidden-heart-placements';
import { labelText, LoveSection, sectionTitle } from './love-section';
import { LovePhoto } from './love-photo';

type Props = { title: string; photos: PhotoRef[]; galleryEnd?: PhotoRef };

const COMFORT_KEY = 'love:gallery-comfort';

// Phase 12: with motion the section is a tall sticky stage and the canvas draws the corridor walk
// (story.ts buildGallery). Quiet (Calm, reduced motion, static tier) keeps the masonry + lightbox.
export function Gallery(props: Props) {
  return useQuiet() ? (
    <GalleryMasonry {...props} />
  ) : (
    <GalleryWalkStage {...props} />
  );
}

function GalleryWalkStage({ title, photos: gallery, galleryEnd }: Props) {
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
  const [opened, setOpened] = useState(false);
  const [comfort, setComfort] = useState(false);
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
        if (next.mode !== 'walk') setOpened(true);
        else if (opener.current) {
          opener.current.focus({ preventScroll: true });
          opener.current = null;
        }
      }),
    [],
  );

  // Comfort control (FR-15): steady camera, independent of Calm mode. Session-scoped like love:calm.
  useEffect(() => {
    try {
      const on = sessionStorage.getItem(COMFORT_KEY) === '1';
      setGalleryComfort(on);
      setComfort(on); // eslint-disable-line react-hooks/set-state-in-effect
    } catch {}
  }, []);
  const toggleComfort = () => {
    const on = !comfort;
    setGalleryComfort(on);
    setComfort(on);
    try {
      sessionStorage.setItem(COMFORT_KEY, on ? '1' : '0');
    } catch {}
  };

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
      <h2
        id="gallery-title"
        data-gallery-intro
        className={`${sectionTitle} pointer-events-none`}
      >
        {title}
      </h2>
      {!opened && (
        <p
          data-gallery-intro
          className={`${labelText} pointer-events-none mt-3`}
          aria-hidden
        >
          Walk on, and tap a frame to look closer
        </p>
      )}

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
      <div className="absolute inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-2">
        <button
          type="button"
          aria-pressed={comfort}
          onClick={toggleComfort}
          className="focus-ring text-small text-muted-foreground hover:text-foreground aria-pressed:text-gold-text rounded-md px-3 py-2 font-sans"
        >
          Steady camera
        </button>
        <button
          type="button"
          onClick={() => scrollTo('#dance')}
          className="focus-ring text-small text-muted-foreground hover:text-foreground rounded-md px-3 py-2 font-sans"
        >
          Skip gallery
        </button>
      </div>

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
