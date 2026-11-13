'use client';

import { useEffect, useState } from 'react';

import { director } from '../engine/heart-director';
import { HEART_EVENTS } from '../engine/heart-director-core';
import { heart } from '../engine/heart-state';
import { useMotionPrefs } from '../engine/motion-prefs';
import { useLoveScroll } from '../engine/scroll-engine';
import { renderStats } from '../engine/render-stats';
import { resetSession } from '../engine/session';
import { useTier } from '../engine/tier-provider';
import { TIER_ORDER } from '../engine/tiers';

const SECTIONS = [
  'hero',
  'bloom',
  'memories',
  'timeline',
  'starlight',
  'gallery',
  'dance',
  'wish',
  'letter',
  'finale',
];

const button =
  'rounded-sm border border-border px-2 py-1 hover:bg-primary-soft aria-pressed:bg-primary aria-pressed:text-primary-foreground';

// Dev only (Experience §18): loaded by love-experience.tsx when NODE_ENV !== 'production' and ?debug.
export default function HeartDebugPanel() {
  const { tier, setTier } = useTier();
  const { calm, reason, setCalm } = useMotionPrefs();
  const { scrollTo } = useLoveScroll();
  const [snapshot, setSnapshot] = useState(() => JSON.stringify(heart));

  useEffect(() => {
    const id = window.setInterval(
      () =>
        setSnapshot(
          JSON.stringify({ ...heart, gl: { ...renderStats } }, null, 1),
        ),
      250,
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get('s');
    if (!target || !SECTIONS.includes(target)) return;
    const id = window.setTimeout(
      () => scrollTo(`#${target}`, { immediate: true }),
      300,
    );
    return () => window.clearTimeout(id);
  }, [scrollTo]);

  return (
    <aside
      aria-label="Heart debug panel"
      className="border-border bg-surface-elevated/95 text-foreground fixed top-4 left-4 z-30 max-h-[80svh] w-64 overflow-auto rounded-md border p-3 font-sans text-xs shadow-lg"
    >
      <p className="mb-1 font-semibold">Tier</p>
      <div className="mb-3 flex flex-wrap gap-1">
        {TIER_ORDER.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tier === t}
            className={button}
            onClick={() => setTier(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <button
        type="button"
        aria-pressed={calm}
        className={`${button} mb-3`}
        onClick={() => setCalm(!calm)}
      >
        Calm {calm ? `on (${reason})` : 'off'}
      </button>
      <p className="mb-1 font-semibold">Jump</p>
      <div className="mb-3 flex flex-wrap gap-1">
        {SECTIONS.map((s) => (
          <button
            key={s}
            type="button"
            className={button}
            onClick={() => scrollTo(`#${s}`)}
          >
            {s}
          </button>
        ))}
      </div>
      <p className="mb-1 font-semibold">
        Events (baseline: {director.baseline()})
      </p>
      <div className="mb-3 flex flex-wrap gap-1">
        {HEART_EVENTS.map((e) => (
          <button
            key={e}
            type="button"
            className={button}
            onClick={() => director.play(e)}
          >
            {e}
          </button>
        ))}
        <button
          type="button"
          className={button}
          onClick={() => director.settle()}
        >
          settle
        </button>
        <button
          type="button"
          className={button}
          onClick={() => {
            resetSession();
            director.settle();
          }}
        >
          reset session
        </button>
      </div>
      <label className="mb-3 flex items-center gap-2">
        form
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          defaultValue={heart.form}
          onChange={(e) => (heart.form = Number(e.target.value))}
        />
      </label>
      <p className="mb-1 font-semibold">heart</p>
      <pre className="whitespace-pre-wrap">{snapshot}</pre>
    </aside>
  );
}
