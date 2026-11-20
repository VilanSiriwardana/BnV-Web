'use client';

import { useQuiet } from '../engine/use-quiet';
import { pad2, ReasonsRing } from '../ui/reasons-ring';
import { LoveSection, proseColumn, sectionTitle } from './love-section';

type Props = { title: string; hint: string; items: string[] };

// Romance Additions F4: twelve reasons on a ring (story.ts buildReasons turns it with scroll).
// Calm and static: a plain list.
export function Reasons({ title, hint, items }: Props) {
  const quiet = useQuiet();
  if (items.length === 0) return null;
  return (
    <LoveSection id="reasons" depth={1} stage="250vh">
      <h2 id="reasons-title" className={sectionTitle}>
        {title}
      </h2>
      <p className={`${proseColumn} mt-3 italic`}>{hint}</p>
      {quiet ? (
        <ol className="mt-10 grid w-full max-w-3xl gap-4 text-left md:grid-cols-2">
          {items.map((text, i) => (
            <li
              key={i}
              className="bg-surface border-gold/30 rounded-lg border p-5"
            >
              <span className="text-gold-text font-sans text-xs tracking-[0.2em]">
                {pad2(i)}
              </span>
              <p className="font-body mt-2 text-[20px] leading-snug">{text}</p>
            </li>
          ))}
        </ol>
      ) : (
        <ReasonsRing items={items} />
      )}
    </LoveSection>
  );
}
