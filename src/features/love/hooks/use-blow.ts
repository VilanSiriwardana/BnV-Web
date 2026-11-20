'use client';

import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import { calibrate, CALIBRATE_MS, updateBlow } from '../engine/blow-detector';
import { type MicInput, openMic } from '../engine/mic-input';

export type BlowStatus = 'idle' | 'starting' | 'listening' | 'denied';

type Options = {
  /** False in Calm/static: the mic is never requested and any live stream stops. */
  enabled: boolean;
  /** The section; leaving it stops the mic. */
  sectionRef: RefObject<HTMLElement | null>;
  onProgress: (blow: number) => void;
  onBlown: () => void;
};

const noSubscribe = () => () => {};
const readSupported = () =>
  typeof navigator.mediaDevices?.getUserMedia === 'function';
const serverFalse = () => false;

// Romance Additions F5 / ADR-0033: the mic is requested only from start() (her tap), analysed in
// memory and stopped on success, section leave, tab hidden, unmount, error and Calm switching on.
export function useBlow({ enabled, sectionRef, onProgress, onBlown }: Options) {
  const supported = useSyncExternalStore(
    noSubscribe,
    readSupported,
    serverFalse,
  );
  const [status, setStatus] = useState<BlowStatus>('idle');
  const mic = useRef<MicInput | null>(null);
  const raf = useRef(0);
  const run = useRef(0);
  const cb = useRef({ onProgress, onBlown });
  useEffect(() => {
    cb.current = { onProgress, onBlown };
  }, [onProgress, onBlown]);

  const release = useCallback(() => {
    run.current++;
    cancelAnimationFrame(raf.current);
    mic.current?.stop();
    mic.current = null;
  }, []);

  const stop = useCallback(() => {
    release();
    setStatus((s) => (s === 'denied' ? s : 'idle'));
  }, [release]);

  const start = useCallback(async () => {
    if (!enabled || !supported || mic.current) return;
    const id = ++run.current;
    setStatus('starting');
    let input: MicInput;
    try {
      input = await openMic();
    } catch {
      if (id === run.current) setStatus('denied');
      return;
    }
    if (id !== run.current) return input.stop();
    mic.current = input;
    setStatus('listening');
    const begin = performance.now();
    let last = begin;
    const samples: number[] = [];
    let state = calibrate([]);
    const loop = (now: number) => {
      if (id !== run.current) return;
      try {
        const f = input.read();
        if (now - begin < CALIBRATE_MS) {
          samples.push(f.rms);
          state = calibrate(samples);
        } else {
          state = updateBlow(state, f.rms, f.lowRatio, f.flatness, now - last);
          cb.current.onProgress(state.blow);
        }
        last = now;
        if (state.blow >= 1) {
          // The mic stops before the star rises.
          stop();
          cb.current.onBlown();
          return;
        }
      } catch {
        stop();
        return;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  }, [enabled, supported, stop]);

  useEffect(() => {
    if (!enabled) release();
  }, [enabled, release]);

  useEffect(() => {
    const onHidden = () => document.hidden && stop();
    document.addEventListener('visibilitychange', onHidden);
    const section = sectionRef.current?.closest('section') ?? null;
    const io = section
      ? new IntersectionObserver(([e]) => !e.isIntersecting && stop())
      : null;
    if (section) io!.observe(section);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      io?.disconnect();
      stop();
    };
  }, [sectionRef, stop]);

  return {
    supported: supported && enabled,
    status: enabled ? status : 'idle',
    start,
    stop,
  };
}
