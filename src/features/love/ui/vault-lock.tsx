'use client';

import { forwardRef } from 'react';

import { HIDDEN_HEART_IDS } from '../engine/hidden-hearts';

const C = 120;
const SOCKET_R = 68;
const HEART =
  'M0 6 C -7 1, -9 -3, -6 -6 C -4 -8, -1 -7, 0 -4 C 1 -7, 4 -8, 6 -6 C 9 -3, 7 1, 0 6 Z';

/** Socket centre for the i-th hidden heart, clockwise from the top. */
export function socketAt(i: number) {
  const a = ((-90 + i * (360 / HIDDEN_HEART_IDS.length)) * Math.PI) / 180;
  return { x: C + SOCKET_R * Math.cos(a), y: C + SOCKET_R * Math.sin(a) };
}

// Blueprint 059: the secret room's door. Five sockets (one per hidden heart) joined by a
// constellation; a dial in the middle. The two halves slide apart on unlock (afterglow-secret.tsx).
export const VaultLock = forwardRef<
  SVGSVGElement,
  { found: readonly string[] }
>(function VaultLock({ found }, ref) {
  const pts = HIDDEN_HEART_IDS.map((_, i) => socketAt(i));
  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 240 240"
      className="size-full overflow-visible"
    >
      <defs>
        <radialGradient id="vault-flood">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.95" />
          <stop
            offset="55%"
            stopColor="var(--love-aurora-gold)"
            stopOpacity="0.6"
          />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vault-metal" x1="0" y1="0" x2="1" y2="1">
          <stop
            offset="0%"
            stopColor="color-mix(in oklab, var(--surface) 80%, var(--gold))"
          />
          <stop
            offset="100%"
            stopColor="color-mix(in oklab, var(--surface) 92%, black)"
          />
        </linearGradient>
      </defs>
      <circle
        data-flood
        cx={C}
        cy={C}
        r="112"
        fill="url(#vault-flood)"
        opacity="0"
      />
      <g data-half-l>
        <path
          d={`M${C} 12 A108 108 0 0 0 ${C} 228 Z`}
          fill="url(#vault-metal)"
        />
      </g>
      <g data-half-r>
        <path
          d={`M${C} 12 A108 108 0 0 1 ${C} 228 Z`}
          fill="url(#vault-metal)"
        />
      </g>
      <circle
        data-rim
        cx={C}
        cy={C}
        r="108"
        fill="none"
        stroke="var(--gold)"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      <g data-face>
        <circle
          cx={C}
          cy={C}
          r="92"
          fill="none"
          stroke="var(--gold)"
          strokeOpacity="0.25"
          strokeDasharray="2 6"
        />
        {pts.map((p, i) => {
          const q = pts[(i + 1) % pts.length];
          return (
            <line
              key={`l${i}`}
              data-line={i}
              x1={p.x}
              y1={p.y}
              x2={q.x}
              y2={q.y}
              stroke="var(--gold)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}
        {HIDDEN_HEART_IDS.map((id, i) => {
          const p = pts[i];
          const lit = found.includes(id);
          return (
            <g
              key={id}
              data-socket={i}
              data-lit={lit || undefined}
              transform={`translate(${p.x} ${p.y})`}
            >
              <circle
                data-shimmer
                r="20"
                fill="var(--love-aurora-gold)"
                opacity="0"
              />
              <circle
                r="13"
                fill="color-mix(in oklab, var(--background) 70%, transparent)"
                stroke="var(--gold)"
                strokeOpacity={lit ? 0.9 : 0.35}
                strokeWidth="1.5"
              />
              <path
                d={HEART}
                fill={lit ? 'var(--gold)' : 'none'}
                stroke="var(--gold)"
                strokeOpacity={lit ? 1 : 0.35}
                strokeWidth="1"
                style={
                  lit
                    ? { filter: 'drop-shadow(0 0 4px var(--gold))' }
                    : undefined
                }
              />
            </g>
          );
        })}
        <g data-dial style={{ transformOrigin: `${C}px ${C}px` }}>
          <circle
            cx={C}
            cy={C}
            r="26"
            fill="url(#vault-metal)"
            stroke="var(--gold)"
            strokeWidth="1.5"
          />
          {Array.from({ length: 12 }, (_, i) => (
            <line
              key={i}
              x1={C}
              y1={C - 22}
              x2={C}
              y2={C - (i % 3 ? 19 : 16)}
              stroke="var(--gold)"
              strokeWidth="1.2"
              transform={`rotate(${i * 30} ${C} ${C})`}
            />
          ))}
          <path
            d={`M${C} ${C - 12} L ${C + 4} ${C} L ${C - 4} ${C} Z`}
            fill="var(--gold)"
          />
        </g>
      </g>
    </svg>
  );
});
