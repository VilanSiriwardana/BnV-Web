import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import { launchConfetti } from './confetti-state';
import { buildFinaleSpell, director } from './heart-director';
import { replayHeroWeave } from './hero-intro';
import { LETTER_OPEN_EVENT, session, SKY_COMPLETE_EVENT } from './session';
import { poseFor, type SectionId, SKY_WAIT, WISH_REST } from './heart-path';
import { candle } from './candle-state';
import { dance } from './dance-state';
import { reasons } from './reasons-state';
import { resetGalleryDirector } from './gallery-director';
import { GALLERY_DOOR_SPAN, walkFromStage } from './gallery-path';
import {
  arriveAtDoor,
  resetGalleryRitual,
  ritualState,
  scrubGalleryDoor,
} from './gallery-ritual';
import { claimCamera, galleryState, releaseCamera } from './gallery-state';
import { heart } from './heart-state';
import { memoriesState } from './memories-state';
import { RAIL_START_Z, railEndZ } from './memory-layout';
import { svgPointToNdc } from './svg-ndc';
import { buildTheme, clearTheme } from './theme-timeline';
import {
  activeNode,
  INTRO,
  LAST_NODE,
  OUTRO,
  pastSpiral,
  STRIKE_AT,
  threadProgress,
} from './timeline-progress';
import type { Tier } from './tiers';

type SectionBuilder = (
  root: HTMLElement,
  mobile: boolean,
  tier: Tier,
) => void | (() => void);

// Heart world height ≈ 2 units at scale 1; the day camera sits at z 6 with fov 45, so the
// visible height is 2·6·tan(22.5°) ≈ 4.97 units. UNCERTAIN: tuned by eye against the seal.
const VIEW_H = 4.97;
const sealScale = (px: number) =>
  (0.9 * px * VIEW_H) / (2 * window.innerHeight);

// Records the section whose baseline the director restores to while it is on screen.
function baselineOn(el: HTMLElement, id: SectionId) {
  ScrollTrigger.create({
    trigger: el,
    start: 'top center',
    end: 'bottom center',
    onToggle: (self) => self.isActive && director.setBaseline(id),
  });
}

// Experience §6: over the first 40 % of the stage the heart tilts and the headline lifts away.
const buildHero: SectionBuilder = (root) => {
  const hero = root.querySelector<HTMLElement>('#hero');
  if (!hero) return;
  baselineOn(hero, 'hero');
  gsap
    .timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '40% top',
        scrub: 0.6,
      },
    })
    .to(heart, { roll: (-8 * Math.PI) / 180, ease: 'none' }, 0)
    .to(
      hero.querySelector('[data-hero-copy]'),
      { y: -60, autoAlpha: 0, ease: 'none' },
      0,
    );
  // Replay (Experience §14): arriving back at the top weaves the ribbons again, once.
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    onEnterBack: () => {
      if (!session.replayArmed) return;
      session.replayArmed = false;
      replayHeroWeave();
    },
  });
  const cue = hero.querySelector('[data-hero-cue]');
  ScrollTrigger.create({
    trigger: hero,
    start: 'top+=8 top',
    once: true,
    onEnter: () =>
      gsap.to(cue, { opacity: 0, duration: 0.4, overwrite: 'auto' }),
  });
};
// Experience §7: path scrubbed (heart drifts right and shrinks, camera dollies), burst triggered.
const buildBloom: SectionBuilder = (root, mobile) => {
  const bloom = root.querySelector<HTMLElement>('#bloom');
  if (!bloom) return;
  baselineOn(bloom, 'bloom');
  const from = poseFor('hero', mobile);
  const to = poseFor('bloom', mobile);
  const scrub = { immediateRender: false, ease: 'none', duration: 1 };
  gsap
    .timeline({
      scrollTrigger: {
        trigger: bloom,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      },
    })
    .fromTo(
      heart.ndc,
      { x: from.x, y: from.y },
      { x: to.x, y: to.y, ...scrub },
      0,
    )
    .fromTo(heart, { scale: from.scale }, { scale: to.scale, ...scrub }, 0)
    .fromTo(
      heart,
      { cameraZ: 6 },
      { cameraZ: 4.2, ...scrub, duration: 0.5, ease: 'sine.inOut' },
      0,
    )
    .to(heart, { cameraZ: 6, duration: 0.5, ease: 'sine.inOut' }, 0.5);

  const line = bloom.querySelector<HTMLElement>('[data-bloom-line]');
  const words = line ? buildBloomWords(line) : null;

  // Blueprint 062: the director owns petalRelease now; bloom's burst releases them.
  ScrollTrigger.create({
    trigger: bloom,
    start: 'top 60%',
    onEnter: () => {
      director.play('burstReform', { petals: true });
      words?.restart();
    },
    onEnterBack: () => director.settle(),
  });
  if (!line || !words) return;
  // Above the burst again: fully hidden, ready to replay (never half-animated).
  ScrollTrigger.create({
    trigger: bloom,
    start: 'top 80%',
    onLeaveBack: () => words.pause(0),
  });
  gsap.to(line, {
    x: -24,
    autoAlpha: 0,
    ease: 'none',
    immediateRender: false,
    scrollTrigger: {
      trigger: bloom,
      start: 'bottom 60%',
      end: 'bottom top',
      scrub: 0.6,
    },
  });
  return () => words.kill();
};

