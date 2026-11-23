'use client';

import type { CSSProperties } from 'react';

import { TinyHeart } from '../sections/letter-ornaments';

const HEARTS = [
  { left: '8%', delay: '0s', size: 'size-3' },
  { left: '26%', delay: '0.5s', size: 'size-4' },
  { left: '50%', delay: '0.2s', size: 'size-3' },
  { left: '72%', delay: '0.8s', size: 'size-4' },
  { left: '90%', delay: '0.35s', size: 'size-3' },
];

// FR-09: the tiny gold note under an opened photo, with hearts drifting up. Empty note → hearts only.
// The scrim keeps the gold text above 4.5:1 over the dimmed corridor.
export function GalleryNote({ note }: { note?: string }) {
  return (
    <div className="relative mx-auto flex min-h-10 w-fit max-w-[min(90vw,32rem)] items-center justify-center">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-8 bottom-0"
      >
        {HEARTS.map((h) => (
          <TinyHeart
            key={h.left}
            className={`love-note-heart text-gold absolute bottom-0 ${h.size}`}
            style={{ left: h.left, animationDelay: h.delay } as CSSProperties}
          />
        ))}
      </span>
      {note?.trim() && (
        <p className="bg-scrim/70 text-gold-text text-small rounded-full px-4 py-1.5 font-serif text-balance italic">
          {note}
        </p>
      )}
    </div>
  );
}
