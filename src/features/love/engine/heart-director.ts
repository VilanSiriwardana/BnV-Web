import gsap from 'gsap';

import { spawnTapHearts } from '../canvas/mini-hearts';
import { launchConfetti } from './confetti-state';
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
let glowTween: gsap.core.Tween | null = null;
// Timeline only: the heart stays brighter after the arrow strike ("stronger").
const STRIKE_BOOST = 0.15;
let boost = 0;

const baseGlow = () =>
  HEART_PATH[section].glow + (section === 'timeline' ? boost : 0);
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

function burst(
  tl: gsap.core.Timeline,
  opts: PlayOptions,
  at: number | string = '>',
) {
  tl.to(heart, { burst: 1, duration: 1.1, ease: 'power3.out' }, at).to(
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
      case 'dockToSeal':
        tl.set(heart, { scale: opts.scale ?? heart.scale, sealRim: 1 });
        return;
      case 'wishMerge':
        tl.to(heart, { starHold: 0, duration: 0.3 }, 0);
        flash(tl, 0.6);
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
    case 'arrowStrike':
      arrowStrike(tl);
      return;
    case 'wishMerge':
      wishMerge(tl);
      return;
    case 'dockToSeal':
      tl.to(heart, {
        scale: opts.scale ?? heart.scale,
        sealRim: 1,
        duration: 0.9,
        ease: 'power3.inOut',
      });
      return;
    case 'sealBreak':
      tl.call(() => spawnTapHearts(8))
        .call(() => spawnTapHearts(8), [], 0.3)
        .to(heart, { sealRim: 0, duration: 0.3 }, 0);
      flash(tl);
      return;
    case 'finaleBurst':
      tl.to(heart, { glow: baseGlow() + 0.3, duration: 0.3 });
      burst(tl, opts);
      tl.call(() => void launchConfetti(0.5), [], '<');
      tl.to({}, { duration: 0.5 });
      reform(tl);
      return;
    default:
      pulse(tl, 0);
  }
}

// Experience §3.5 arrowStrike (≈ 5.2 s). The boost is set first so an interrupted strike still
// settles to the brighter baseline.
function arrowStrike(tl: gsap.core.Timeline) {
  boost = STRIKE_BOOST;
  const glow = baseGlow();
  tl.to(heart, { glow: glow - 0.15, flinch: -0.03, duration: 0.2 }, 0)
    .fromTo(
      heart,
      { arrow: 0 },
      { arrow: 1, duration: 0.9, ease: 'power1.in' },
      0.2,
    )
    .to(heart, { flinch: -0.08, duration: 0.08, ease: 'power2.out' }, 1.1)
    .to(heart, { flinch: 0.06, duration: 0.22, ease: 'power2.out' })
    .to(heart, { flinch: 0, duration: 0.3, ease: 'power2.inOut' })
    .fromTo(
      heart,
      { ring: 0 },
      { ring: 1, duration: 0.8, ease: 'power2.out' },
      1.1,
    )
    .to(heart, { glow: glow * 2, duration: 0.04 }, 1.1)
    .to(heart, { glow, duration: 0.08 }, 1.14)
    .fromTo(
      heart,
      { cameraShake: 0.015 },
      { cameraShake: 0, duration: 0.25, ease: 'power2.out' },
      1.1,
    )
    .set(heart, { arrow: 0 }, 1.45);
  burst(tl, {}, 1.4);
  tl.to({}, { duration: 0.5 });
  reform(tl);
}

// Experience §12 wishMerge (≈ 4 s): flash, burst with confetti, reform; the message is DOM-side.
function wishMerge(tl: gsap.core.Timeline) {
  tl.to(heart, { glow: 1, starHold: 1, duration: 0.3, ease: 'power2.out' }, 0)
    .call(() => void launchConfetti(), [], 0.3)
    .to(heart, { star: 0, duration: 0.4 }, 0.3);
  burst(tl, {}, 0.3);
  tl.to({}, { duration: 0.2 });
  reform(tl);
  tl.to(heart, { star: 1, starHold: 0, duration: 0.6 }, '<');
}

function toBaseline() {
  baselineTween?.kill();
  glowTween?.kill();
  // Glow eases on its own, slowly, so an event ending never steps the brightness.
  glowTween = gsap.to(heart, {
    glow: baseGlow(),
    duration: 1.2,
    ease: 'sine.inOut',
    overwrite: 'auto',
  });
  baselineTween = gsap.to(heart, {
    burst: 0,
    form: 1,
    ring: 0,
    arrow: 0,
    cameraShake: 0,
    flinch: 0,
    shine: 0,
    starHold: 0,
    gold: HEART_PATH[section].gold,
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
    glowTween?.kill();
    const tl = gsap.timeline({ paused: true, onComplete: done });
    build(event, opts, tl);
    tl.play();
    return { kill: () => tl.kill() };
  },
});

export const director = {
  play: core.play,
  interrupt: core.interrupt,
  settle: core.settle,
  isBusy: core.isBusy,
  current: core.current,
  setBaseline(id: SectionId) {
    section = id;
  },
  baseline: () => section,
  resetBoost() {
    boost = 0;
    if (!core.isBusy() && section === 'timeline')
      gsap.to(heart, { glow: baseGlow(), duration: 0.6, overwrite: 'auto' });
  },
};
