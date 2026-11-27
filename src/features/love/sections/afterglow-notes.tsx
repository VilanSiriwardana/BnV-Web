'use client';

import 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils/cn';

import type { LoveSiteConfig } from '../config';
import { director } from '../engine/heart-director';
import { progressSet, usePersistedSet } from '../engine/hidden-hearts';
import { useQuiet } from '../engine/use-quiet';
import { useHold } from '../hooks/use-hold';
import { gsap, magneticTilt } from '../ui/afterglow-motion';
import { NoteDialog, type NoteContent } from '../ui/note-dialog';
import { WaxSeal } from '../ui/wax-seal';
import { labelText } from './love-section';

type Note = NonNullable<
  NonNullable<LoveSiteConfig['afterglow']>['openWhen']
>[number];

const HOLD_MS = 900;
const FAN_DEG = 2.5;

// Romance Additions F8 + blueprint 059: sealed envelopes dealt like a fanned deck. Hold the wax
// seal (click in Calm): the ring traces, the seal shatters, the flap lifts and the letter
// grows into the parchment note.
export function AfterglowNotes({
  slug,
  notes,
  intro,
}: {
  slug: string;
  notes: Note[];
  intro?: string;
}) {
  const quiet = useQuiet();
  const set = progressSet(slug, 'notes');
  const opened = usePersistedSet(set);
  const [active, setActive] = useState<NoteContent | null>(null);
  const [returnTo, setReturnTo] = useState<HTMLElement | null>(null);
  const [origin, setOrigin] = useState<HTMLElement | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const ribbon = useRef<SVGPathElement>(null);
  const mid = (notes.length - 1) / 2;

  // Dealt from one pile in the middle when the deck scrolls into view.
  useEffect(() => {
    const el = list.current;
    if (!el || quiet) return;
    const cards = Array.from(el.children);
    // Blueprint 086: one layout read for the whole deck.
    const box = el.getBoundingClientRect();
    const pile = box.left + box.width / 2;
    const dx = cards.map((c) => {
      const r = c.getBoundingClientRect();
      return pile - (r.left + r.width / 2);
    });
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        x: (i: number) => dx[i],
        y: 80,
        rotation: (i: number) => (i - mid) * 9,
        opacity: 0,
        duration: 1.1,
        ease: 'love-soft',
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [quiet, mid]);

  // The progress ribbon draws to the share of notes opened.
  useEffect(() => {
    const el = ribbon.current;
    if (!el) return;
    const share = notes.length ? opened.length / notes.length : 0;
    const to = { drawSVG: `0% ${Math.max(share * 100, 0.01)}%` };
    if (quiet) gsap.set(el, to);
    else gsap.to(el, { ...to, duration: 1.2, ease: 'love-soft' });
  }, [opened.length, notes.length, quiet]);

  return (
    <div data-reveal className="w-full">
      <h3 id="afterglow-notes-title" className="text-h3 font-display">
        Open when…
      </h3>
      <p className={`${labelText} mt-2`} aria-live="polite">
        {opened.length} of {notes.length} opened
      </p>
      <svg
        aria-hidden
        viewBox="0 0 240 12"
        className="mx-auto mt-3 h-3 w-60 overflow-visible"
      >
        <path
          d="M4 6 C 60 0, 120 12, 180 6 S 230 2, 236 6"
          fill="none"
          stroke="var(--gold)"
          strokeOpacity="0.2"
          strokeWidth="2"
        />
        <path
          ref={ribbon}
          d="M4 6 C 60 0, 120 12, 180 6 S 230 2, 236 6"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {intro && (
        <p className="text-body-lg text-foreground/85 mx-auto mt-6 max-w-xl text-pretty italic">
          {intro}
        </p>
      )}
      <ul ref={list} className="mt-12 grid gap-8 sm:grid-cols-2">
        {notes.map((n, i) => (
          <li key={n.id}>
            {/* The resting fan lives one level down so GSAP owns the li's transform. */}
            <div
              style={{ rotate: `${(i - mid) * FAN_DEG * (i % 2 ? -1 : 1)}deg` }}
              className={i % 2 ? undefined : 'sm:translate-y-3'}
            >
              <Envelope
                note={n}
                opened={opened.includes(n.id)}
                onOpen={(button, letter) => {
                  set.add(n.id);
                  setReturnTo(button);
                  setOrigin(letter);
                  setActive({
                    label: 'Open when…',
                    title: n.label,
                    paragraphs: n.paragraphs,
                  });
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      <NoteDialog
        note={active}
        onClose={() => setActive(null)}
        returnFocusTo={returnTo}
        originEl={origin}
      />
    </div>
  );
}

function Envelope({
  note,
  opened,
  onOpen,
}: {
  note: Note;
  opened: boolean;
  onOpen: (button: HTMLElement, letter: HTMLElement) => void;
}) {
  const quiet = useQuiet();
  const card = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const letter = useRef<HTMLDivElement>(null);
  const flap = useRef<SVGPathElement>(null);
  const busy = useRef(false);
  const select = useRef<ReturnType<typeof gsap.utils.selector> | null>(null);

  useEffect(() => {
    const el = card.current;
    if (!el || quiet) return;
    return magneticTilt(el, 5);
  }, [quiet]);

  useEffect(() => {
    if (!opened) return;
    gsap.set(flap.current, { scaleY: -1, transformOrigin: '50% 0%' });
    gsap.set(letter.current, { yPercent: -18 });
  }, [opened]);

  const handOff = () => {
    busy.current = false;
    if (button.current && letter.current)
      onOpen(button.current, letter.current);
  };

  const open = () => {
    if (busy.current) return;
    if (opened || quiet) {
      if (!opened) void director.play('noteOpen');
      handOff();
      queueMicrotask(reset);
      return;
    }
    busy.current = true;
    void director.play('noteOpen');
    const q = gsap.utils.selector(button.current);
    gsap
      .timeline({ onComplete: handOff })
      .to(q('[data-shard]'), {
        duration: 1,
        physics2D: {
          velocity: () => gsap.utils.random(90, 170),
          angle: () => gsap.utils.random(-160, -20),
          gravity: 520,
        },
        rotation: () => gsap.utils.random(-120, 120),
        opacity: 0,
        ease: 'none',
        stagger: 0.02,
      })
      .to(
        q('[data-ring]'),
        { opacity: 0, scale: 1.4, transformOrigin: '50% 50%', duration: 0.4 },
        0,
      )
      .to(
        flap.current,
        {
          scaleY: -1,
          transformOrigin: '50% 0%',
          duration: 0.6,
          ease: 'power2.inOut',
        },
        0.15,
      )
      .to(
        letter.current,
        { yPercent: -18, duration: 0.5, ease: 'back.out(1.6)' },
        0.55,
      );
    queueMicrotask(reset);
  };

  const { handlers, complete, reset } = useHold({
    duration: HOLD_MS,
    onProgress: (p) => {
      if (opened || !button.current) return;
      const q = (select.current ??= gsap.utils.selector(button.current));
      gsap.set(q('[data-ring]'), { drawSVG: `0% ${p * 100}%` });
      gsap.set(q('[data-seal]'), {
        scale: 1 + p * 0.08,
        rotation: p > 0.7 ? gsap.utils.random(-2, 2) : 0,
      });
    },
    onComplete: open,
    completeOnClick: quiet || opened,
  });

  return (
    <div
      ref={card}
      className="love-parchment relative flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg px-6 pt-6 pb-5"
    >
      <p className="font-display text-h4 text-balance">{note.label}</p>
      <div className="relative w-full max-w-60">
        <svg
          aria-hidden
          viewBox="0 0 200 120"
          className="w-full overflow-visible"
        >
          <rect
            x="6"
            y="20"
            width="188"
            height="96"
            rx="6"
            fill="color-mix(in oklab, var(--night-foreground) 70%, var(--night-gold))"
          />
          <path
            ref={flap}
            d="M6 22 L 100 78 L 194 22 Z"
            fill="color-mix(in oklab, var(--night-foreground) 62%, var(--night-gold))"
            stroke="color-mix(in oklab, var(--night-gold) 40%, transparent)"
          />
        </svg>
        <div
          ref={letter}
          aria-hidden
          className="absolute inset-x-[10%] top-[22%] h-[60%] rounded-sm bg-[color-mix(in_oklab,var(--night-foreground)_92%,white)] shadow-sm"
        />
        <svg
          aria-hidden
          viewBox="0 0 200 120"
          className="pointer-events-none absolute inset-0 w-full overflow-visible"
        >
          <path
            d="M6 116 L 100 62 L 194 116 Z M6 22 L 82 70 L 6 116 Z M194 22 L 118 70 L 194 116 Z"
            fill="color-mix(in oklab, var(--night-foreground) 74%, var(--night-gold))"
            stroke="color-mix(in oklab, var(--night-gold) 35%, transparent)"
          />
        </svg>
        <button
          ref={button}
          type="button"
          {...handlers}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.repeat) {
              e.preventDefault();
              complete();
              return;
            }
            handlers.onKeyDown(e);
          }}
          aria-label={
            opened
              ? `${note.label}. Read again`
              : `${note.label}. Sealed. Hold or press Enter to open.`
          }
          className={cn(
            'focus-ring absolute top-[64%] left-1/2 z-10 size-20 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full select-none',
            opened ? 'text-gold' : 'text-primary',
          )}
        >
          <WaxSeal broken={opened} />
        </button>
      </div>
      <p className="text-small text-muted-foreground font-sans">
        {opened ? 'Opened' : 'Hold the seal to open'}
      </p>
    </div>
  );
}
