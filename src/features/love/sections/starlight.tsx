'use client';

import { mulberry32 } from '../canvas/heart-geometry';
import type { LoveSiteConfig } from '../config';
import { useQuiet } from '../engine/use-quiet';
import { SkyConstellation } from '../ui/sky-constellation';
import { LoveSection, proseColumn } from './love-section';

const SKY_STARS = 8;

// Deterministic star field (same on server and client, no hydration drift).
const STARS = (() => {
  const rand = mulberry32(11);
  return Array.from({ length: 40 }, (_, i) => ({
    left: `${(rand() * 100).toFixed(2)}%`,
    top: `${(rand() * 85).toFixed(2)}%`,
    delay: `${(rand() * 4).toFixed(2)}s`,
    gold: i % 3 === 0,
  }));
})();

type Props = {
  line: string;
  hint: string;
  done: string;
  slug: string;
  memories: LoveSiteConfig['memories'];
};

// All-night theme + Our sky (F3): the line opens the stage under the aurora, then she joins eight
// memory stars into a heart (story.ts buildStarlight). Calm: the finished constellation and the list.
export function Starlight({ line, hint, done, slug, memories }: Props) {
  const quiet = useQuiet();
  const stars = memories.slice(0, SKY_STARS);
  return (
    <LoveSection
      id="starlight"
      depth={1}
      stage="220vh"
      className="flex min-h-svh flex-col items-center justify-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          data-love-aurora
          className="absolute -inset-x-1/4 top-0 h-2/3"
          style={{
            background:
              'radial-gradient(60% 50% at 30% 40%, var(--love-aurora-lav), transparent 70%), radial-gradient(50% 45% at 72% 55%, var(--love-aurora-gold), transparent 70%)',
          }}
        />
        {STARS.map((s, i) => (
          <span
            key={i}
            data-love-star
            className={`absolute size-0.5 rounded-full ${s.gold ? 'bg-gold' : 'bg-primary'}`}
            style={{ left: s.left, top: s.top, animationDelay: s.delay }}
          />
        ))}
      </div>
      <h2 id="starlight-title" className="sr-only">
        Our sky
      </h2>
      <p
        data-starlight-line
        className={`${proseColumn} text-body-lg text-gold-text relative italic ${quiet ? 'mb-8' : 'absolute top-[18svh] left-1/2 -translate-x-1/2'}`}
      >
        {line}
      </p>
      {stars.length >= 3 && (
        <SkyConstellation
          stars={stars}
          hint={hint}
          done={done}
          slug={slug}
          quiet={quiet}
        />
      )}
      {quiet && (
        <ol className="mt-8 grid gap-2 text-left font-sans text-sm">
          {stars.map((m) => (
            <li key={m.id}>
              <span className="text-gold-text">{m.date}</span> · {m.title}
            </li>
          ))}
        </ol>
      )}
    </LoveSection>
  );
}
