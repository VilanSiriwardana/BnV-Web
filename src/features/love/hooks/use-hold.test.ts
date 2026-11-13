import { describe, expect, it, vi } from 'vitest';

import { createHoldController } from './use-hold';

function setup(duration = 1000) {
  let t = 0;
  let queued: (() => void) | null = null;
  const eased: number[] = [];
  const onProgress = vi.fn();
  const onComplete = vi.fn();
  const c = createHoldController(() => ({ duration, onProgress, onComplete }), {
    now: () => t,
    raf: (cb) => {
      queued = cb;
      return 1;
    },
    cancel: () => {
      queued = null;
    },
    ease: (from, report) => {
      eased.push(from);
      report(0);
      return () => {};
    },
  });
  const advance = (ms: number) => {
    t += ms;
    const cb = queued;
    queued = null;
    cb?.();
  };
  return { c, advance, onProgress, onComplete, eased };
}

describe('createHoldController', () => {
  it('reports progress and completes once at full duration', () => {
    const { c, advance, onProgress, onComplete } = setup();
    c.begin();
    advance(500);
    expect(onProgress).toHaveBeenLastCalledWith(0.5);
    advance(600);
    expect(onProgress).toHaveBeenLastCalledWith(1);
    expect(onComplete).toHaveBeenCalledTimes(1);
    advance(100);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('ignores a repeated begin while holding (key repeat)', () => {
    const { c, advance, onProgress } = setup();
    c.begin();
    advance(400);
    c.begin();
    advance(100);
    expect(onProgress).toHaveBeenLastCalledWith(0.5);
  });

  it('eases back to 0 on early release and never completes', () => {
    const { c, advance, onProgress, onComplete, eased } = setup();
    c.begin();
    advance(300);
    c.release();
    expect(eased).toEqual([0.3]);
    expect(onProgress).toHaveBeenLastCalledWith(0);
    advance(2000);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('complete() finishes immediately once (tap alternative)', () => {
    const { c, onComplete, onProgress } = setup();
    c.complete();
    c.complete();
    expect(onProgress).toHaveBeenLastCalledWith(1);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('reset() allows a new hold after completion', () => {
    const { c, advance, onComplete } = setup();
    c.complete();
    c.reset();
    c.begin();
    advance(1000);
    expect(onComplete).toHaveBeenCalledTimes(2);
  });
});
