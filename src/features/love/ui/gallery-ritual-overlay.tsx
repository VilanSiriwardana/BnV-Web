'use client';

import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { DoorOpenIcon, HammerIcon, KeyRoundIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

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
import { galleryState } from '../engine/gallery-state';
import { REDUCED_MOTION_QUERY } from '../engine/motion-prefs';

if (typeof window !== 'undefined')
  gsap.registerPlugin(SplitText, DrawSVGPlugin);

export const DEFAULT_RITUAL_PROMPTS: [string, string, string] = [
  'Swing across the glass, Buwi',
  'Carefully take the key…',
  'Now place it in the lock',
];
const HINTS = [
  'Try one long stroke across the glass',
  'Bring the key right up to the keyhole',
  'Bring the key right up to the keyhole',
];
const SWIPE_PX = 70;
const ATTEMPT_PX = 40;
const GRAB_PX = 72;
const SNAP_PX = 56;
const LIFT_PX = 40; // the key floats above her finger so it stays visible
const FAILS_FOR_HELP = 3;
const pill =
  'focus-ring glass text-foreground border-gold/40 hover:border-gold text-small flex h-11 items-center gap-2 rounded-full border px-5 font-sans';

type Props = {
  mode: RitualMode;
  prompts?: [string, string, string];
  onExit: () => void;
};

// Blueprints 053–054: while the gallery door is locked this layer takes every pointer, wheel and
// touch (scroll stays locked until the doors open). A diagonal swipe swings the hammer; drag the
// key to the lock. The step buttons appear after 3 misses or when she taps Help.
export function GalleryRitualOverlay({
  mode,
  prompts = DEFAULT_RITUAL_PROMPTS,
  onExit,
}: Props) {
  const overlay = useRef<HTMLDivElement>(null);
  const target = useRef<HTMLDivElement>(null);
  const arrow = useRef<SVGSVGElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [fails, setFails] = useState({ step: -1, count: 0 });
  const [showHelp, setShowHelp] = useState(false);
  const prompt: number = promptFor(mode);
  const failCount = fails.step === prompt ? fails.count : 0;
  const helpOpen = showHelp || failCount >= FAILS_FOR_HELP;

  const fail = () =>
    setFails((f) =>
      f.step === prompt
        ? { step: prompt, count: f.count + 1 }
        : { step: prompt, count: 1 },
    );

  // Wheel and touch never scroll the page underneath (Lenis is stopped too).
  useEffect(() => {
    const el = overlay.current;
    if (!el || mode === 'opening') return;
    const stop = (e: Event) => e.preventDefault();
    el.addEventListener('wheel', stop, { passive: false });
    el.addEventListener('touchmove', stop, { passive: false });
    return () => {
      el.removeEventListener('wheel', stop);
      el.removeEventListener('touchmove', stop);
    };
  }, [mode]);

  // Welcome (blueprint 054): light blooms, flourishes draw in, WELCOME letters rise, the name lifts
  // in letter by letter, a foil shimmer passes, a heart pops; then it rises to the top.
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(
      '#gallery [data-gallery-welcome]',
    );
    if (!root) return;
    // Dev double-mount and re-arrival: drop any fade still running from a previous cleanup.
    gsap.killTweensOf(root);
    const q = (sel: string) => root.querySelectorAll(sel);
    const word = new SplitText(q('[data-welcome-word]'), { type: 'chars' });
    const name = new SplitText(q('[data-welcome-name]'), { type: 'chars' });
    const tl = gsap
      .timeline()
      .set(root, { autoAlpha: 1, y: 0, scale: 1 })
      .fromTo(
        q('[data-welcome-bloom]'),
        { opacity: 0, scale: 0.6 },
        { opacity: 0.9, scale: 1, duration: 0.9, ease: 'power2.out' },
      )
      .to(q('[data-welcome-bloom]'), { opacity: 0.55, duration: 0.8 }, '>')
      .fromTo(
        q('[data-welcome-flourish]'),
        { drawSVG: '0%' },
        { drawSVG: '100%', duration: 0.9, ease: 'power2.inOut' },
        0.25,
      )
      .from(
        word.chars,
        {
          y: 12,
          opacity: 0,
          filter: 'blur(6px)',
          duration: 0.5,
          stagger: 0.04,
          ease: 'power2.out',
        },
        0.3,
      )
      .from(
        name.chars,
        {
          rotateX: -70,
          y: 20,
          opacity: 0,
          transformOrigin: '50% 100%',
          duration: 0.7,
          stagger: 0.06,
          ease: 'back.out(1.4)',
        },
        0.75,
      )
      .fromTo(
        q('[data-welcome-shine]'),
        { '--foil-x': '-100%' },
        { '--foil-x': '200%', duration: 1, ease: 'power1.inOut' },
        '>-0.2',
      )
      .from(
        q('[data-welcome-dot]'),
        { scale: 0, duration: 0.4, ease: 'back.out(3)' },
        '<0.3',
      )
      .add(() => seat(), '+=1.2');
    // Blueprint 061: fly onto the arch, then hand over to the in-scene plaque (gallery-doorway.tsx).
    let flight: gsap.core.Timeline | null = null;
    const seat = () => {
      const plaque = galleryState.welcome;
      if (!plaque.ready || plaque.w < 8) {
        flight = gsap.timeline().to(root, {
          y: '-30svh',
          scale: 0.55,
          duration: 0.9,
          ease: 'power2.inOut',
        });
        return;
      }
      const name = root.querySelector<HTMLElement>('[data-welcome-name]');
      const r = root.getBoundingClientRect();
      const nameW = name?.offsetWidth || r.width;
      const scale = Math.min(1, (plaque.w * 0.62) / nameW);
      flight = gsap
        .timeline()
        .to(root, {
          x: () => galleryState.welcome.x - (r.left + r.width / 2),
          y: () => galleryState.welcome.y - (r.top + r.height / 2),
          scale,
          duration: 0.9,
          ease: 'power2.inOut',
        })
        .to(galleryState.welcome, { seat: 1, duration: 0.4 }, '-=0.1')
        .to(root, { autoAlpha: 0, duration: 0.4 }, '<');
    };
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      tl.kill();
      galleryState.welcome.seat = 1;
      gsap.set(root, { autoAlpha: 0 });
    }
    return () => {
      tl.kill();
      flight?.kill();
      galleryState.welcome.seat = 0;
      word.revert();
      name.revert();
      gsap.to(root, {
        autoAlpha: 0,
        y: '-=12',
        duration: 0.5,
        overwrite: true,
      });
    };
  }, []);

  // The touch ring marks the next target; the diagonal arrow shows the stroke over the case.
  useEffect(() => {
    const draw = gsap.fromTo(
      arrow.current?.querySelectorAll('path') ?? [],
      { drawSVG: '0%' },
      {
        drawSVG: '100%',
        duration: 1.1,
        ease: 'power2.inOut',
        repeat: -1,
        repeatDelay: 0.6,
      },
    );
    const tick = () => {
      const el = target.current;
      const a = arrow.current;
      if (!el || !a) return;
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
        el.style.opacity = a.style.opacity = '0';
        return;
      }
      const size = m === 'locked' ? Math.max(96, s.r * 2.6) : 72;
      el.style.opacity = '1';
      el.style.width = el.style.height = `${size}px`;
      el.style.transform = `translate(${s.x - size / 2}px, ${s.y - size / 2}px)`;
      const span = Math.max(140, s.r * 3.6);
      a.style.opacity = m === 'locked' ? '1' : '0';
      a.style.width = a.style.height = `${span}px`;
      a.style.transform = `translate(${s.x - span / 2}px, ${s.y - span / 2}px)`;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      draw.kill();
    };
  }, []);

  const toNdc = (x: number, y: number) =>
    setRitualPointer(
      (x / window.innerWidth) * 2 - 1,
      -((y - LIFT_PX) / window.innerHeight) * 2 + 1,
    );

  return (
    <div
      ref={overlay}
      data-lenis-prevent={mode === 'opening' ? undefined : true}
      className={cn(
        'fixed inset-0 z-20 select-none',
        mode === 'opening'
          ? 'pointer-events-none'
          : 'pointer-events-auto touch-none',
      )}
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
          if (!near) fail();
          sendRitual({ type: 'release', near });
          return;
        }
        if (mode !== 'locked' || !from) return;
        const dx = e.clientX - from.x;
        const dy = e.clientY - from.y;
        const length = Math.hypot(dx, dy);
        if (length < ATTEMPT_PX) return;
        const across =
          distanceToSegment(s.case, from, e) <= Math.max(60, s.case.r * 1.6);
        if (!across || length < SWIPE_PX) return fail();
        setRitualSwipe(dx, dy);
        sendRitual({ type: 'swipe' });
      }}
    >
      <div
        ref={target}
        aria-hidden
        className="border-gold/70 love-ritual-target pointer-events-none fixed top-0 left-0 rounded-full border-2 opacity-0"
      />
      <svg
        ref={arrow}
        aria-hidden
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gold pointer-events-none fixed top-0 left-0 opacity-0 drop-shadow-[0_0_6px_var(--love-aurora-gold)]"
      >
        <path d="M12 12 C30 22 60 52 84 84" strokeDasharray="5 6" />
        <path d="M70 86 L86 86 L86 70" />
      </svg>

      <p className="sr-only" aria-live="polite">
        {prompt >= 0 ? prompts[prompt] : ''}
        {helpOpen && isWaiting(mode)
          ? '. Help is here: use the buttons below.'
          : ''}
      </p>
      <div className="absolute inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-3 px-4">
        {prompt >= 0 && (
          <div
            key={`${prompt}-${failCount}`}
            aria-hidden
            className={`flex flex-col items-center gap-1 ${failCount ? 'love-ritual-shake' : 'love-ritual-prompt'}`}
          >
            <div className="glass border-gold/40 flex max-w-sm flex-col items-center gap-1.5 rounded-2xl border px-5 py-3 shadow-[0_0_32px_-12px_var(--gold)]">
              <span className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1 rounded-full transition-all duration-500',
                      i === prompt ? 'bg-gold w-5' : 'bg-gold/30 w-1.5',
                    )}
                  />
                ))}
              </span>
              <p className="text-gold-text text-h4 text-center font-serif text-balance italic">
                {prompts[prompt]}
              </p>
              {failCount > 0 && (
                <p className="text-small text-muted-foreground border-gold/20 w-full border-t pt-1.5 text-center font-sans">
                  {HINTS[prompt]}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {helpOpen && mode === 'locked' && (
            <button
              type="button"
              className={pill}
              onClick={() => {
                setRitualSwipe(1, 1);
                sendRitual({ type: 'swipe' });
              }}
            >
              <HammerIcon aria-hidden className="text-gold size-4" />
              Break the glass
            </button>
          )}
          {helpOpen && (mode === 'keyFree' || mode === 'dragging') && (
            <button
              type="button"
              className={pill}
              onClick={() => sendRitual({ type: 'auto' })}
            >
              <KeyRoundIcon aria-hidden className="text-gold size-4" />
              Use the key
            </button>
          )}
          {helpOpen && isWaiting(mode) && (
            <button
              type="button"
              className={pill}
              onClick={() => sendRitual({ type: 'auto' })}
            >
              Open it for me
            </button>
          )}
          <button type="button" className={pill} onClick={onExit}>
            <DoorOpenIcon aria-hidden className="text-gold size-4" />
            Exit gallery
          </button>
          {!helpOpen && isWaiting(mode) && (
            <button
              type="button"
              aria-expanded={false}
              className="focus-ring text-small text-gold-text border-gold/40 hover:border-gold h-11 rounded-full border px-4 font-sans"
              onClick={() => setShowHelp(true)}
            >
              Help
            </button>
          )}
        </div>
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
