'use client';

import { useEffect, useRef, useState } from 'react';

import { calibrate, CALIBRATE_MS, updateBlow } from '../engine/blow-detector';
import { director } from '../engine/heart-director';
import { HEART_EVENTS } from '../engine/heart-director-core';
import { SECTION_IDS } from '../engine/heart-path';
import { heart } from '../engine/heart-state';
import { useMotionPrefs } from '../engine/motion-prefs';
import { useLoveScroll } from '../engine/scroll-engine';
import { renderStats } from '../engine/render-stats';
import { type MicInput, openMic } from '../engine/mic-input';
import { resetSession } from '../engine/session';
import { useTier } from '../engine/tier-provider';
import { TIER_ORDER } from '../engine/tiers';

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
    if (!target || !(SECTION_IDS as readonly string[]).includes(target)) return;
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
        {SECTION_IDS.map((s) => (
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
      <MicTest />
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

// M28 spike: live blow-detector values for tuning thresholds on real phones (ADR-0033).
function MicTest() {
  const [on, setOn] = useState(false);
  const [readout, setReadout] = useState('');
  const mic = useRef<MicInput | null>(null);

  useEffect(() => {
    if (!on) return;
    let raf = 0;
    let alive = true;
    void openMic().then(
      (input) => {
        if (!alive) return input.stop();
        mic.current = input;
        const start = performance.now();
        let last = start;
        const samples: number[] = [];
        let state = calibrate([]);
        const loop = (now: number) => {
          const f = input.read();
          if (now - start < CALIBRATE_MS) {
            samples.push(f.rms);
            state = calibrate(samples);
          } else {
            state = updateBlow(
              state,
              f.rms,
              f.lowRatio,
              f.flatness,
              now - last,
            );
          }
          last = now;
          setReadout(
            `rms ${f.rms.toFixed(3)} base ${state.baseline.toFixed(3)}\nlow ${f.lowRatio.toFixed(2)} flat ${f.flatness.toFixed(2)}\nblow ${state.blow.toFixed(2)}`,
          );
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      },
      (e: unknown) => setReadout(`mic error: ${String(e)}`),
    );
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      mic.current?.stop();
      mic.current = null;
    };
  }, [on]);

  return (
    <div className="mb-3">
      <button
        type="button"
        aria-pressed={on}
        className={button}
        onClick={() => setOn((v) => !v)}
      >
        Mic test {on ? 'on' : 'off'}
      </button>
      {on && <pre className="mt-1 whitespace-pre-wrap">{readout}</pre>}
    </div>
  );
}
