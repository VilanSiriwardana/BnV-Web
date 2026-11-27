'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';

import { imageQuality } from '@/config/images';

import manifest from '../canvas/dance-reel-manifest.json';
import { useQuiet } from '../engine/use-quiet';
import { LoveSection } from './love-section';

type Props = { title: string };

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

// Blueprint 080: the couple clip after the particle Dance, scrubbed by story.ts buildDanceReel.
// Calm, reduced motion and the static tier show the dip still instead.
export function DanceReel({ title }: Props) {
  const quiet = useQuiet();

  return (
    <LoveSection id="dance-reel" depth={0.5} stage="200vh">
      <h2 id="dance-reel-title" className="sr-only">
        {title}
      </h2>
      <div
        data-dance-reel-frame
        style={frameStyle}
        className="relative w-[min(92vw,62vh)] md:w-[min(60vw,64vh)]"
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
          sizes="(min-width: 768px) 60vw, 88vw"
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
    </LoveSection>
  );
}
