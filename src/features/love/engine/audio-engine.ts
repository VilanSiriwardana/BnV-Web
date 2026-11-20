import gsap from 'gsap';

import { band, lubDub, smoothFastAttack } from './audio-bands';
import { duckRamp } from './audio-duck';
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
  const voiceBass = readVoiceBass();
  if (voiceBass !== null) {
    bass = Math.min(1, voiceBass);
  } else if (live()) {
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
  if (document.hidden) voiceEl?.pause();
  if (!ctx || !el) return;
  if (document.hidden) {
    el.pause();
    void ctx.suspend();
  } else if (!muted && !failed) {
    void ctx.resume();
    void el.play().catch(() => {});
  }
}

function ensureContext() {
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new AC();
  }
  return ctx;
}

// Shared context for chimes and voice; null before the gate tap (no audio before a gesture).
export function getAudioContext(): AudioContext | null {
  if (!started) return null;
  try {
    const c = ensureContext();
    if (c.state === 'suspended' && !document.hidden) void c.resume();
    return c;
  } catch {
    return null;
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
    ctx = ensureContext();
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
    void el.play().then(() => {
      const r = duckRamp(VOLUME, voicePlaying(), false);
      ramp(r?.to ?? VOLUME, 0.6);
    }, fail);
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

// Romance Additions F2: a second element on the same context for the voice note. The music ducks
// while it plays and the heart beat follows the voice.
let voiceEl: HTMLAudioElement | null = null;
let voiceAnalyser: AnalyserNode | null = null;
let voiceData: Uint8Array<ArrayBuffer> | null = null;
let voiceFailed = false;
const voiceListeners = new Set<() => void>();
const voiceNotify = () => voiceListeners.forEach((l) => l());

function voicePlaying() {
  return !!voiceEl && !voiceEl.paused && !voiceEl.ended;
}

function applyDuck() {
  if (!ctx || !gain || !el || el.paused) return;
  const r = duckRamp(VOLUME, voicePlaying(), muted);
  if (r) ramp(r.to, r.seconds);
}

function readVoiceBass(): number | null {
  if (!voicePlaying() || !voiceAnalyser || !voiceData) return null;
  voiceAnalyser.getByteFrequencyData(voiceData);
  return band(voiceData, 0, 2);
}

function voiceElement(src: string) {
  if (voiceEl) return voiceEl;
  voiceEl = new Audio();
  voiceEl.preload = 'none';
  voiceEl.src = src;
  const update = () => {
    applyDuck();
    voiceNotify();
  };
  voiceEl.addEventListener('play', update);
  voiceEl.addEventListener('pause', update);
  voiceEl.addEventListener('ended', update);
  voiceEl.addEventListener('timeupdate', voiceNotify);
  voiceEl.addEventListener('error', () => {
    voiceFailed = true;
    voiceNotify();
  });
  return voiceEl;
}

// The graph is wired on the first play (inside her tap) so iOS allows it.
function connectVoice(v: HTMLAudioElement) {
  if (voiceAnalyser) return;
  const c = getAudioContext();
  if (!c) return;
  try {
    const source = c.createMediaElementSource(v);
    voiceAnalyser = c.createAnalyser();
    voiceAnalyser.fftSize = 512;
    voiceData = new Uint8Array(voiceAnalyser.frequencyBinCount);
    source.connect(voiceAnalyser).connect(c.destination);
  } catch {
    // Plays without the analyser: the beat falls back to the music.
  }
}

export const voice = {
  // preload="none" until the letter opens, then metadata.
  prepare(src: string) {
    const v = voiceElement(src);
    if (v.preload === 'none') v.preload = 'metadata';
  },
  play(src: string) {
    const v = voiceElement(src);
    connectVoice(v);
    if (v.ended) v.currentTime = 0;
    return v.play();
  },
  pause() {
    voiceEl?.pause();
  },
  state() {
    const v = voiceEl;
    return {
      playing: voicePlaying(),
      failed: voiceFailed,
      ended: !!v?.ended,
      progress: v && v.duration ? v.currentTime / v.duration : 0,
    };
  },
  subscribe(listener: () => void) {
    voiceListeners.add(listener);
    return () => voiceListeners.delete(listener);
  },
};
