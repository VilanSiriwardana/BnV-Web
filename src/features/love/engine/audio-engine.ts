import gsap from 'gsap';

import { band, lubDub, smoothFastAttack } from './audio-bands';
import { heart } from './heart-state';

// Experience §3.7 / Tech Stack §5.9. Created only on the gate tap. Per-frame work runs on the
// GSAP ticker, never React. Without a playable file (or while muted) a 72 bpm lub-dub drives the beat.

const FADE_IN = 2;
const VOLUME = 0.6;

let ctx: AudioContext | null = null;
let el: HTMLAudioElement | null = null;
let gain: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let data: Uint8Array<ArrayBuffer> | null = null;
let started = false;
let muted = false;
let failed = false;
let elapsed = 0;

export const bands = { bass: 0, mid: 0, treble: 0 };

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function live() {
  return !!(analyser && data && el && !el.paused && !muted && !failed);
}

function tick(_time: number, deltaMs: number) {
  elapsed += deltaMs / 1000;
  let bass = 0;
  let mid = 0;
  let treble = 0;
  if (live()) {
    analyser!.getByteFrequencyData(data!);
    bass = band(data!, 0, 2);
    mid = band(data!, 3, 12);
    treble = band(data!, 13, 60);
  } else {
    bass = lubDub(elapsed) * 0.8;
  }
  bands.bass = smoothFastAttack(bands.bass, bass);
  bands.mid = smoothFastAttack(bands.mid, mid, 0.94);
  bands.treble = smoothFastAttack(bands.treble, treble, 0.85);
  heart.beat = Math.min(1, bands.bass ** 1.5);
}

function fail() {
  failed = true;
  notify();
}

function ramp(to: number, seconds: number) {
  if (!ctx || !gain) return;
  const now = ctx.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.linearRampToValueAtTime(to, now + seconds);
}

function onVisibility() {
  if (!ctx || !el) return;
  if (document.hidden) {
    el.pause();
    void ctx.suspend();
  } else if (!muted && !failed) {
    void ctx.resume();
    void el.play().catch(() => {});
  }
}

// Must be called synchronously inside the tap handler (iOS unlock).
function start(src: string) {
  if (started) return;
  started = true;
  gsap.ticker.add(tick);
  document.addEventListener('visibilitychange', onVisibility);
  if (!src) return fail();
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new AC();
    el = new Audio(src);
    el.loop = true;
    el.preload = 'auto';
    el.addEventListener('error', fail);
    const source = ctx.createMediaElementSource(el);
    gain = ctx.createGain();
    gain.gain.value = 0;
    analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    data = new Uint8Array(analyser.frequencyBinCount);
    source.connect(gain).connect(analyser).connect(ctx.destination);
    void ctx.resume();
    el.play().then(() => ramp(VOLUME, FADE_IN), fail);
  } catch {
    fail();
  }
}

function mute() {
  muted = true;
  el?.pause();
  notify();
}

function unmute() {
  muted = false;
  if (el && ctx && !failed) {
    void ctx.resume();
    if (gain) gain.gain.value = 0;
    void el.play().then(() => ramp(VOLUME, 0.6), fail);
  }
  notify();
}

export const audio = {
  start,
  mute,
  unmute,
  bands,
  isMuted: () => muted,
  hasTrack: () => started && !failed,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