// Romance Additions §9.2: words travel out of the burst (the heart's screen point) to their places.
function buildBloomWords(line: HTMLElement) {
  const words = gsap.utils.toArray<HTMLElement>('[data-bloom-word]', line);
  const emphasis = line.querySelector('[data-bloom-emphasis]');
  const underline = line.querySelector('[data-bloom-underline]');
  const rule = line.querySelector('[data-bloom-rule]');
  const from = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const hx = ((heart.ndc.x + 1) / 2) * window.innerWidth;
    const hy = ((1 - heart.ndc.y) / 2) * window.innerHeight;
    return { x: hx - (r.left + r.width / 2), y: hy - (r.top + r.height / 2) };
  };
  gsap.set([...words, rule].filter(Boolean), { autoAlpha: 0 });
  gsap.set(underline, { strokeDasharray: 1, strokeDashoffset: 1 });
  return gsap
    .timeline({ paused: true })
    .set(line, { x: 0, autoAlpha: 1 })
    .set(words, { autoAlpha: 0 })
    .set(underline, { strokeDasharray: 1, strokeDashoffset: 1 })
    .fromTo(rule, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0.2)
    .fromTo(
      words,
      {
        x: (_, el: HTMLElement) => from(el).x,
        y: (_, el: HTMLElement) => from(el).y,
        scale: 0.6,
        rotation: () => gsap.utils.random(-8, 8),
        autoAlpha: 0,
        filter: 'blur(6px)',
      },
      {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.14,
        clearProps: 'filter,willChange',
        willChange: 'transform',
        immediateRender: false,
      },
      0.35,
    )
    .fromTo(
      emphasis,
      { letterSpacing: '-0.05em' },
      { letterSpacing: '0.02em', duration: 0.9, ease: 'power2.out' },
      2,
    )
    .to(
      underline,
      { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' },
      2.4,
    );
}
// Experience §8: heart settles low, then the camera flies the rail through the orbs.
const buildMemories: SectionBuilder = (root, mobile) => {
  const el = root.querySelector<HTMLElement>('#memories');
  if (!el) return;
  baselineOn(el, 'memories');
  const count = el.querySelectorAll('[data-memory-twin]').length;
  if (!count) return;
  const from = poseFor('bloom', mobile);
  const to = poseFor('memories', mobile);
  const end = railEndZ(count);
  const scrub = { immediateRender: false, ease: 'none' };

  ScrollTrigger.create({
    trigger: el,
    start: 'top 60%',
    end: 'bottom 60%',
    onToggle: (self) => {
      memoriesState.active = self.isActive;
    },
  });
  gsap
    .timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
      },
    })
    .fromTo(
      heart.ndc,
      { x: from.x, y: from.y },
      { x: to.x, y: to.y, ...scrub, duration: 0.12 },
      0,
    )
    .fromTo(
      heart,
      { scale: from.scale },
      { scale: to.scale, ...scrub, duration: 0.12 },
      0,
    )
    .fromTo(
      heart,
      { cameraZ: RAIL_START_Z, depth: 0 },
      { cameraZ: end, depth: end - RAIL_START_Z, ...scrub, duration: 0.88 },
      0.12,
    );

  // Blueprint 063: petals absorb to screen edges as memories float in.
  gsap
    .timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
      },
    })
    .to(
      heart,
      { petalGather: 0, duration: 0.08, immediateRender: false, ease: 'none' },
      0,
    )
    .to(
      heart,
      {
        petalAbsorb: 1,
        duration: 0.15,
        immediateRender: false,
        ease: 'power1.out',
      },
      0,
    )
    .to(heart, { petalAbsorb: 1, duration: 0.66, ease: 'none' })
    // Blueprint 065: parked in the heart (no swap); Timeline bursts them back out.
    .to(heart, { petalGather: 1, duration: 0.18, ease: 'none' });

  // Rail hand-off: the Timeline is a flat stage, so the camera returns home (heart.tsx snaps).
  ScrollTrigger.create({
    trigger: '#timeline',
    start: 'top top',
    onEnter: () => gsap.set(heart, { cameraZ: RAIL_START_Z, depth: 0 }),
    onLeaveBack: () =>
      gsap.set(heart, { cameraZ: end, depth: end - RAIL_START_Z }),
  });
};

