'use client';

import gsap from 'gsap';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { focusRing } from '@/components/ui/styles';
import { cn } from '@/lib/utils/cn';

import { spawnTapHearts } from '../canvas/mini-hearts';
import type { LoveSiteConfig } from '../config';
import { director } from '../engine/heart-director';
import {
  clearFocusedOrb,
  memoriesState,
  onOpenMemory,
  setFocusedOrb,
} from '../engine/memories-state';
import { orbRailProgress } from '../engine/memory-layout';
import { useQuiet } from '../engine/use-quiet';
import { QuietHeart } from '../ui/static-heart';
import { useLoveScroll } from '../engine/scroll-engine';
import { onSessionReset } from '../engine/session';
import { useTier } from '../engine/tier-provider';
import { TIERS } from '../engine/tiers';
import { MemoryDialog } from '../ui/memory-dialog';
import { LovePhoto } from './love-photo';
import { LoveSection, labelText, sectionTitle } from './love-section';
import { HiddenHeart } from '../ui/hidden-heart';

type Memory = LoveSiteConfig['memories'][number];
type Props = { hint: string; memories: Memory[] };
type Origin = { x: number; y: number };
type Open = { index: number; origin: Origin; from: HTMLElement | null };

const DONE_HINT = "That's all of them. For now.";
// Matches buildMemories in engine/story.ts: the rail runs over the last 88 % of the stage.
const RAIL_FROM = 0.12;

export function Memories({ hint, memories }: Props) {
  const { tier } = useTier();
  const motion = !useQuiet();
  const items = useMemo(
    () => (motion ? memories.slice(0, TIERS[tier].orbs) : memories),
    [motion, memories, tier],
  );
  const count = items.length;

  const { scrollTo } = useLoveScroll();
  const opened = useRef(new Set<string>());
  const [openedCount, setOpenedCount] = useState(0);
  const [open, setOpen] = useState<Open | null>(null);
  const twins = useRef<(HTMLButtonElement | null)[]>([]);
  const ring = useRef<HTMLDivElement>(null);

  const openMemory = useCallback(
    (index: number, origin: Origin, from: HTMLElement | null) => {
      const m = items[index];
      if (!m) return;
      director.play('pulse');
      spawnTapHearts(4);
      setOpen({ index, origin, from });
      if (opened.current.has(m.id)) return;
      opened.current.add(m.id);
      setOpenedCount(opened.current.size);
      if (opened.current.size === count) director.play('glowUp');
    },
    [items, count],
  );

  // Replay resets the counter (Experience §14).
  useEffect(
    () =>
      onSessionReset(() => {
        opened.current.clear();
        setOpenedCount(0);
      }),
    [],
  );

  // Orb clicks arrive from the canvas; focus returns to that orb's twin.
  useEffect(
    () =>
      onOpenMemory(({ index, origin }) =>
        openMemory(index, origin, twins.current[index] ?? null),
      ),
    [openMemory],
  );

  // Focus ring follows the projected orb (no React state per frame).
  useEffect(() => {
    if (!motion) return;
    const tick = () => {
      const el = ring.current;
      if (!el) return;
      const s = memoriesState.screen[memoriesState.focused];
      if (!s?.visible) {
        el.style.opacity = '0';
        return;
      }
      const size = Math.max(44, s.r * 2 + 16);
      el.style.opacity = '1';
      el.style.width = el.style.height = `${size}px`;
      el.style.transform = `translate(${s.x - size / 2}px, ${s.y - size / 2}px)`;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      clearFocusedOrb();
    };
  }, [motion]);

  const focusTwin = (i: number) => {
    setFocusedOrb(i);
    const section = document.getElementById('memories');
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    const p = RAIL_FROM + (1 - RAIL_FROM) * orbRailProgress(i, count);
    scrollTo(top + p * travel, { duration: 0.8 });
  };

  const done = openedCount === count;
  const hintText = done ? DONE_HINT : hint;

  return (
    <LoveSection id="memories" depth={0.5} stage="400vh">
      <QuietHeart className="mb-4 size-10" />
      <h2 id="memories-title" className={`${sectionTitle} relative`}>
        Memories
        <HiddenHeart id="memories" />
      </h2>
      <p className={`${labelText} mt-3`} aria-live="polite">
        {hintText}
      </p>
      {openedCount > 0 && !done && (
        <p className={`${labelText} mt-2`} aria-live="polite">
          {openedCount} of {count} opened
        </p>
      )}

      {motion ? (
        <>
          <ul className="sr-only">
            {items.map((m, i) => (
              <li key={m.id}>
                <button
                  type="button"
                  data-memory-twin
                  data-ui
                  ref={(el) => {
                    twins.current[i] = el;
                  }}
                  onFocus={() => focusTwin(i)}
                  onBlur={() => {
                    clearFocusedOrb(i);
                  }}
                  onClick={(e) => {
                    const s = memoriesState.screen[i];
                    openMemory(
                      i,
                      s?.visible
                        ? { x: s.x, y: s.y }
                        : {
                            x: window.innerWidth / 2,
                            y: window.innerHeight / 2,
                          },
                      e.currentTarget,
                    );
                  }}
                >
                  Open memory: {m.title}, {m.date}
                </button>
              </li>
            ))}
          </ul>
          <div
            ref={ring}
            aria-hidden
            className="ring-ring pointer-events-none fixed top-0 left-0 rounded-full opacity-0 ring-2 transition-opacity"
          />
        </>
      ) : (
        <ul className="mt-12 grid w-full gap-6 text-left sm:grid-cols-2">
          {items.map((m, i) => (
            <li key={m.id}>
              <button
                type="button"
                className={cn(
                  'border-gold/25 bg-surface block w-full overflow-hidden rounded-lg border text-left',
                  focusRing,
                )}
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  openMemory(
                    i,
                    { x: r.left + r.width / 2, y: r.top + r.height / 2 },
                    e.currentTarget,
                  );
                }}
              >
                <LovePhoto
                  photo={m.photo}
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="aspect-[4/3] w-full object-cover"
                />
                <span className="block p-5">
                  <span className={cn(labelText, 'block')}>{m.date}</span>
                  <span className="text-h3 mt-1 block break-words">
                    {m.title}
                  </span>
                  <span className="text-body mt-2 block text-pretty">
                    {m.caption}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <MemoryDialog
        memory={open ? (items[open.index] ?? null) : null}
        originRect={open?.origin ?? null}
        onClose={() => setOpen(null)}
        returnFocusTo={open?.from}
      />
    </LoveSection>
  );
}
