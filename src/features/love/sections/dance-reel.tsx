'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';

import { imageQuality } from '@/config/images';

import manifest from '../canvas/dance-reel-manifest.json';
import { useQuiet } from '../engine/use-quiet';
const { width, height } = manifest.desktop;
// Colour-matched (opaque) frames only: the remapped backdrop fades into the page at every edge.
const edgeFade = [
  'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
  'linear-gradient(to bottom, transparent, #000 10%, #000 90%, transparent)',
].join(', ');
const frameStyle: CSSProperties = {
  aspectRatio: `${width} / ${height}`,
  ...(!manifest.alpha && {
    maskImage: edgeFade,
    maskComposite: 'intersect',
    WebkitMaskImage: edgeFade,
    WebkitMaskComposite: 'source-in',
  }),
};
// Blueprint 081: matted frames stand on a soft spotlight pool so the couple stay grounded.
const floorStyle: CSSProperties = {
  background: [
    'radial-gradient(closest-side, color-mix(in oklab, var(--night-surface-elevated) 85%, transparent), transparent)',
    'radial-gradient(closest-side, var(--love-aurora-lav), transparent)',
  ].join(', '),
};

// Blueprint 082: the couple clip inside the Dance section, scrubbed by story.ts buildDance.
// Calm, reduced motion and the static tier show the dip still instead.
export function DanceReelFrame() {
  const quiet = useQuiet();

  return (
    <div
      data-dance-reel-frame
      style={frameStyle}
      className="relative mt-6 w-[min(88vw,46svh)] md:w-[min(60vw,52svh)]"
    >
      {manifest.alpha && (
        <div
          aria-hidden
          data-dance-reel-floor
          style={floorStyle}
          className="absolute inset-x-[8%] bottom-0 h-[16%] rounded-[50%]"
        />
      )}
      <Image
        data-dance-reel-poster
        src={
          quiet
            ? '/dance-reel/posters/reel-dip.webp'
            : '/dance-reel/posters/reel-start.webp'
        }
        alt=""
        aria-hidden
        fill
        sizes="(min-width: 768px) 52vh, 88vw"
        quality={imageQuality.default}
        className="object-contain"
      />
      {!quiet && (
        <canvas
          data-dance-reel
          role="img"
          aria-label="The couple dance: a spin, then a gentle dip"
          className="absolute inset-0 size-full"
        />
      )}
    </div>
  );
}