// Experience §9: thread drawn by scroll, heart on its tip, nodes trigger, featured node strikes.
const buildTimeline: SectionBuilder = (root, mobile) => {
  const el = root.querySelector<HTMLElement>('#timeline');
  if (!el) return;
  baselineOn(el, 'timeline');
  const path = el.querySelector<SVGPathElement>(
    mobile ? '[data-thread="mobile"]' : '[data-thread="desktop"]',
  );
  const stage = el.querySelector<HTMLElement>('[data-stage-inner]');
  if (!path || !stage) return;
  const nodes = gsap.utils.toArray<HTMLElement>('[data-node]', el);
  const dots = gsap.utils.toArray<HTMLElement>('[data-node-dot]', el);
  const cards = gsap.utils.toArray<HTMLElement>('[data-card]', el);
  const featured = cards.findIndex((c) => c.dataset.featured === 'true');
  const startPose = poseFor('memories', mobile);
  const endPose = poseFor(mobile ? 'starlight' : 'memories', mobile);
  const scale = mobile ? 0.26 : 0.3;
  let len = 0;
  let dash = 0;
  let ctm: DOMMatrix | null = null;
  let last = -1;
  let armed = true;
  let collapse: gsap.core.Tween | null = null;

  // CTM as it is while the stage is stuck at the top (stable during the whole scrub).
  const measure = () => {
    len = path.getTotalLength();
    ctm = path.getScreenCTM();
    // non-scaling-stroke dashes are in screen px, so measure the on-screen length (else the thread breaks into dashes).
    dash = 0;
    if (ctm) {
      let prev: DOMPoint | null = null;
      for (let k = 0; k <= 200; k++) {
        const q = path.getPointAtLength((k / 200) * len).matrixTransform(ctm);
        if (prev) dash += Math.hypot(q.x - prev.x, q.y - prev.y);
        prev = q;
      }
      ctm.f -= stage.getBoundingClientRect().top;
    }
    dash = Math.ceil(dash || len) + 2;
    path.style.strokeDasharray = `${dash} ${dash}`;
    path.style.strokeDashoffset = `${dash}`;
  };
  measure();

  ScrollTrigger.create({
    trigger: el,
    start: 'top top',
    onEnter: () => director.play('glowUp'),
  });

  gsap.set(cards, { autoAlpha: 0, y: 24 });
  gsap.set(dots, { scale: 0.6 });

  const activate = (i: number, forward: boolean) => {
    nodes.forEach((n, j) => {
      gsap.to(dots[j], {
        scale: j <= i ? 1 : 0.6,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      n.toggleAttribute('data-lit', j <= i);
      n.toggleAttribute('data-chip', j < i);
      if (j === i) n.setAttribute('aria-current', 'step');
      else n.removeAttribute('aria-current');
    });
    // The reached memory shows in full, then folds into a photo chip on its node (tap to reopen).
    cards.forEach((c, j) => {
      const state =
        j === i
          ? { autoAlpha: 1, y: 0, scale: 1 }
          : j < i
            ? { autoAlpha: 0, y: 0, scale: 0.6 }
            : { autoAlpha: 0, y: 24, scale: 1 };
      gsap.to(c, {
        ...state,
        duration: j < i ? 0.5 : 0.4,
        ease: j < i ? 'power2.in' : 'power2.out',
        overwrite: 'auto',
      });
    });
    collapse?.kill();
    const card = cards[i];
    const node = nodes[i];
    if (card && node)
      collapse = gsap.delayedCall(2.6, () => {
        gsap.to(card, {
          autoAlpha: 0,
          scale: 0.6,
          duration: 0.5,
          ease: 'power2.in',
          overwrite: 'auto',
        });
        node.toggleAttribute('data-chip', true);
      });
    if (forward && i >= 0 && i !== featured) {
      director.play('glowUp');
      director.play('pulse');
    }
  };

  ScrollTrigger.create({
    trigger: el,
    start: 'top top',
    end: 'bottom bottom',
    onRefresh: measure,
    onUpdate: (self) => {
      const p = self.progress;
      const tp = threadProgress(p);
      path.style.strokeDashoffset = `${dash * (1 - tp)}`;
      const tip = svgPointToNdc(path, len, tp, ctm);
      const into = Math.min(1, p / INTRO);
      const out = Math.max(0, (p - OUTRO) / (1 - OUTRO));
      const x = startPose.x + (tip.x - startPose.x) * into;
      const y = startPose.y + (tip.y - startPose.y) * into;
      heart.ndc.x = x + (endPose.x - x) * out;
      heart.ndc.y = y + (endPose.y - y) * out;
      heart.scale = startPose.scale + (scale - startPose.scale) * into;

      const i = activeNode(tp, nodes.length);
      if (i !== last) {
        activate(i, i > last);
        last = i;
      }
      // Blueprint 067: over the last stretch the petals stream into the heart as she scrolls.
      if (armed && !director.isBusy() && tp >= LAST_NODE) {
        const flow = Math.min(1, (tp - LAST_NODE) / (STRIKE_AT - LAST_NODE));
        heart.petalGather = flow * 0.85;
        heart.petalShiver = flow;
      }
      if (pastSpiral(tp) && armed) armed = !director.interrupt('arrowStrike');
      if (tp < LAST_NODE - 0.03 && !armed) {
        armed = true;
        heart.petalShiver = 0;
        director.resetBoost();
        // Blueprint 066: back above the strike, petals burst out of the heart again.
        director.petalsIn();
      }
    },
  });
};
// Starlight → Our sky (F3): the aurora and line open the stage (first 35 %); then the memory stars
// fade in and the heart waits low while she connects them. ui/sky-constellation.tsx plays
// skyHeartIn on completion; leaving forward asks it to finish the remaining links.
const buildStarlight: SectionBuilder = (root, mobile) => {
  const el = root.querySelector<HTMLElement>('#starlight');
  if (!el) return;
  baselineOn(el, 'starlight');
  // Blueprint 071: Starlight now follows the gallery.
  const from = poseFor('gallery', mobile);
  const wait = mobile ? SKY_WAIT.mobile : SKY_WAIT.desktop;
  const line = el.querySelector('[data-starlight-line]');
  const sky = el.querySelector('[data-sky]');
  const scrub = { immediateRender: false, ease: 'none' };
  let lineOn = false;
  let skyOn = false;
  gsap.set(line, { autoAlpha: 0 });
  gsap.set(sky, { autoAlpha: 0 });
  const fade = (target: Element | null, show: boolean) =>
    gsap.to(target, {
      autoAlpha: show ? 1 : 0,
      y: show ? 0 : 16,
      duration: 0.5,
      overwrite: 'auto',
    });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'top top',
        scrub: 0.8,
      },
    })
    .fromTo(
      heart.ndc,
      { x: from.x, y: from.y },
      { x: wait.x, y: wait.y, ...scrub },
      0,
    )
    .fromTo(heart, { scale: 0.3 }, { scale: wait.scale, ...scrub }, 0);
  ScrollTrigger.create({
    trigger: el,
    // Starts before the pin so the stars greet her earlier; the taller stage holds the heart longer.
    start: 'top 40%',
    end: 'bottom bottom',
    onUpdate: ({ progress: p }) => {
      const showLine = p < 0.18;
      if (showLine !== lineOn) fade(line, (lineOn = showLine));
      const showSky = p >= 0.12;
      if (showSky !== skyOn) fade(sky, (skyOn = showSky));
    },
    onLeave: () => el.dispatchEvent(new Event(SKY_COMPLETE_EVENT)),
  });
};

