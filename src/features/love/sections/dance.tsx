'use client';

import { DanceReelFrame } from './dance-reel';
import { LoveSection, proseColumn, sectionTitle } from './love-section';

type Props = { title: string; line: string };

// Blueprint 082: the couple clip (sections/dance-reel.tsx) plays under the title.
export function Dance({ title, line }: Props) {
  return (
    <LoveSection id="dance" depth={0.5} stage="400vh">
      <h2 id="dance-title" className={sectionTitle}>
        {title}
      </h2>
      <p data-dance-line className={`${proseColumn} mt-4 italic`}>
        {line}
      </p>
      <DanceReelFrame />
    </LoveSection>
  );
}
