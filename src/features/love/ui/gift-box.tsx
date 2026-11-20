'use client';

import gsap from 'gsap';
import { type ReactNode, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils/cn';

import { director } from '../engine/heart-director';
import { useQuiet } from '../engine/use-quiet';
import { useHold } from '../hooks/use-hold';

type Props = {
  index: number;
  total: number;
  label: string;
  opened: boolean;
  sealed: boolean;
  onOpen: () => void;
  children: ReactNode;
};

const HOLD_MS = 800;

// Romance Additions F7: hold to untie. Progress lifts the lid a little; release eases back.
export function GiftBox({
  index,
  total,
  label,
  opened,
  sealed,
  onOpen,
  children,
}: Props) {
  const quiet = useQuiet();
  const svg = useRef<SVGSVGElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    tl.current = gsap
      .timeline({ paused: true })
      .to(q('[data-ribbon]'), { scaleY: 0.2, opacity: 0, duration: 0.4 }, 0)
      .to(
        q('[data-lid]'),
        { y: -26, rotate: -12, duration: 0.6, ease: 'back.out(1.6)' },
        0.15,
      )
      .to(q('[data-light]'), { opacity: 1, duration: 0.5 }, 0.3);
    if (opened) tl.current.progress(1);
    return () => {
      tl.current?.kill();
      tl.current = null;
    };
    // `opened` only seeds the first paint; later opens play the timeline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = () => {
    if (opened || sealed) return;
    if (quiet) tl.current?.progress(1);
    else tl.current?.play();
    void director.play('giftOpen');
    onOpen();
  };

  const { handlers, complete } = useHold({
    duration: HOLD_MS,
    onProgress: (p) => !opened && tl.current?.progress(p * 0.25),
    onComplete: open,
    completeOnClick: quiet,
  });

  const state = opened ? 'open' : sealed ? 'sealed' : 'waiting';

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <button
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
              ? 'sealed for next time'
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
          className="size-full overflow-visible"
        >
          <ellipse
            data-light
            cx="60"
            cy="52"
            rx="44"
            ry="30"
            fill="var(--love-aurora-gold)"
            opacity="0"
          />
          <rect
            x="22"
            y="56"
            width="76"
            height="52"
            rx="6"
            fill="var(--secondary)"
          />
          <rect x="54" y="56" width="12" height="52" fill="var(--gold)" />
          <g
            data-lid
            style={{ transformOrigin: '30px 56px', transformBox: 'view-box' }}
          >
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
            data-ribbon
            fill="none"
            stroke="var(--gold)"
            strokeWidth="5"
            strokeLinecap="round"
            style={{ transformOrigin: '60px 40px', transformBox: 'view-box' }}
          >
            <path d="M60 40 C 44 22, 30 30, 44 40" />
            <path d="M60 40 C 76 22, 90 30, 76 40" />
          </g>
        </svg>
      </button>
      <p className="text-small text-muted-foreground font-sans">
        {sealed ? 'Maybe next time…' : label}
      </p>
      <div aria-live="polite" className="w-full">
        {opened && <div className="love-gift-card">{children}</div>}
      </div>
    </div>
  );
}
