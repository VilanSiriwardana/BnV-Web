'use client';

import { type ReactNode, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils/cn';

import { director } from '../engine/heart-director';
import { useQuiet } from '../engine/use-quiet';
import { useHold } from '../hooks/use-hold';
import { gsap, magneticTilt, sparkBurst } from './afterglow-motion';

type Props = {
  index: number;
  total: number;
  label: string;
  opened: boolean;
  sealed: boolean;
  sealedLabel?: string;
  onOpen: () => void;
  children: ReactNode;
};

const HOLD_MS = 800;
/** Share of the timeline the hold scrubs: the bow loosens and the ribbon slips away. */
const HOLD_SHARE = 0.42;
const LOOSE_L = 'M60 40 C 54 46, 46 58, 40 70';
const LOOSE_R = 'M60 40 C 66 46, 74 58, 82 68';
const side = 'color-mix(in oklab, var(--secondary) 72%, black)';
const lidSide = 'color-mix(in oklab, var(--primary) 72%, black)';

// Romance Additions F7 + blueprint 059: hold to untie. The bow loosens and the ribbon slides off
// while she holds; on release of the last knot the lid flips away, sparks spill and the card rises.
export function GiftBox({
  index,
  total,
  label,
  opened,
  sealed,
  sealedLabel = 'Maybe next time…',
  onOpen,
  children,
}: Props) {
  const quiet = useQuiet();
  const button = useRef<HTMLButtonElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const justOpened = useRef(false);
  const wasSealed = useRef(sealed);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    gsap.set(q('[data-lock]'), { opacity: sealed ? 1 : 0 });
    tl.current = gsap
      .timeline({ paused: true })
      .to(
        q('[data-loop-l]'),
        { morphSVG: LOOSE_L, duration: 0.5, ease: 'power2.inOut' },
        0,
      )
      .to(
        q('[data-loop-r]'),
        { morphSVG: LOOSE_R, duration: 0.5, ease: 'power2.inOut' },
        0,
      )
      .to(
        q('[data-ribbon-v]'),
        { drawSVG: '100% 100%', duration: 0.5, ease: 'power2.in' },
        0.1,
      )
      .to(q('[data-bow]'), { opacity: 0, y: 14, duration: 0.3 }, 0.5)
      .to(
        q('[data-lid]'),
        { y: -58, x: 14, rotate: -32, duration: 0.75, ease: 'back.out(1.5)' },
        0.6,
      )
      .fromTo(
        q('[data-light]'),
        { opacity: 0, scaleY: 0.4 },
        { opacity: 1, scaleY: 1, duration: 0.6, ease: 'power2.out' },
        0.7,
      );
    if (opened) tl.current.progress(1);
    return () => {
      tl.current?.kill();
      tl.current = null;
    };
    // `opened`/`sealed` only seed the first paint; later changes animate below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = svg.current;
    if (!el || quiet || opened || sealed) return;
    return magneticTilt(el);
  }, [quiet, opened, sealed]);

  // Pick-one: the others sink and fade. Sequence: the next box wakes, its padlock springs open.
  useEffect(() => {
    const was = wasSealed.current;
    wasSealed.current = sealed;
    const el = button.current;
    const lock = svg.current?.querySelector('[data-lock]');
    if (!el || was === sealed) return;
    if (quiet) {
      gsap.set(lock ?? [], { opacity: sealed ? 1 : 0 });
      return;
    }
    if (sealed) {
      gsap.to(el, {
        y: 10,
        filter: 'grayscale(0.7)',
        duration: 0.8,
        ease: 'power2.out',
        delay: index * 0.08,
      });
      gsap.to(lock ?? [], { opacity: 1, duration: 0.4, delay: 0.3 });
      return;
    }
    gsap
      .timeline()
      .to(svg.current?.querySelector('[data-shackle]') ?? [], {
        y: -6,
        rotate: 25,
        transformOrigin: '100% 100%',
        duration: 0.35,
        ease: 'back.out(3)',
      })
      .to(
        lock ?? [],
        { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.35 },
        '+=0.15',
      )
      .fromTo(
        svg.current ?? [],
        { y: 0 },
        { y: -14, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1 },
        '<',
      );
  }, [sealed, quiet, index]);

  // The card rises out of the box mouth (only on a fresh open, not on reload).
  useEffect(() => {
    const c = card.current;
    const box = button.current;
    if (!opened || !justOpened.current || !c || !box || quiet) return;
    justOpened.current = false;
    const dy =
      box.getBoundingClientRect().top +
      box.offsetHeight * 0.45 -
      c.getBoundingClientRect().top;
    gsap.fromTo(
      c,
      { y: dy, scale: 0.5, opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1,
        delay: 0.65,
        ease: 'love-soft',
        clearProps: 'clipPath,transform',
      },
    );
  }, [opened, quiet]);

  const open = () => {
    if (opened || sealed) return;
    justOpened.current = true;
    if (quiet) tl.current?.progress(1);
    else {
      tl.current?.play();
      gsap.delayedCall(0.7, () => button.current && sparkBurst(button.current));
    }
    void director.play('giftOpen');
    onOpen();
  };

  const { handlers, complete } = useHold({
    duration: HOLD_MS,
    onProgress: (p) => !opened && tl.current?.progress(p * HOLD_SHARE),
    onComplete: open,
    completeOnClick: quiet,
  });

  const state = opened ? 'open' : sealed ? 'sealed' : 'waiting';

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <button
        ref={button}
        type="button"
        {...handlers}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.repeat && !opened && !sealed) {
            e.preventDefault();
            complete();
            return;
          }
          handlers.onKeyDown(e);
        }}
        disabled={sealed}
        aria-label={`Gift ${index + 1} of ${total}, ${label}, ${
          opened
            ? 'opened'
            : sealed
              ? sealedLabel
              : 'sealed. Hold or press Enter to open.'
        }`}
        data-state={state}
        className={cn(
          'focus-ring relative grid size-36 touch-none place-items-center rounded-lg select-none md:size-40',
          !opened && !sealed && 'love-gift-float',
          sealed && 'opacity-50',
        )}
      >
        <svg
          ref={svg}
          aria-hidden
          viewBox="0 0 120 120"
          className="size-full overflow-visible drop-shadow-[0_14px_18px_color-mix(in_oklab,var(--primary)_25%,transparent)]"
        >
          <defs>
            <linearGradient
              id={`gift-light-${index}`}
              x1="0"
              y1="1"
              x2="0"
              y2="0"
            >
              <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            data-light
            d="M28 58 L 6 -6 L 114 -6 L 92 58 Z"
            fill={`url(#gift-light-${index})`}
            opacity="0"
            style={{ transformOrigin: '60px 58px', transformBox: 'view-box' }}
          />
          <path d="M98 56 L 108 50 L 108 102 L 98 108 Z" fill={side} />
          <rect
            x="22"
            y="56"
            width="76"
            height="52"
            rx="6"
            fill="var(--secondary)"
          />
          <path
            data-ribbon-v
            d="M60 56 L 60 108"
            stroke="var(--gold)"
            strokeWidth="12"
            fill="none"
          />
          <g
            data-lid
            style={{ transformOrigin: '30px 56px', transformBox: 'view-box' }}
          >
            <path d="M104 40 L 112 35 L 112 51 L 104 58 Z" fill={lidSide} />
            <rect
              x="16"
              y="40"
              width="88"
              height="18"
              rx="5"
              fill="var(--primary)"
            />
            <rect x="54" y="40" width="12" height="18" fill="var(--gold)" />
          </g>
          <g
            data-bow
            fill="none"
            stroke="var(--gold)"
            strokeWidth="5"
            strokeLinecap="round"
            style={{ transformOrigin: '60px 40px', transformBox: 'view-box' }}
          >
            <path data-loop-l d="M60 40 C 44 22, 30 30, 44 40" />
            <path data-loop-r d="M60 40 C 76 22, 90 30, 76 40" />
            <circle cx="60" cy="40" r="3.5" fill="var(--gold)" />
          </g>
          <g data-lock opacity="0">
            <path
              data-shackle
              d="M53 80 L 53 74 A 7 7 0 0 1 67 74 L 67 80"
              fill="none"
              stroke="var(--foreground)"
              strokeWidth="3"
            />
            <rect
              x="49"
              y="79"
              width="22"
              height="17"
              rx="3"
              fill="var(--foreground)"
            />
            <circle cx="60" cy="87" r="2.5" fill="var(--secondary)" />
          </g>
        </svg>
      </button>
      <p className="text-small text-muted-foreground font-sans">
        {sealed ? sealedLabel : label}
      </p>
      <div aria-live="polite" className="w-full">
        {opened && (
          <div ref={card} className="love-gift-card">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
