import type { CSSProperties } from 'react';

import { mulberry32 } from '../canvas/heart-geometry';

const HEART_D =
  'M12 21 C 5 15.5, 1 12, 1 7.5 C 1 4, 3.6 1.5, 6.8 1.5 C 9 1.5, 10.9 2.8, 12 4.8 C 13.1 2.8, 15 1.5, 17.2 1.5 C 20.4 1.5, 23 4, 23 7.5 C 23 12, 19 15.5, 12 21 Z';

export function TinyHeart({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg aria-hidden viewBox="0 0 24 22" className={className} style={style}>
      <path d={HEART_D} fill="currentColor" />
    </svg>
  );
}

// Three depth layers of tiny gold hearts (parallax scrubbed in story.ts buildLetter).
const LAYERS = [
  { count: 26, size: [6, 9], opacity: 0.15, blur: 1.5 },
  { count: 18, size: [9, 13], opacity: 0.24, blur: 0.5 },
  { count: 10, size: [13, 18], opacity: 0.36, blur: 0 },
] as const;

const HEARTS = LAYERS.map((layer, li) => {
  const rand = mulberry32(31 + li * 97);
  return Array.from({ length: layer.count }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: layer.size[0] + rand() * (layer.size[1] - layer.size[0]),
    rotate: (rand() - 0.5) * 50,
  }));
});

export function LetterBackdrop() {
  return (
    <div
      aria-hidden
      // Covers the whole sticky stage (offset by the section padding) with soft edges: no seam.
      className="pointer-events-none absolute inset-x-0 -top-24 h-svh overflow-hidden [mask-image:linear-gradient(transparent,#000_12%,#000_88%,transparent)] md:-top-32"
    >
      <div className="love-grain absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,color-mix(in_oklab,var(--gold)_10%,transparent),transparent_70%)]" />
      {HEARTS.map((hearts, li) => (
        <div
          key={li}
          data-letter-layer={li}
          className="text-gold absolute inset-0"
          style={{
            opacity: LAYERS[li].opacity,
            filter: LAYERS[li].blur ? `blur(${LAYERS[li].blur}px)` : undefined,
          }}
        >
          {hearts.map((h, i) => (
            <TinyHeart
              key={i}
              className="absolute"
              style={{
                left: `${h.left}%`,
                top: `${h.top}%`,
                width: h.size,
                transform: `rotate(${h.rotate}deg)`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Corner flourish growing out of the inner border line (8 px in); the borders round with the same radius.
function Curl({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 64"
      className={`text-gold absolute size-16 overflow-visible ${className}`}
    >
      <path
        d="M8 58 C10 36, 20 18, 40 13 C51 10, 56 20, 49 26 C43 31, 35 26, 39 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M58 8 C46 9, 34 12, 27 17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="22" cy="22" r="1.8" fill="currentColor" />
    </svg>
  );
}

// Gold double stripes, corner curls and a ribbon band, laid over the parchment.
export function ParchmentFrame() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="love-grain absolute inset-0 rounded-[inherit]" />
      <div className="border-gold/70 absolute inset-2 rounded-[2rem] border-2 md:inset-3" />
      <div className="border-gold/50 absolute inset-4 rounded-[1.5rem] border md:inset-5" />
      <Curl className="top-2 left-2 md:top-3 md:left-3" />
      <Curl className="top-2 right-2 -scale-x-100 md:top-3 md:right-3" />
      <Curl className="bottom-2 left-2 -scale-y-100 md:bottom-3 md:left-3" />
      <Curl className="right-2 bottom-2 -scale-100 md:right-3 md:bottom-3" />
      <div className="absolute top-0 right-10 flex h-24 w-8 flex-col items-center md:right-16 md:h-28">
        <div className="bg-secondary w-full flex-1 shadow-[inset_-3px_0_0_color-mix(in_oklab,var(--gold)_60%,transparent)]" />
        <div className="border-t-secondary size-0 border-x-[16px] border-t-[12px] border-x-transparent" />
      </div>
    </div>
  );
}

export function HeartDivider() {
  return (
    <div
      aria-hidden
      className="text-gold flex items-center justify-center gap-3"
    >
      <span className="h-px w-16 bg-current opacity-60" />
      <TinyHeart className="size-3" />
      <TinyHeart className="size-4" />
      <TinyHeart className="size-3" />
      <span className="h-px w-16 bg-current opacity-60" />
    </div>
  );
}
