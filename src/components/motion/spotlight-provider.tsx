'use client';

import { useEffect } from 'react';

// One delegated listener feeds --mx/--my to the `spotlight` utility on [data-spotlight] elements.
export function SpotlightProvider() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduced.matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(
        '[data-spotlight]',
      );
      if (!el) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