// Phase 12 (ADR-0035): the heart drifts to its gallery pose, then the sticky stage becomes the
// corridor walk. Stage progress drives the camera; the gallery owns the camera only while pinned.
function leaveGallery() {
  resetGalleryDirector();
  resetGalleryRitual();
  releaseCamera();
}

const buildGallery: SectionBuilder = (root) => {
  const el = root.querySelector<HTMLElement>('#gallery');
  if (!el) return;
  baselineOn(el, 'gallery');
  // Blueprint 071: the arrow strike's heart-iris carries her in; no approach tween.
  ScrollTrigger.create({
    trigger: el,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      galleryState.progress = self.progress;
      // Blueprint 059: the first stretch of the stage opens the doors, then the walk begins.
      scrubGalleryDoor(self.progress / GALLERY_DOOR_SPAN);
      galleryState.walk =
        session.galleryUnlocked || ritualState.mode === 'open'
          ? walkFromStage(self.progress)
          : 0;
    },
    // Blueprint 053: arriving forward locks scroll at the door until the unlock ritual opens it.
    onToggle: (self) => {
      if (!self.isActive) return leaveGallery();
      claimCamera();
      if (self.direction > 0) arriveAtDoor(self.start + 2);
    },
  });
  return leaveGallery;
};

// Experience §19.6: the duo fades in while the stage is on screen; scroll scrubs the move,
// the heart floats above them and pulses once on the dip.
const buildDance: SectionBuilder = (root, mobile) => {
  const el = root.querySelector<HTMLElement>('#dance');
  if (!el) return;
  baselineOn(el, 'dance');
  const from = poseFor('starlight', mobile);
  const to = poseFor('dance', mobile);
  const scrub = { immediateRender: false, ease: 'none' };
  gsap
    .timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'top top',
        scrub: 0.8,
      },
    })
    .fromTo(
      heart.ndc,
      { x: from.x, y: from.y },
      { x: to.x, y: to.y, ...scrub },
      0,
    )
    .fromTo(heart, { scale: from.scale }, { scale: to.scale, ...scrub }, 0);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 60%',
    end: 'bottom 40%',
    onToggle: ({ isActive }) =>
      gsap.to(dance, {
        visible: isActive ? 1 : 0,
        duration: 0.6,
        overwrite: 'auto',
      }),
  });
  let dipped = false;
  ScrollTrigger.create({
    trigger: el,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: ({ progress }) => {
      dance.t = progress;
      if (progress >= 0.95 && !dipped) dipped = director.play('pulse');
      if (progress < 0.8) dipped = false;
    },
  });
  return () => {
    dance.t = 0;
    dance.visible = 0;
  };
};

