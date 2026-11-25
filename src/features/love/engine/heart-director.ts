import gsap from 'gsap';

import { spawnTapHearts } from '../canvas/mini-hearts';
import { candle } from './candle-state';
import { launchConfetti } from './confetti-state';
import {
  createDirectorCore,
  type HeartEvent,
  type PlayOptions,
} from './heart-director-core';
import {
  HEART_PATH,
  PETAL_SECTIONS,
  isMobileViewport,
  poseFor,
  type SectionId,
} from './heart-path';
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
  (HEART_PATH[section].glow + (section === 'timeline' ? boost : 0)) * 1.25;
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
  // Blueprint 062: petals always scatter with the heart burst.
  tl.fromTo(
    heart,
    { petalGather: 1 },
    { petalGather: 0, duration: 1.1, ease: 'power3.out' },
    '<',
  );
  if (opts.petals || heart.petalRelease > 0.01)
    tl.set(heart, { petalRelease: 1 }, at);
}

function reform(tl: gsap.core.Timeline, gatherPetals = true) {
  tl.to(heart, { burst: 0, duration: 1.6, ease: 'power2.inOut' }, '>')
    .to(
      heart,
      { glow: baseGlow() + 0.25, duration: 1.6, ease: 'power2.inOut' },
      '<',
    )
    // Blueprint 063: petals gather and STAY gathered. Caller decides whether to scatter.
    .to(
      heart,
      {
        petalGather: gatherPetals ? 1 : 0,
        duration: 1.6,
        ease: 'power2.inOut',
      },
      '<',
    )
    .to(heart, { glow: baseGlow(), duration: 0.8, ease: 'power2.inOut' });
  pulse(tl, '<');
}

function scatterPetals(tl: gsap.core.Timeline, at: number | string = '>') {
  tl.to(heart, { petalGather: 0, duration: 0.9, ease: 'power3.out' }, at);
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
      case 'reasonFront':
        return;
      case 'skyHeartIn': {
        const to = poseFor('starlight', isMobileViewport());
        tl.set(heart.ndc, { x: to.x, y: to.y }).set(heart, { scale: to.scale });
        flash(tl, 0.4);
        return;
      }
      case 'candleOut':
        tl.set(candle, { out: 1, blow: 0 }).set(heart, { star: 1 });
        tl.to(heart, { starHold: 0, duration: 0.3 });
        flash(tl, 0.6);
        return;
      case 'glowUp':
      case 'giftOpen':
      case 'noteOpen':
      case 'hiddenFound':
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
      // Bloom: the heart reforms, released petals keep falling.
      reform(tl, !opts.petals);
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
      scatterPetals(tl);
      return;
    case 'finaleSpell':
      finaleSpell(tl);
      return;
    case 'skyHeartIn': {
      const to = poseFor('starlight', isMobileViewport());
      tl.to(
        heart.ndc,
        { x: to.x, y: to.y, duration: 1.2, ease: 'power3.inOut' },
        0,
      ).to(heart, { scale: to.scale, duration: 1.2, ease: 'power3.inOut' }, 0);
      tl.to(heart, {
        glow: baseGlow() + 0.5,
        duration: 0.9,
        ease: 'power2.out',
      })
        .fromTo(
          heart,
          { shine: 0 },
          { shine: 1, duration: 1.1, ease: 'power1.inOut' },
          '<',
        )
        .set(heart, { shine: 0 })
        .to(heart, { glow: baseGlow(), duration: 1.4, ease: 'power2.inOut' });
      return;
    }
    case 'candleOut':
      candleOut(tl);
      return;
    case 'reasonFront':
      tl.to(heart, { flinch: 0.035, duration: 0.12, ease: 'power2.out' }).to(
        heart,
        { flinch: 0, duration: 0.2, ease: 'power1.in' },
      );
      return;
    // Romance Additions F7–F9: small, quick acknowledgements.
    case 'giftOpen':
      tl.to(heart, {
        glow: baseGlow() + 0.3,
        duration: 0.4,
        ease: 'power2.out',
      })
        .to(heart, { glow: baseGlow(), duration: 0.8, ease: 'power2.inOut' })
        .call(() => spawnTapHearts(6), [], 0);
      return;
    case 'noteOpen':
      pulse(tl, 0);
      tl.call(() => spawnTapHearts(4), [], 0);
      flash(tl, 0.5);
      return;
    case 'hiddenFound':
      tl.call(() => spawnTapHearts(3), [], 0);
      flash(tl, 0.4);
      return;
    default:
      pulse(tl, 0);
  }
}

