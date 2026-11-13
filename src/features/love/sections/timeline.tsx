'use client';

import { useEffect, useRef } from 'react';

import { focusRing } from '@/components/ui/styles';
import { cn } from '@/lib/utils/cn';

import type { LoveSiteConfig } from '../config';
import { useMotionPrefs } from '../engine/motion-prefs';
import { useLoveScroll } from '../engine/scroll-engine';
import { useTier } from '../engine/tier-provider';
import {
  NODE_FRACTIONS,
  nodeSectionProgress,
} from '../engine/timeline-progress';
import { LovePhoto } from './love-photo';
import { LoveSection, labelText, sectionTitle } from './love-section';

type Item = LoveSiteConfig['timeline'][number];
type Props = { title: string; items: Item[] };

// Thread paths in a 0–100 box stretched to the stage (vector-effect keeps the stroke even).
const DESKTOP_PATH = 'M 3 58 C 18 22, 34 22, 50 50 S 82 78, 97 42';
const MOBILE_PATH = 'M 9 10 C 14 22, 4 34, 9 46 S 13 56, 9 60';
const MOBILE_QUERY = '(max-width: 767px)';

export function Timeline({ title, items }: Props) {
  const { calm } = useMotionPrefs();
  const { tier } = useTier();
  const motion = !calm && tier !== 'static';

  return (
    <LoveSection id="timeline" dawn={0} stage="400vh">
      <h2 id="timeline-title" className={sectionTitle}>
        {title}
      </h2>
      {motion ? (
        <ThreadStage items={items.slice(0, NODE_FRACTIONS.length)} />
      ) : (
        <StaticList items={items} />
      )}
    </LoveSection>
  );
}

function ThreadStage({ items }: { items: Item[] }) {
  const layer = useRef<HTMLDivElement>(null);
  const { scrollTo } = useLoveScroll();

  // Node and card positions follow the active path; recomputed on resize.
  useEffect(() => {
    const el = layer.current;
    if (!el) return;
    const place = () => {
      const mobile = window.matchMedia(MOBILE_QUERY).matches;
      const path = el.querySelector<SVGPathElement>(
        `[data-thread="${mobile ? 'mobile' : 'desktop'}"]`,
      );
      if (!path) return;
      const len = path.getTotalLength();
      const nodes = el.querySelectorAll<HTMLElement>('[data-node]');
      const cards = el.querySelectorAll<HTMLElement>('[data-card]');
      nodes.forEach((node, i) => {
        const pt = path.getPointAtLength(NODE_FRACTIONS[i] * len);
        node.style.left = `${pt.x}%`;
        node.style.top = `${pt.y}%`;
        const card = cards[i];
        if (!card) return;
        card.style.left = mobile
          ? ''
          : `clamp(1rem, calc(${pt.x}% - 10rem), calc(100% - 21rem))`;
        card.style.top = !mobile && i % 2 ? `calc(${pt.y}% + 4.5rem)` : '';
        card.style.bottom =
          !mobile && i % 2 === 0 ? `calc(${100 - pt.y}% + 4.5rem)` : '';
      });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, []);

  const goTo = (i: number) => {
    const section = document.getElementById('timeline');
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    scrollTo(top + nodeSectionProgress(i) * travel + 2, { duration: 1.2 });
  };

  const thread = 'stroke-gold fill-none';
  return (
    <div ref={layer} className="absolute inset-0">
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 hidden size-full md:block"
      >
        <path
          data-thread="desktop"
          d={DESKTOP_PATH}
          className={thread}
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full md:hidden"
      >
        <path
          data-thread="mobile"
          d={MOBILE_PATH}
          className={thread}
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <ol className="contents">
        {items.map((t, i) => (
          <li key={t.id} className="contents">
            <button
              type="button"
              data-node
              data-ui
              aria-label={`${t.date}: ${t.title}`}
              onClick={() => goTo(i)}
              className={cn(
                'group absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full',
                focusRing,
              )}
            >
              <span
                data-node-dot
                className="border-gold bg-background group-data-[lit]:bg-gold size-3.5 rounded-full border-2 transition-colors"
              />
              <span
                aria-hidden
                className={cn(
                  labelText,
                  'absolute top-full mt-1 whitespace-nowrap max-md:top-1/2 max-md:left-full max-md:mt-0 max-md:ml-1 max-md:-translate-y-1/2',
                )}
              >
                {t.date}
              </span>
            </button>
            <article
              data-card
              data-featured={t.featured ? 'true' : undefined}
              className={cn(
                'border-border bg-surface invisible absolute flex gap-4 overflow-hidden rounded-lg border p-4 text-left opacity-0',
                'max-md:right-4 max-md:bottom-6 max-md:left-14 max-md:max-h-[38svh] md:w-80',
                t.featured && 'border-gold',
              )}
            >
              {t.photo && (
                <LovePhoto
                  photo={t.photo}
                  sizes="6rem"
                  className="size-20 shrink-0 rounded-md object-cover md:size-24"
                />
              )}
              <div className="min-w-0">
                <p className={labelText}>{t.date}</p>
                <h3 className="text-h3 mt-1 break-words">{t.title}</h3>
                <p className="text-body mt-1 line-clamp-4 text-pretty">
                  {t.text}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StaticList({ items }: { items: Item[] }) {
  return (
    <ol className="border-gold mt-12 flex w-full max-w-2xl flex-col gap-8 border-l-2 pl-6 text-left md:pl-10">
      {items.map((t) => (
        <li
          key={t.id}
          className={cn(
            'border-border bg-surface relative rounded-lg border p-5',
            t.featured &&
              'border-gold shadow-[0_0_32px_-6px_var(--color-gold)]',
          )}
        >
          <span
            aria-hidden
            className="bg-gold absolute top-6 -left-[calc(1.5rem+7px)] size-3 rounded-full md:-left-[calc(2.5rem+7px)]"
          />
          {t.photo && (
            <LovePhoto
              photo={t.photo}
              sizes="(min-width: 768px) 40rem, 100vw"
              className="mb-4 aspect-[16/9] w-full rounded-md object-cover"
            />
          )}
          <p className={labelText}>{t.date}</p>
          <h3 className="text-h3 mt-1 break-words">{t.title}</h3>
          <p className="text-body mt-2 text-pretty">{t.text}</p>
        </li>
      ))}
    </ol>
  );
}
