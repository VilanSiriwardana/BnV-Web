'use client';

import Image from 'next/image';

import { imageQuality } from '@/config/images';

import { useQuiet } from '../engine/use-quiet';
import { useTier } from '../engine/tier-provider';
import { LoveSection, proseColumn, sectionTitle } from './love-section';

type Props = { title: string; line: string };

const stillWidth = 'mt-8 w-[min(88vw,52vh)] md:w-[min(60vw,62vh)]';

// Experience §19.6: the particle couple (canvas/dance-duo.tsx) is scrubbed by story.ts buildDance.
// Blueprint 079: Calm, reduced motion and the low/static tiers show the dip still instead.
export function Dance({ title, line }: Props) {
  const quiet = useQuiet();
  const { tier } = useTier();
  const still = quiet || tier === 'low' || tier === 'static';

  return (
    <LoveSection id="dance" depth={0.5} stage="250vh">
      <h2 id="dance-title" className={sectionTitle}>
        {title}
      </h2>
      <p data-dance-line className={`${proseColumn} mt-4 italic`}>
        {line}
      </p>
      {still && (
        <Image
          src="/dance-reel/posters/dip.webp"
          alt=""
          aria-hidden
          width={768}
          height={960}
          sizes="(min-width: 768px) 60vw, 88vw"
          quality={imageQuality.default}
          className={stillWidth}
        />
      )}
    </LoveSection>
  );
}
