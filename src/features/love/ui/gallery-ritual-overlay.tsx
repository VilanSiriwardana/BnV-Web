'use client';

import gsap from 'gsap';
import { DoorOpenIcon, HammerIcon, KeyRoundIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
  isWaiting,
  promptFor,
  type RitualMode,
} from '../engine/gallery-ritual-core';
import {
  ritualState,
  sendRitual,
  setRitualPointer,
  setRitualSwipe,
} from '../engine/gallery-ritual';

export const DEFAULT_RITUAL_PROMPTS: [string, string, string] = [
  'Swipe across the glass, Buwi',
  'Carefully take the key…',
  'Now place it in the lock',
];
const SWIPE_PX = 80;
const GRAB_PX = 72;
const SNAP_PX = 56;
const LIFT_PX = 40; // the key floats above her finger so it stays visible
const HELP_AFTER_MS = 20000;
const pill =
  'focus-ring glass text-foreground border-gold/40 hover:border-gold text-small flex h-11 items-center gap-2 rounded-full border px-5 font-sans';

type Props = {
  mode: RitualMode;
  prompts?: [string, string, string];
  onExit: () => void;
};

// Blueprint 053: while the gallery door is locked this layer takes every pointer, wheel and touch
// (scroll stays locked until the doors open). Swipe across the case, drag the key to the lock;
// buttons and "Open it for me" do the same for keyboard users or if she is stuck.
export function GalleryRitualOverlay({
  mode,
  prompts = DEFAULT_RITUAL_PROMPTS,
  onExit,
}: Props) {
  const overlay = useRef<HTMLDivElement>(null);
  const target = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [help, setHelp] = useState(false);
  const prompt: number = promptFor(mode);

  // Wheel and touch never scroll the page underneath (Lenis is stopped too).
  useEffect(() => {
    const el = overlay.current;
    if (!el) return;
    const stop = (e: Event) => e.preventDefault();
    el.addEventListener('wheel', stop, { passive: false });
    el.addEventListener('touchmove', stop, { passive: false });
    return () => {
      el.removeEventListener('wheel', stop);
      el.removeEventListener('touchmove', stop);
    };
  }, []);

  // The welcome greets her, then rises to the top while she works the lock.
  useEffect(() => {
    const welcome = document.querySelector('#gallery [data-gallery-welcome]');
    if (!welcome) return;
    const tl = gsap
      .timeline()
      .fromTo(
        welcome,
        { autoAlpha: 0, scale: 0.86, y: 0, filter: 'blur(10px)' },
        {
          autoAlpha: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'back.out(1.6)',
        },
      )
      .to(
        welcome,
        { y: '-30svh', scale: 0.55, duration: 0.9, ease: 'power2.inOut' },
        '+=1.1',
      );
    return () => {
      tl.kill();
      gsap.to(welcome, { autoAlpha: 0, duration: 0.6 });
    };
  }, []);

  // "Open it for me" appears after 20 s without progress.
  useEffect(() => {
    if (!isWaiting(mode)) return;
    const id = window.setTimeout(() => setHelp(true), HELP_AFTER_MS);
    return () => window.clearTimeout(id);
  }, [mode]);

  // A soft pulsing ring marks what to touch next: the case, the key, then the lock.
  useEffect(() => {
    const tick = () => {
      const el = target.current;
      if (!el) return;
      const { screen } = ritualState;
      const m = ritualState.mode;
      const s =
        m === 'locked'
          ? screen.case
          : m === 'keyFree'
            ? screen.key
            : m === 'dragging'
              ? screen.keyhole
              : null;
      if (!s?.visible) {
        el.style.opacity = '0';
        return;
      }
      const size = m === 'locked' ? Math.max(96, s.r * 2.6) : 72;
      el.style.opacity = '1';
      el.style.width = el.style.height = `${size}px`;
      el.style.transform = `translate(${s.x - size / 2}px, ${s.y - size / 2}px)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const toNdc = (x: number, y: number) =>
    setRitualPointer(
      (x / window.innerWidth) * 2 - 1,
      -((y - LIFT_PX) / window.innerHeight) * 2 + 1,
    );

  return (
    <div
      ref={overlay}
      data-lenis-prevent
      className="pointer-events-auto fixed inset-0 z-20 touch-none select-none"
      onPointerDown={(e) => {
        if ((e.target as Element).closest('button')) return;
        start.current = { x: e.clientX, y: e.clientY };
        const k = ritualState.screen.key;
        if (
          mode === 'keyFree' &&
          Math.hypot(e.clientX - k.x, e.clientY - k.y) < GRAB_PX
        ) {
          toNdc(e.clientX, e.clientY);
          sendRitual({ type: 'grab' });
          e.currentTarget.setPointerCapture(e.pointerId);
        }
      }}
      onPointerMove={(e) => {
        if (ritualState.mode === 'dragging') toNdc(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => {
        const from = start.current;
        start.current = null;
        const s = ritualState.screen;
        if (ritualState.mode === 'dragging') {
          const near =
            Math.hypot(s.key.x - s.keyhole.x, s.key.y - s.keyhole.y) < SNAP_PX;
          sendRitual({ type: 'release', near });
          return;
        }
        if (mode !== 'locked' || !from) return;
        const dx = e.clientX - from.x;
        const dy = e.clientY - from.y;
        if (Math.hypot(dx, dy) < SWIPE_PX) return;
        if (distanceToSegment(s.case, from, e) > Math.max(60, s.case.r * 1.4))
          return;
        setRitualSwipe(dx >= 0 ? 1 : -1);
        sendRitual({ type: 'swipe' });
      }}
    >
      <div
        ref={target}
        aria-hidden
        className="border-gold/70 love-ritual-target pointer-events-none fixed top-0 left-0 rounded-full border-2 opacity-0"
      />

      <p className="sr-only" aria-live="polite">
        {prompt >= 0 ? prompts[prompt] : ''}
      </p>
      <div className="absolute inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-3 px-4">
        {prompt >= 0 && (
          <p
            key={prompt}
            aria-hidden
            className="bg-scrim/70 text-gold-text text-h3 love-ritual-prompt rounded-full px-5 py-2 text-center font-serif text-balance italic"
          >
            {prompts[prompt]}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {mode === 'locked' && (
            <button
              type="button"
              className={pill}
              onClick={() => {
                setRitualSwipe(1);
                sendRitual({ type: 'swipe' });
              }}
            >
              <HammerIcon aria-hidden className="text-gold size-4" />
              Break the glass
            </button>
          )}
          {(mode === 'keyFree' || mode === 'dragging') && (
            <button
              type="button"
              className={pill}
              onClick={() => sendRitual({ type: 'auto' })}
            >
              <KeyRoundIcon aria-hidden className="text-gold size-4" />
              Use the key
            </button>
          )}
          <button type="button" className={pill} onClick={onExit}>
            <DoorOpenIcon aria-hidden className="text-gold size-4" />
            Exit gallery
          </button>
        </div>
        {help && isWaiting(mode) && (
          <button
            type="button"
            className="focus-ring text-small text-muted-foreground hover:text-gold-text rounded-md px-3 py-1 font-sans underline underline-offset-4"
            onClick={() => sendRitual({ type: 'auto' })}
          >
            Open it for me
          </button>
        )}
      </div>
    </div>
  );
}

function distanceToSegment(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { clientX: number; clientY: number },
) {
  const vx = b.clientX - a.x;
  const vy = b.clientY - a.y;
  const t = Math.max(
    0,
    Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / (vx * vx + vy * vy)),
  );
  return Math.hypot(a.x + vx * t - p.x, a.y + vy * t - p.y);
}
