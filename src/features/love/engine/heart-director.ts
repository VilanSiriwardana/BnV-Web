import gsap from 'gsap';

import {
  createDirectorCore,
  type HeartEvent,
  type PlayOptions,
} from './heart-director-core';
import { HEART_PATH, type SectionId } from './heart-path';
import { heart } from './heart-state';
import { REDUCED_MOTION_QUERY } from './motion-prefs';

export type { HeartEvent, PlayOptions };

let section: SectionId = 'hero';
let baselineTween: gsap.core.Tween | null = null;

const baseGlow = () => HEART_PATH[section].glow;
const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia(REDUCED_MOTION_QUERY).matches;

// flinch is a scale offset (scale × (1 + flinch)), so pulses never fight the scrubbed heart.scale.
function pulse(tl: gsap.core.Timeline, at: number | string = '>') {
  tl.to(heart, { flinch: 0.06, duration: 0.12, ease: 'power2.out' }, at)
    .to(heart, { flinch: 0, duration: 0.1, ease: 'power1.in' })
    .to(heart, { flinch: 0.04, duration: 0.1, ease: 'power2.out' })
    .to(heart, { flinch: 0, duration: 0.18, ease: 'power1.in' });
}

function flash(tl: gsap.core.Timeline, duration = 0.2) {
  tl.to(heart, { glow: baseGlow() + 0.3, duration: duration / 2 }).to(heart, {
    glow: baseGlow(),
    duration: duration / 2,
  });
}

function burst(tl: gsap.core.Timeline, opts: PlayOptions) {
  tl.to(heart, { burst: 1, duration: 1.1, ease: 'power3.out' }, '>').to(
    heart,
    { glow: 0.3, duration: 1.1, ease: 'power3.out' },
    '<',
  );
  if (opts.petals)
    tl.fromTo(
      heart,
      { petalRelease: 0 },
      { petalRelease: 1, duration: 2, ease: 'power1.out' },
      '<',
    );
}

function reform(tl: gsap.core.Timeline) {
  tl.to(heart, { burst: 0, duration: 1.6, ease: 'power2.inOut' }, '>')
    .to(
      heart,
      { glow: baseGlow() + 0.25, duration: 1.6, ease: 'power2.inOut' },
      '<',
    )
    .to(heart, { glow: baseGlow(), duration: 0.8, ease: 'power2.inOut' });
  pulse(tl, '<');
}

// Experience §3.5 durations and eases. Unbuilt events (later phases) play a pulse for now.
function build(event: HeartEvent, opts: PlayOptions, tl: gsap.core.Timeline) {
  if (reduced()) {
    switch (event) {
      case 'ribbonWeave':
        tl.set(heart, { form: 1 });
        return;
      case 'shine':
      case 'reform':
        return;
      case 'glowUp':
        flash(tl, 0.25);
        return;
      default:
        flash(tl);
        return;
    }
  }
  switch (event) {
    case 'ribbonWeave':
      tl.fromTo(
        heart,
        { form: 0 },
        { form: 1, duration: 3.2, ease: 'power2.inOut' },
      );
      return;
    case 'pulse':
      pulse(tl, 0);
      return;
    case 'glowUp':
      tl.to(heart, {
        glow: baseGlow() + 0.5,
        duration: 0.9,
        ease: 'power2.out',
      }).to(heart, { glow: baseGlow(), duration: 1.4, ease: 'power2.inOut' });
      return;
    case 'shine':
      tl.fromTo(
        heart,
        { shine: 0 },
        { shine: 1, duration: 1.1, ease: 'power1.inOut' },
      ).set(heart, { shine: 0 });
      return;
    case 'burst':
      burst(tl, opts);
      return;
    case 'reform':
      reform(tl);
      return;
    case 'burstReform':
      burst(tl, opts);
      tl.to({}, { duration: 0.5 });
      reform(tl);
      return;
    default:
      pulse(tl, 0);
  }
}

function toBaseline() {
  baselineTween?.kill();
  baselineTween = gsap.to(heart, {
    burst: 0,
    form: 1,
    ring: 0,
    flinch: 0,
    shine: 0,
    glow: baseGlow(),
    duration: 0.3,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}

const core = createDirectorCore({
  now: () => performance.now(),
  toBaseline,
  run(event, opts, done) {
    baselineTween?.kill();
    const tl = gsap.timeline({ paused: true, onComplete: done });
    build(event, opts, tl);
    tl.play();
    return { kill: () => tl.kill() };
  },
});

export const director = {
  play: core.play,
  settle: core.settle,
  isBusy: core.isBusy,
  current: core.current,
  setBaseline(id: SectionId) {
    section = id;
  },
  baseline: () => section,
};
