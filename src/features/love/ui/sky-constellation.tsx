'use client';

import {
  type PointerEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

import { heartPoint } from '../canvas/heart-geometry';
import { playChime } from '../engine/chime';
import { director } from '../engine/heart-director';
import { loveKey, writeJSON } from '../engine/persist';
import { onSessionReset, SKY_COMPLETE_EVENT } from '../engine/session';
import { skyStarLayout } from '../engine/sky-layout';

const AUTO_STEP_MS = 260;
const HIT_PX = 30; // release within this of the target star counts (≥ 44 px hit area)

type Star = { title: string; date: string };
type Props = {
  stars: Star[];
  hint: string;
  done: string;
  slug: string;
  quiet: boolean;
};

const OUTLINE = (() => {
  const pts = Array.from({ length: 72 }, (_, i) => {
    const [x, y] = heartPoint((i / 72) * 2 * Math.PI);
    return `${(14 + ((x + 0.95) / 1.9) * 72).toFixed(2)} ${(14 + ((0.9 - y) / 1.9) * 72).toFixed(2)}`;
  });
  return `M ${pts.join(' L ')} Z`;
})();

// Romance Additions F3. `linked` counts finished links: star i joins i + 1, the last closes to 0.
export function SkyConstellation({ stars, hint, done, slug, quiet }: Props) {
  const n = stars.length;
  const pos = useMemo(() => skyStarLayout(n), [n]);
  const box = useRef<HTMLDivElement>(null);
  const [progress, setLinked] = useState(0);
  // Calm and static start with the finished constellation.
  const linked = quiet ? n : progress;
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [miss, setMiss] = useState<{ x: number; y: number } | null>(null);
  const [announce, setAnnounce] = useState('');
  const clearMiss = useCallback(() => setMiss(null), []);
  const auto = useRef(0);
  const hintId = useId();
  const complete = linked >= n;
  const from = linked % n;
  const target = (linked + 1) % n;

  const count = useRef(0);
  const link = useCallback(() => {
    const k = count.current;
    if (k >= n) return;
    const next = k + 1;
    count.current = next;
    setLinked(next);
    playChime(k);
    if (next === n) {
      setAnnounce('The stars form a heart.');
      writeJSON(loveKey(slug, 'sky'), true);
      if (!quiet) director.interrupt('skyHeartIn');
    } else {
      director.play('pulse');
      setAnnounce(`Connected ${stars[next % n].title}, ${next} of ${n}`);
    }
  }, [n, quiet, slug, stars]);

  // "Connect for me" and forward leave: the remaining links draw themselves.
  const finish = useCallback(() => {
    if (auto.current || count.current >= n) return;
    auto.current = window.setInterval(() => {
      link();
      if (count.current < n) return;
      window.clearInterval(auto.current);
      auto.current = 0;
    }, AUTO_STEP_MS);
  }, [link, n]);

  useEffect(() => {
    const section = box.current?.closest('section');
    if (!section) return;
    section.addEventListener(SKY_COMPLETE_EVENT, finish);
    return () => section.removeEventListener(SKY_COMPLETE_EVENT, finish);
  }, [finish]);

  useEffect(
    () =>
      onSessionReset(() => {
        window.clearInterval(auto.current);
        auto.current = 0;
        count.current = 0;
        setLinked(0);
      }),
    [n, quiet],
  );
  useEffect(() => () => window.clearInterval(auto.current), []);

  const toBox = (e: PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
      scale: r.width / 100,
    };
  };

  const onDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (complete) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = toBox(e);
    setMiss(null);
    setDrag({ x: p.x, y: p.y });
  };
  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!drag) return;
    const p = toBox(e);
    setDrag({ x: p.x, y: p.y });
  };
  const onUp = (e: PointerEvent<HTMLButtonElement>) => {
    if (!drag) return;
    const p = toBox(e);
    setDrag(null);
    const t = pos[target];
    if (Math.hypot(p.x - t.x, p.y - t.y) * p.scale <= HIT_PX) link();
    else if (
      Math.hypot(p.x - pos[from].x, p.y - pos[from].y) * p.scale >
      HIT_PX
    )
      setMiss({ x: p.x, y: p.y });
  };

  const latest = stars[Math.min(linked, n - 1) % n];

  return (
    <div data-sky className="relative w-full">
      <p id={hintId} className="text-small font-sans tracking-wide opacity-80">
        {complete ? done : hint}
      </p>
      <div
        ref={box}
        className="relative mx-auto mt-4 aspect-square w-[min(88vw,60svh,34rem)]"
      >
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          className="absolute inset-0 size-full overflow-visible"
        >
          <path
            d={OUTLINE}
            fill="none"
            className={cn(
              'stroke-gold transition-opacity duration-1000',
              complete ? 'opacity-40' : 'opacity-0',
            )}
            strokeWidth={0.3}
          />
          {Array.from({ length: Math.min(linked, n) }, (_, i) => (
            <SkyLine key={i} a={pos[i]} b={pos[(i + 1) % n]} instant={quiet} />
          ))}
          {drag && (
            <line
              x1={pos[from].x}
              y1={pos[from].y}
              x2={drag.x}
              y2={drag.y}
              className="stroke-gold"
              strokeWidth={0.5}
              strokeLinecap="round"
            />
          )}
          {miss && (
            <MissLine
              key={`${miss.x}-${miss.y}`}
              a={pos[from]}
              b={miss}
              onDone={clearMiss}
            />
          )}
        </svg>
        {pos.map((p, i) => {
          const isFrom = !complete && i === from;
          const isTarget = !complete && i === target;
          const lit = complete || i <= linked;
          return (
            <button
              key={i}
              type="button"
              aria-label={`Star ${i + 1} of ${n}: ${stars[i].title}. ${isTarget ? 'Connect.' : lit ? 'Connected.' : 'Not yet.'}`}
              aria-describedby={isTarget ? hintId : undefined}
              onClick={isTarget ? link : undefined}
              onPointerDown={isFrom ? onDown : undefined}
              onPointerMove={isFrom ? onMove : undefined}
              onPointerUp={isFrom ? onUp : undefined}
              onPointerCancel={() => setDrag(null)}
              className={cn(
                'focus-ring absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full',
                isFrom && 'touch-none',
              )}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span
                aria-hidden
                className={cn(
                  'block size-2.5 rounded-full transition-[opacity,box-shadow] duration-500',
                  lit
                    ? 'bg-gold opacity-100 shadow-[0_0_12px_var(--gold)]'
                    : 'bg-primary opacity-60',
                  isTarget && 'animate-pulse motion-reduce:animate-none',
                )}
              />
              {lit && (
                <span
                  aria-hidden
                  className={cn(
                    'text-gold-text pointer-events-none absolute top-1/2 hidden -translate-y-1/2 font-sans text-xs whitespace-nowrap md:block',
                    p.x > 50
                      ? 'left-full ml-1 text-left'
                      : 'right-full mr-1 text-right',
                  )}
                >
                  {stars[i].title}
                  <span className="block opacity-70">{stars[i].date}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p
        aria-hidden
        className="text-gold-text mt-3 min-h-[2.5em] font-sans text-xs md:hidden"
      >
        {linked > 0 && (
          <>
            {latest.title}
            <span className="block opacity-70">{latest.date}</span>
          </>
        )}
      </p>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
      {!complete && (
        <Button
          variant="love-link"
          size="inline"
          onClick={finish}
          className="mt-2"
        >
          Connect for me
        </Button>
      )}
    </div>
  );
}

// One locked-in link: a 0.4 s stroke draw (opacity-only in Calm).
function SkyLine({
  a,
  b,
  instant,
}: {
  a: { x: number; y: number };
  b: { x: number; y: number };
  instant: boolean;
}) {
  const [drawn, setDrawn] = useState(instant);
  useEffect(() => {
    if (instant) return;
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, [instant]);
  return (
    <path
      d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={drawn ? 0 : 1}
      className="stroke-gold transition-[stroke-dashoffset] duration-400 ease-out"
      strokeWidth={0.5}
      strokeLinecap="round"
    />
  );
}

// A release on the wrong star: the line fades away, nothing else changes.
function MissLine({
  a,
  b,
  onDone,
}: {
  a: { x: number; y: number };
  b: { x: number; y: number };
  onDone: () => void;
}) {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGone(true));
    const t = window.setTimeout(onDone, 600);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(t);
    };
  }, [onDone]);
  return (
    <line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      className="stroke-gold transition-opacity duration-500"
      style={{ opacity: gone ? 0 : 1 }}
      strokeWidth={0.5}
      strokeLinecap="round"
    />
  );
}
