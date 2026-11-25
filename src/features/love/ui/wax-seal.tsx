'use client';

import { cn } from '@/lib/utils/cn';

const HEART =
  'M44 58 C 30 49, 26 41, 31 35 C 35 30, 41 31, 44 36 C 47 31, 53 30, 57 35 C 62 41, 58 49, 44 58 Z';
// Four irregular shards that together make the seal disc (centre 44,44, r 26).
const SHARDS = [
  'M44 44 L 44 18 A 26 26 0 0 1 68 34 L 52 40 Z',
  'M44 44 L 52 40 L 68 34 A 26 26 0 0 1 58 66 Z',
  'M44 44 L 58 66 A 26 26 0 0 1 22 60 L 38 50 Z',
  'M44 44 L 38 50 L 22 60 A 26 26 0 0 1 44 18 Z',
];

// Blueprint 059: a wax seal. Unbroken: four shard paths + embossed heart + a DrawSVG ring the
// hold traces. Broken: a flat gold stamp with a crack, left on the envelope as a keepsake.
export function WaxSeal({
  broken,
  className,
}: {
  broken: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 88 88"
      className={cn('size-full overflow-visible', className)}
    >
      <circle
        data-ring
        cx="44"
        cy="44"
        r="38"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="3"
        strokeLinecap="round"
        transform="rotate(-90 44 44)"
        style={{ strokeDasharray: broken ? undefined : '0 999' }}
        opacity={broken ? 0.5 : 1}
      />
      {broken ? (
        <g opacity="0.9">
          <circle
            cx="44"
            cy="44"
            r="24"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="2"
            strokeDasharray="3 4"
          />
          <path d={HEART} fill="var(--gold)" opacity="0.8" />
          <path
            d="M40 22 L 46 38 L 40 48 L 48 66"
            fill="none"
            stroke="var(--background)"
            strokeWidth="1.5"
          />
        </g>
      ) : (
        <g data-seal style={{ transformOrigin: '44px 44px' }}>
          {SHARDS.map((d, i) => (
            <path
              key={i}
              data-shard
              d={d}
              fill="var(--primary)"
              stroke="color-mix(in oklab, var(--primary) 70%, black)"
              strokeWidth="0.8"
            />
          ))}
          <path
            data-shard
            d={HEART}
            fill="color-mix(in oklab, var(--primary) 70%, black)"
            stroke="color-mix(in oklab, var(--primary) 85%, white)"
            strokeWidth="1"
          />
        </g>
      )}
    </svg>
  );
}