// Romance Additions F4: the heart rests above the ring; scroll turns the ring once over the stage.
const buildReasons: SectionBuilder = (root, mobile) => {
  const el = root.querySelector<HTMLElement>('#reasons');
  if (!el) return;
  baselineOn(el, 'reasons');
  const from = poseFor('dance', mobile);
  const to = poseFor('reasons', mobile);
  const scrub = { immediateRender: false, ease: 'none' };
  gsap
    .timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'top top',
        scrub: 0.8,
      },
    })
    .fromTo(
      heart.ndc,
      { x: from.x, y: from.y },
      { x: to.x, y: to.y, ...scrub },
      0,
    )
    .fromTo(heart, { scale: from.scale }, { scale: to.scale, ...scrub }, 0);
  ScrollTrigger.create({
    trigger: el,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: ({ progress }) => {
      reasons.progress = progress;
    },
    onToggle: ({ isActive }) => {
      reasons.active = isActive;
    },
  });
  // Blueprint 066: once unpinned, the closed book scrolls away with the section.
  ScrollTrigger.create({
    trigger: el,
    start: 'bottom bottom',
    end: 'bottom top',
    onUpdate: ({ progress }) => {
      reasons.exit = progress * window.innerHeight;
    },
    onToggle: ({ isActive }) => {
      reasons.leaving = isActive;
    },
    onLeaveBack: () => {
      reasons.exit = 0;
    },
  });
  return () => {
    reasons.progress = 0;
    reasons.active = false;
    reasons.leaving = false;
    reasons.exit = 0;
  };
};

