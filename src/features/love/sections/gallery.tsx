'use client';

import { useState } from 'react';

import type { PhotoRef } from '../config';
import { GalleryLightbox } from '../ui/lightbox';
import { LovePhoto } from './love-photo';
import { LoveSection, sectionTitle } from './love-section';

type Props = { title: string; photos: PhotoRef[] };

// Experience §11. Reveal and parallax live in story.ts buildGallery (GSAP); hover is CSS only.
export function Gallery({ title, photos }: Props) {
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
            className="border-gold/30 bg-surface-elevated mb-4 break-inside-avoid overflow-hidden rounded-lg border p-2"
          >
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
