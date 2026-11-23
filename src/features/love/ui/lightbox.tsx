'use client';

import { useEffect } from 'react';

import { Lightbox } from '@/components/ui/lightbox';

import type { PhotoRef } from '../config';
import { useLoveScroll } from '../engine/scroll-engine';

type Props = {
  photos: PhotoRef[];
  index: number | null;
  onClose: () => void;
};

// Experience §11: the shop's shared Lightbox (Radix focus trap, Esc, arrow keys, swipe) with
// Lenis stopped while open, mirroring memory-dialog.tsx.
export function GalleryLightbox({ photos, index, onClose }: Props) {
  const { stop, start } = useLoveScroll();
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    stop();
    return () => start();
  }, [open, stop, start]);

  return (
    <Lightbox
      key={index ?? -1}
      images={photos.map(({ src, alt, note }) => ({ src, alt, caption: note }))}
      open={open}
      onOpenChange={(o) => !o && onClose()}
      startIndex={index ?? 0}
      label="Photo viewer"
    />
  );
}