// Experience §12: the star shows while the stage is on screen; the heart waits below it.
const buildWish: SectionBuilder = (root) => {
  const el = root.querySelector<HTMLElement>('#wish');
  if (!el) return;
  baselineOn(el, 'wish');
  ScrollTrigger.create({
    trigger: el,
    start: 'top center',
    end: 'bottom center',
    onToggle: ({ isActive }) => {
      // F5: with the candle, the star appears only once the flame is out (candleOut).
      const candleMode = !!el.querySelector('[data-wish-candle]');
      if (candleMode)
        gsap.to(candle, {
          visible: isActive ? 1 : 0,
          duration: 0.4,
          overwrite: 'auto',
        });
      gsap.to(heart, {
        star: isActive && (!candleMode || candle.out === 1) ? 1 : 0,
        duration: 0.4,
        overwrite: 'auto',
      });
      if (!isActive) return;
      gsap.to(heart.ndc, {
        x: 0,
        y: WISH_REST.y,
        duration: 0.6,
        overwrite: 'auto',
      });
      // Blueprint 065: with the candle lit, the heart waits hidden and rises from the smoke.
      gsap.to(heart, {
        scale: candleMode && candle.out < 1 ? 0.001 : WISH_REST.scale,
        duration: 0.6,
        overwrite: 'auto',
      });
    },
  });
  return () => {
    candle.visible = 0;
  };
};

// Experience §13: the heart docks onto the measured seal and stays exact while the stage is
// stuck (re-measured every tick, so resize and scroll can't drift it).
const buildLetter: SectionBuilder = (root) => {
  const el = root.querySelector<HTMLElement>('#letter');
  if (!el) return;
  baselineOn(el, 'letter');
  const follow = () => {
    const seal = el.querySelector<HTMLElement>('[data-seal]');
    if (!seal) return;
    const r = seal.getBoundingClientRect();
    heart.ndc.x = ((r.left + r.width / 2) / window.innerWidth) * 2 - 1;
    heart.ndc.y = -(((r.top + r.height / 2) / window.innerHeight) * 2 - 1);
  };
  const autoOpens = !el.querySelector('[data-letter-locked]');
  let fired = false;
  const fire = () => {
    if (fired || !autoOpens) return;
    fired = true;
    el.dispatchEvent(new Event(LETTER_OPEN_EVENT));
  };
  ScrollTrigger.create({
    trigger: el,
    start: 'top center',
    end: 'bottom center',
    onToggle: ({ isActive, direction }) => {
      gsap.ticker.remove(follow);
      if (!isActive) {
        if (direction === 1) fire();
        gsap.to(heart, { sealRim: 0, duration: 0.4, overwrite: 'auto' });
        return;
      }
      gsap.ticker.add(follow);
      const seal = el.querySelector<HTMLElement>('[data-seal]');
      director.play('dockToSeal', {
        scale: seal ? sealScale(seal.offsetWidth) : 0.3,
      });
    },
  });
  // §19.4: scrolling past the middle of the pinned letter opens it (never with a passphrase).
  ScrollTrigger.create({
    trigger: el,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: ({ progress }) => {
      if (progress >= 0.5) fire();
    },
  });
  gsap.utils
    .toArray<HTMLElement>('[data-letter-layer]', el)
    .forEach((layer, i) =>
      gsap.fromTo(
        layer,
        { yPercent: 4 * (i + 1) },
        {
          yPercent: -6 * (i + 1),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      ),
    );
  return () => gsap.ticker.remove(follow);
};

// Experience §14 + Romance Additions F1: centre stage, one finaleSpell per pass.
const buildFinale: SectionBuilder = (root, mobile) => {
  const el = root.querySelector<HTMLElement>('#finale');
  if (!el) return;
  baselineOn(el, 'finale');
  const to = poseFor('finale', mobile);
  const scrollTrigger = {
    trigger: el,
    start: 'top center',
    end: 'top top',
    scrub: 0.8,
  };
  gsap.to(heart.ndc, {
    x: to.x,
    y: to.y,
    ease: 'none',
    immediateRender: false,
    scrollTrigger,
  });
  gsap.to(heart, {
    scale: to.scale,
    ease: 'none',
    immediateRender: false,
    scrollTrigger,
  });
  // Blueprint 059: the stage pins and her scroll spells the name, then "I love you".
  const spell = buildFinaleSpell(
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.2,
      },
    }),
  );
  const at = spell.labels.iloveyou / spell.duration();
  ScrollTrigger.create({
    trigger: el,
    start: () => `top+=${at * (el.offsetHeight - window.innerHeight)} top`,
    onEnter: () => {
      if (session.finalePlayed) return;
      session.finalePlayed = true;
      void launchConfetti(0.5);
    },
  });
};

