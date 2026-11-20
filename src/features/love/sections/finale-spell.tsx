'use client';

import gsap from 'gsap';
import { type RefObject, useEffect, useRef, useState } from 'react';

import { heart } from '../engine/heart-state';
import { useQuiet } from '../engine/use-quiet';
import { TinyHeart } from './letter-ornaments';

const SWITCH_MS = 2400;

// Romance Additions F1, DOM side. Motion: the text block fades to 25 % while the heart spells.
export function useSpellFade(ref: RefObject<HTMLElement | null>) {
  const quiet = useQuiet();
  useEffect(() => {
    const el = ref.current;
    if (!el || quiet) return;
    let last = -1;
    const tick = () => {
      const v = Math.round((1 - 0.75 * heart.spell) * 100) / 100;
      if (v === last) return;
      last = v;
      el.style.opacity = v === 1 ? '' : String(v);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      el.style.opacity = '';
    };
  }, [ref, quiet]);
}

// Calm / static: "{name}" crossfades to "I love you" once the Finale is on screen.
export function QuietSpell({ lines }: { lines: [string, string] }) {
  const quiet = useQuiet();
  const ref = useRef<HTMLParagraphElement>(null);
  const [second, setSecond] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !quiet) return;
    let timer = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      timer = window.setTimeout(() => setSecond(true), SWITCH_MS);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [quiet]);

  if (!quiet) return null;
  return (
    <p
      ref={ref}
      aria-hidden
      className="font-display text-h2 text-gold-text relative mb-8 grid place-items-center"
    >
      {lines.map((line, i) => (
        <span
          key={i}
          className="col-start-1 row-start-1 flex items-center gap-3 transition-opacity duration-700"
          style={{ opacity: (i === 1) === second ? 1 : 0 }}
        >
          {line}
          {i === 1 && <TinyHeart className="size-4" />}
        </span>
      ))}
    </p>
  );
}
