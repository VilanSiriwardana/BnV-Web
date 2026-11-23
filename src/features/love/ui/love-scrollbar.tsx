'use client';

import { useLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';

import { useLoveScroll } from '../engine/scroll-engine';
import { TinyHeart } from '../sections/letter-ornaments';

const IDLE_MS = 1200;

// Blueprint 054: the love route's scrollbar (the native one is hidden in app/globals.css). A gold
// rail with a gold-heart thumb at `--progress` (written by story.ts buildProgress). Drag the heart
// or click the rail; inert and dimmed while scroll is locked (ritual, inspect, dialogs). On phones
// only the heart shows, on the right edge, while she scrolls.
export function LoveScrollbar() {
  const lenis = useLenis();
  const { scrollTo } = useLoveScroll();
  const bar = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const maxScroll = () =>
    document.documentElement.scrollHeight - window.innerHeight;
  const ratioAt = (clientY: number) => {
    const rect = bar.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);
  };
  const locked = () => Boolean(lenis?.isStopped);

  // Active while scrolling (shows the phone thumb), locked state, and the a11y value — set as
  // attributes, never React state per frame.
  useEffect(() => {
    let idle = 0;
    let lastAria = 0;
    const onScroll = () => {
      const el = bar.current;
      if (!el) return;
      el.dataset.active = '';
      window.clearTimeout(idle);
      idle = window.setTimeout(() => delete el.dataset.active, IDLE_MS);
      const now = performance.now();
      if (now - lastAria > 250) {
        lastAria = now;
        const max = maxScroll();
        el.setAttribute(
          'aria-valuenow',
          String(Math.round(max > 0 ? (window.scrollY / max) * 100 : 0)),
        );
      }
    };
    const watchLock = window.setInterval(() => {
      const el = bar.current;
      if (!el) return;
      if (lenis?.isStopped) el.dataset.locked = '';
      else delete el.dataset.locked;
    }, 250);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(idle);
      window.clearInterval(watchLock);
    };
  }, [lenis]);

  return (
    <div
      ref={bar}
      role="scrollbar"
      aria-label="Page position"
      aria-controls="love-main"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="group/bar fixed inset-y-6 right-1 z-30 w-11 touch-none transition-opacity duration-300 select-none data-locked:pointer-events-none data-locked:opacity-40 md:right-1.5 md:w-4"
      onPointerDown={(e) => {
        if (locked()) return;
        const onThumb = (e.target as Element).closest('[data-scroll-thumb]');
        if (onThumb) {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          return;
        }
        scrollTo(ratioAt(e.clientY) * maxScroll());
      }}
      onPointerMove={(e) => {
        if (!dragging.current || locked()) return;
        scrollTo(ratioAt(e.clientY) * maxScroll(), { immediate: true });
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      <div
        aria-hidden
        className="absolute inset-y-0 left-1/2 hidden w-0.5 -translate-x-1/2 rounded-full bg-linear-to-b from-[color-mix(in_oklab,var(--love-aurora-gold)_10%,transparent)] via-[color-mix(in_oklab,var(--love-aurora-gold)_45%,transparent)] to-[color-mix(in_oklab,var(--love-aurora-gold)_10%,transparent)] shadow-[0_0_8px_var(--love-aurora-gold)] transition-[width] group-hover/bar:w-[3px] md:block"
      >
        <div className="bg-gold h-full origin-top scale-y-(--progress) rounded-full" />
      </div>
      <span
        data-scroll-thumb
        className="absolute left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center opacity-0 transition-opacity duration-500 group-data-active/bar:opacity-100 md:size-6 md:opacity-100"
        style={{ top: 'calc(var(--progress, 0) * 100%)' }}
      >
        <TinyHeart className="text-gold size-5 drop-shadow-[0_0_6px_var(--love-aurora-gold)] transition-transform group-hover/bar:scale-110" />
      </span>
    </div>
  );
}