// Romance Additions F6: natural flow, heart parked in a corner, one batch for reveals.
const buildAfterglow: SectionBuilder = (root, mobile) => {
  const el = root.querySelector<HTMLElement>('#afterglow');
  if (!el) return;
  baselineOn(el, 'afterglow');
  const to = poseFor('afterglow', mobile);
  const scrollTrigger = {
    trigger: el,
    start: 'top bottom',
    end: 'top center',
    scrub: 0.8,
  };
  gsap.to(heart.ndc, {
    x: to.x,
    y: to.y,
    ease: 'none',
    immediateRender: false,
    scrollTrigger,
  });
  gsap.to(heart, {
    scale: to.scale,
    ease: 'none',
    immediateRender: false,
    scrollTrigger,
  });
  const items = el.querySelectorAll<HTMLElement>('[data-reveal]');
  gsap.set(items, { autoAlpha: 0, y: 16 });
  ScrollTrigger.batch(items, {
    start: 'top 85%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.08,
      }),
  });
  // Blueprint 059: the aurora drifts slower than the page; the title inks in; each room's
  // heading draws a gold underline as it arrives.
  const aurora = el.querySelector<HTMLElement>('[data-love-aurora]');
  if (aurora)
    gsap.fromTo(
      aurora,
      { yPercent: -12 },
      {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  const title = el.querySelector<HTMLElement>('#afterglow-title');
  let split: SplitText | null = null;
  if (title) {
    split = SplitText.create(title, { type: 'chars' });
    gsap.from(split.chars, {
      yPercent: 60,
      opacity: 0,
      filter: 'blur(8px)',
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.035,
      scrollTrigger: { trigger: title, start: 'top 85%', once: true },
    });
  }
  const headings = el.querySelectorAll<HTMLElement>('h3');
  gsap.set(headings, {
    backgroundImage: 'linear-gradient(var(--gold), var(--gold))',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 100%',
    backgroundSize: '0% 1px',
    paddingBottom: 6,
  });
  headings.forEach((h) =>
    gsap.to(h, {
      backgroundSize: '60% 1px',
      duration: 1.2,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: h, start: 'top 80%', once: true },
    }),
  );
  return () => {
    split?.revert();
    gsap.set(items, { clearProps: 'opacity,visibility,transform' });
    gsap.set(headings, {
      clearProps:
        'backgroundImage,backgroundRepeat,backgroundPosition,backgroundSize,paddingBottom',
    });
  };
};

const sections = [
  buildHero,
  buildBloom,
  buildMemories,
  buildTimeline,
  buildGallery,
  buildStarlight,
  buildDance,
  buildReasons,
  buildWish,
  buildLetter,
  buildFinale,
  buildAfterglow,
];

function buildProgress(root: HTMLElement) {
  ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) =>
      root.style.setProperty('--progress', self.progress.toFixed(4)),
  });
}

// Calm mode (Phase 12 fallback gap): gallery tiles fade in once, 0.4 s, opacity only.
function buildCalmGallery(root: HTMLElement) {
  const tiles = gsap.utils.toArray<HTMLElement>('[data-love-tile]', root);
  if (!tiles.length) return;
  gsap.set(tiles, { autoAlpha: 0 });
  ScrollTrigger.batch(tiles, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        duration: 0.4,
        ease: 'power1.out',
        stagger: 0.05,
        overwrite: 'auto',
      }),
  });
  return () => gsap.set(tiles, { clearProps: 'opacity,visibility' });
}

// Calm / reduced motion: no scrubbing; sections use their static data-depth stops.
export function applyStaticStory(root: HTMLElement) {
  clearTheme(root);
  buildProgress(root);
}

// Experience §4.3. Returns a cleanup that reverts every trigger and tween it made.
export function buildStory(
  root: HTMLElement,
  ctx: { quiet: boolean; tier: Tier },
) {
  const mm = gsap.matchMedia();
  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      mobile: '(max-width: 767px)',
    },
    (c) => {
      const { motion, mobile } = c.conditions as {
        motion: boolean;
        mobile: boolean;
      };
      if (!motion || ctx.quiet) {
        applyStaticStory(root);
        // Calm with OS motion allowed: the masonry fades in (opacity only, no movement).
        return motion ? buildCalmGallery(root) : undefined;
      }
      buildTheme(root);
      buildProgress(root);
      const cleanups = sections.map((build) => build(root, mobile, ctx.tier));
      return () => cleanups.forEach((fn) => fn?.());
    },
  );
  return () => {
    mm.revert();
    clearTheme(root);
  };
}
