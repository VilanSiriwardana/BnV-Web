'use client';

import gsap from 'gsap';
import { useEffect, useMemo, useRef } from 'react';

type HoldOptions = {
  duration: number; // ms
  onProgress: (p: number) => void;
  onComplete: () => void;
  completeOnClick?: boolean;
};

type Clock = {
  now: () => number;
  raf: (cb: () => void) => number;
  cancel: (id: number) => void;
  // Eases progress back to 0 (0.6 s); returns a stopper.
  ease: (from: number, report: (p: number) => void) => () => void;
};

// Pure hold state machine (Experience §12), tested without a DOM.
export function createHoldController(opts: () => HoldOptions, clock: Clock) {
  let active = false;
  let done = false;
  let start = 0;
  let frame = 0;
  let progress = 0;
  let stopEase: (() => void) | null = null;

  const tick = () => {
    if (!active) return;
    const o = opts();
    progress = Math.min(1, (clock.now() - start) / o.duration);
    o.onProgress(progress);
    if (progress >= 1) {
      active = false;
      done = true;
      o.onComplete();
      return;
    }
    frame = clock.raf(tick);
  };

  return {
    begin() {
      if (active) return;
      stopEase?.();
      stopEase = null;
      done = false;
      active = true;
      // Resume from where an eased-back hold currently is.
      start = clock.now() - progress * opts().duration;
      frame = clock.raf(tick);
    },
    release() {
      if (!active) return;
      active = false;
      clock.cancel(frame);
      if (done) return;
      stopEase = clock.ease(progress, (p) => {
        progress = p;
        opts().onProgress(p);
      });
    },
    complete() {
      if (done) return;
      active = false;
      clock.cancel(frame);
      stopEase?.();
      done = true;
      progress = 1;
      const o = opts();
      o.onProgress(1);
      o.onComplete();
    },
    reset() {
      active = false;
      done = false;
      progress = 0;
      clock.cancel(frame);
      stopEase?.();
      stopEase = null;
    },
    dispose() {
      active = false;
      clock.cancel(frame);
      stopEase?.();
    },
  };
}

const browserClock: Clock = {
  now: () => performance.now(),
  raf: (cb) => requestAnimationFrame(cb),
  cancel: (id) => cancelAnimationFrame(id),
  ease(from, report) {
    const state = { p: from };
    const tween = gsap.to(state, {
      p: 0,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => report(state.p),
    });
    return () => tween.kill();
  },
};

const isHoldKey = (key: string) => key === ' ' || key === 'Enter';
type Controller = ReturnType<typeof createHoldController>;

// Press-and-hold for a real <button>: pointer capture, Space/Enter without repeat, cleanup.
export function useHold(options: HoldOptions) {
  const opts = useRef(options);
  const ctl = useRef<Controller | null>(null);
  useEffect(() => {
    opts.current = options;
  });
  useEffect(() => () => ctl.current?.dispose(), []);

  // Created on first use (an event), so refs are never read during render.
  const handlers = useMemo(() => {
    const get = () =>
      (ctl.current ??= createHoldController(() => opts.current, browserClock));
    const release = () => get().release();
    return {
      onPointerDown(e: React.PointerEvent<HTMLElement>) {
        if (e.button !== 0 || opts.current.completeOnClick) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        get().begin();
      },
      onPointerUp: release,
      onPointerCancel: release,
      onLostPointerCapture: release,
      onKeyDown(e: React.KeyboardEvent) {
        if (!isHoldKey(e.key)) return;
        e.preventDefault();
        if (e.repeat || opts.current.completeOnClick) return;
        get().begin();
      },
      onKeyUp(e: React.KeyboardEvent) {
        if (!isHoldKey(e.key)) return;
        e.preventDefault();
        if (opts.current.completeOnClick) get().complete();
        else release();
      },
      onClick() {
        if (opts.current.completeOnClick) get().complete();
      },
      onContextMenu(e: React.MouseEvent) {
        e.preventDefault();
      },
      complete: () => get().complete(),
      reset: () => get().reset(),
    };
  }, []);

  const { complete, reset, ...rest } = handlers;
  return { handlers: rest, complete, reset };
}