// Romance Additions F1 (≈ 9.7 s + settle): name, then "I love you", then the heart again.
function finaleSpell(tl: gsap.core.Timeline) {
  const glow = baseGlow();
  tl.to(heart, { glow: glow + 0.3, duration: 0.3, ease: 'power2.out' }, 0)
    .set(heart, { spellB: 0 }, 0)
    .to(heart, { spell: 1, duration: 1.6, ease: 'power2.inOut' }, 0.3)
    .to(heart, { glow: glow + 0.15, duration: 1.6 }, 0.3)
    .to(heart, { spellB: 1, duration: 1.4, ease: 'power2.inOut' }, 4.1)
    .call(() => void launchConfetti(0.5), [], 5.5)
    .to(heart, { spell: 0, duration: 1.6, ease: 'power2.inOut' }, 8.1)
    .to(heart, { glow: glow + 0.25, duration: 1.6, ease: 'power2.inOut' }, 8.1)
    .set(heart, { spellB: 0 }, 9.7)
    .to(heart, { glow, duration: 0.8, ease: 'power2.inOut' }, 9.7);
  pulse(tl, 9.7);
}

/** Blueprint 059: the finale spell as a scroll-scrubbed timeline with one label per word. */
export function buildFinaleSpell(tl: gsap.core.Timeline) {
  const ease = 'sine.inOut';
  return tl
    .addLabel('start', 0)
    .fromTo(
      heart,
      { spell: 0, spellB: 0 },
      { spell: 1, duration: 2.4, ease, immediateRender: false },
      0.4,
    )
    .addLabel('buwi', 2.8)
    .to(heart, { spellB: 1, duration: 2.4, ease }, 4)
    .addLabel('iloveyou', 6.4)
    .to(heart, { spell: 0, duration: 2.4, ease }, 7.8)
    .set(heart, { spellB: 0 }, 10.2)
    .addLabel('heart', 10.2)
    .to({}, { duration: 1 }, 10.2);
}

// Romance Additions F5: the flame snuffs, smoke rises, the star ignites, then wishMerge.
function candleOut(tl: gsap.core.Timeline) {
  tl.to(
    candle,
    { blow: 0, out: 1, duration: 0.5, ease: 'power2.out' },
    0,
  ).fromTo(
    heart,
    { star: 0 },
    { star: 1, duration: 0.8, ease: 'power2.out' },
    0.6,
  );
  wishMerge(tl, 2);
}

// Experience §3.5 arrowStrike (≈ 5.2 s). The boost is set first so an interrupted strike still
// settles to the brighter baseline.
function arrowStrike(tl: gsap.core.Timeline) {
  boost = STRIKE_BOOST;
  const glow = baseGlow();
  // Blueprint 063: petals sense the arrow before it appears — shiver starts at t+0.
  tl.to(heart, { petalShiver: 1, duration: 1.0, ease: 'power1.in' }, 0)
    .to(heart, { glow: glow - 0.15, flinch: -0.03, duration: 0.2 }, 0)
    .fromTo(
      heart,
      { arrow: 0 },
      { arrow: 1, duration: 0.9, ease: 'power1.in' },
      0.2,
    )
    // Blueprint 063: petals shrink into heart before impact.
    .to(heart, { petalGather: 1, duration: 0.35, ease: 'power2.in' }, 0.6)
    .to(heart, { petalShiver: 0, duration: 0.1 }, 1.1)
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
  // Timeline: petals were absorbed before impact; the blast sends them falling again.
  reform(tl, false);
}

// Experience §12 wishMerge (≈ 4 s): flash, burst with confetti, reform; the message is DOM-side.
function wishMerge(tl: gsap.core.Timeline, at = 0) {
  tl.to(heart, { glow: 1, starHold: 1, duration: 0.3, ease: 'power2.out' }, at)
    .call(() => void launchConfetti(), [], at + 0.3)
    .to(heart, { star: 0, duration: 0.4 }, at + 0.3);
  burst(tl, {}, at + 0.3);
  tl.to({}, { duration: 0.2 });
  reform(tl);
  scatterPetals(tl);
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
    petalGather: 0,
    petalShiver: 0,
    petalAbsorb: 0,
    // Blueprint 060 follow-up: on the finale, scroll owns the spell; never kill its scrub.
    ...(section === 'finale' ? {} : { spell: 0, spellB: 0 }),
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
    // Blueprint 062: petal sections own petalRelease; bloom waits for the burst to set it.
    const entry = PETAL_SECTIONS[id];
    if (id !== 'bloom')
      gsap.to(heart, {
        petalRelease: entry ? 1 : 0,
        petalDim: entry?.dim ?? 0,
        petalAbsorb: 0,
        duration: 0.6,
        overwrite: 'auto',
      });
    else
      gsap.to(heart, {
        petalDim: 0,
        petalAbsorb: 0,
        duration: 0.6,
        overwrite: 'auto',
      });
    // Timeline: petals parked in the heart (Memories end) shoot back out.
    gsap.to(heart, {
      petalGather: 0,
      duration: id === 'timeline' ? 1.1 : 0.6,
      ease: id === 'timeline' ? 'power3.out' : 'power1.out',
      overwrite: 'auto',
    });
  },
  baseline: () => section,
  resetBoost() {
    boost = 0;
    if (!core.isBusy() && section === 'timeline')
      gsap.to(heart, { glow: baseGlow(), duration: 0.6, overwrite: 'auto' });
  },
};
