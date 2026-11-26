'use client';

import gsap from 'gsap';
import { useEffect, useState } from 'react';

import { bookPhase, bookProgressFor, reasons } from '../engine/reasons-state';
import { useLoveScroll } from '../engine/scroll-engine';
import { useTier } from '../engine/tier-provider';
import { useQuiet } from '../engine/use-quiet';
import { pad2, ReasonsRing } from '../ui/reasons-ring';
import { LoveSection, proseColumn, sectionTitle } from './love-section';

type Props = { title: string; hint: string; items: string[] };

// Romance Additions F4: twelve reasons. Blueprint 061: a 3D love book (canvas/reasons-book.tsx)
// turned by scroll; low/static tiers keep the CSS ring; calm and static: a plain list.
export function Reasons({ title, hint, items }: Props) {
  const quiet = useQuiet();
  const { tier } = useTier();
  if (items.length === 0) return null;
  const book = !quiet && tier !== 'low' && tier !== 'static';
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
      ) : book ? (
        <ReasonsBookStage items={items} />
      ) : (
        <ReasonsRing items={items} />
      )}
    </LoveSection>
  );
}

// The book is drawn by the canvas; this keeps the room for it, the page count, and a
// keyboard/screen-reader path (gallery twin pattern: focus scrolls to that page).
function ReasonsBookStage({ items }: { items: string[] }) {
  const { scrollTo } = useLoveScroll();
  const [page, setPage] = useState(0);
  const n = items.length;

  useEffect(() => {
    let last = -1;
    const tick = () => {
      const p = bookPhase(reasons.progress, n).page;
      if (p !== last) setPage((last = p));
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [n]);

  const go = (i: number) => {
    const section = document.getElementById('reasons');
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    scrollTo(top + bookProgressFor(i, n) * travel, { duration: 0.8 });
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div aria-hidden className="h-[min(68svh,38rem)] w-full" />
      {/* Blueprint 065: no count until the cover has opened. */}
      <p
        aria-live="polite"
        className={`text-gold-text mt-4 font-sans text-sm tracking-[0.2em] transition-opacity duration-500 ${page === 0 ? 'opacity-0' : ''}`}
      >
        {pad2(Math.max(0, page - 1))} / {pad2(n - 1)}
      </p>
      <ol className="sr-only">
        {items.map((text, i) => (
          <li key={i}>
            <button type="button" onFocus={() => go(i)} onClick={() => go(i)}>
              {pad2(i)}. {text}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
