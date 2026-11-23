'use client';

import { Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { focusRing } from '@/components/ui/styles';
import { cn } from '@/lib/utils/cn';

import type { LoveSiteConfig } from '../config';
import { useQuiet } from '../engine/use-quiet';
import { QuietHeart } from '../ui/static-heart';
import { useLoveScroll } from '../engine/scroll-engine';
import {
  NODE_FRACTIONS,
  nodeSectionProgress,
} from '../engine/timeline-progress';
import { LovePhoto } from './love-photo';
import { LoveSection, labelText, sectionTitle } from './love-section';
import { HiddenHeart } from '../ui/hidden-heart';
import { NoteDialog, type NoteContent } from '../ui/note-dialog';

type Item = LoveSiteConfig['timeline'][number];
type Props = { title: string; items: Item[] };

// Thread paths in a 0–100 box stretched to the stage (vector-effect keeps the stroke even).
// Desktop: a spiral winding inward to the birthdate; mobile: a tall winding helix.
const toPath = (pts: [number, number][]) =>
  pts
    .map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(' ');
const STEPS = 160;
const DESKTOP_PATH = toPath(
  Array.from({ length: STEPS + 1 }, (_, i) => {
    const t = i / STEPS;
    const a = Math.PI + t * Math.PI * 2 * 1.75;
    const r = 1 - 0.82 * t;
    return [50 + Math.cos(a) * 44 * r, 52 + Math.sin(a) * 38 * r];
  }),
);
// Mobile: a calm serpentine whose crests land alternately left/right of centre at each node,
// keeping amplitude clear of the edges so the date labels sit below without crowding the thread.
const MOBILE_PATH = toPath(
  Array.from({ length: STEPS + 1 }, (_, i) => {
    const t = i / STEPS;
    return [50 + 28 * Math.sin(t * Math.PI * 5), 6 + t * 54];
  }),
);
const MOBILE_QUERY = '(max-width: 767px)';

export function Timeline({ title, items }: Props) {
  const motion = !useQuiet();

  return (
    <LoveSection id="timeline" depth={1} stage="400vh">
      <QuietHeart className="mb-4 size-10" />
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
  const [active, setActive] = useState<NoteContent | null>(null);
  const [returnTo, setReturnTo] = useState<HTMLElement | null>(null);
  const open = (t: Item, el: HTMLElement) => {
    setReturnTo(el);
    setActive({
      label: t.date,
      title: t.title,
      paragraphs: [t.text],
      photo: t.photo,
    });
  };

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
    <div
      ref={layer}
      className="absolute inset-0 max-md:top-[clamp(8rem,24svh,11rem)]"
    >
      <HiddenHeart id="timeline" />
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
              onClick={(e) =>
                e.currentTarget.hasAttribute('data-chip')
                  ? open(t, e.currentTarget)
                  : goTo(i)
              }
              className={cn(
                'group absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full',
                focusRing,
              )}
            >
              <span
                aria-hidden
                className="border-gold bg-surface pointer-events-none absolute bottom-full mb-1 grid size-11 scale-50 place-items-center overflow-hidden rounded-full border-2 opacity-0 shadow-[0_0_14px_-2px_var(--gold)] transition-[opacity,scale] duration-500 ease-out group-data-[chip]:pointer-events-auto group-data-[chip]:scale-100 group-data-[chip]:opacity-100 group-hover:group-data-[chip]:scale-110"
              >
                {t.photo ? (
                  <LovePhoto
                    photo={t.photo}
                    sizes="2.75rem"
                    className="size-full object-cover"
                  />
                ) : (
                  <Heart className="text-gold fill-gold/40 size-4" />
                )}
              </span>
              <span
                data-node-dot
                className="border-gold bg-background group-data-[lit]:bg-gold size-3.5 rounded-full border-2 transition-colors"
              />
              <span
                aria-hidden
                className={cn(
                  labelText,
                  'absolute top-full mt-1 whitespace-nowrap max-md:left-1/2 max-md:mt-1.5 max-md:-translate-x-1/2 max-md:text-[0.625rem] max-md:tracking-[0.12em]',
                )}
              >
                {t.date}
              </span>
            </button>
            <article
              data-card
              data-featured={t.featured ? 'true' : undefined}
              className={cn(
                'border-gold/25 bg-surface invisible absolute flex gap-4 overflow-hidden rounded-lg border p-4 text-left opacity-0 shadow-[0_8px_32px_-12px_var(--gold)]',
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
              <button
                type="button"
                aria-label={`Read ${t.title}`}
                onClick={(e) => open(t, e.currentTarget)}
                className={cn('absolute inset-0 rounded-lg', focusRing)}
              />
            </article>
          </li>
        ))}
      </ol>
      <NoteDialog
        note={active}
        onClose={() => setActive(null)}
        returnFocusTo={returnTo}
      />
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
            'border-gold/25 bg-surface relative rounded-lg border p-5',
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
      <li className="relative h-6 list-none">
        <HiddenHeart
          id="timeline"
          className="-bottom-4 -left-[calc(1.5rem+23px)] md:-left-[calc(2.5rem+23px)]"
        />
      </li>
    </ol>
  );
}
