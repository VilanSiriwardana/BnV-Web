import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { director } from './heart-director';
import { replayHeroWeave } from './hero-intro';
import { session } from './session';
import { poseFor, type SectionId, WISH_REST } from './heart-path';
import { heart } from './heart-state';
import { memoriesState } from './memories-state';
import { RAIL_START_Z, railEndZ } from './memory-layout';
import { svgPointToNdc } from './svg-ndc';
import { buildTheme, clearTheme } from './theme-timeline';
import {
  activeNode,
  INTRO,
  OUTRO,
  REARM_BELOW,
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

  ScrollTrigger.create({
    trigger: bloom,
    start: 'top 60%',
    onEnter: () => director.play('burstReform', { petals: true }),
    onEnterBack: () => director.settle(),
  });

  const line = bloom.querySelector('[data-bloom-line]');
  if (line)
    gsap.from(line, {
      y: 16,
      autoAlpha: 0,
      duration: 0.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: bloom,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });
};
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
  const endPose = poseFor(mobile ? 'dawn' : 'memories', mobile);
  const scale = mobile ? 0.26 : 0.3;
  let len = 0;
  let ctm: DOMMatrix | null = null;
  let last = -1;
  let armed = true;

  // CTM as it is while the stage is stuck at the top (stable during the whole scrub).
  const measure = () => {
    len = path.getTotalLength();
    ctm = path.getScreenCTM();
    if (ctm) ctm.f -= stage.getBoundingClientRect().top;
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
  };
  measure();

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
      if (j === i) n.setAttribute('aria-current', 'step');
      else n.removeAttribute('aria-current');
    });
    cards.forEach((c, j) => {
      const state =
        j === i
          ? { autoAlpha: 1, y: 0 }
          : j < i
            ? { autoAlpha: mobile ? 0 : 0.4, y: 0 }
            : { autoAlpha: 0, y: 24 };
      gsap.to(c, {
        ...state,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
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
      path.style.strokeDashoffset = `${len * (1 - tp)}`;
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
      if (featured >= 0 && i >= featured && armed)
        armed = !director.interrupt('arrowStrike');
      if (p < REARM_BELOW && !armed) {
        armed = true;
        director.resetBoost();
      }
    },
  });
};
// Experience §10: heart rises and grows while --dawn scrubs; skin swap at 35 %, shine at 50 %,
// the single line only after 75 % (text-free window).
const buildDawn: SectionBuilder = (root, mobile) => {
  const el = root.querySelector<HTMLElement>('#dawn');
  if (!el) return;
  baselineOn(el, 'dawn');
  const from = poseFor(mobile ? 'dawn' : 'memories', mobile);
  const to = poseFor('dawn', mobile);
  const line = el.querySelector('[data-dawn-line]');
  const scrub = { immediateRender: false, ease: 'none' };
  let swapped = false;
  let shone = false;
  let lineOn = false;
  gsap.set(line, { autoAlpha: 0 });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.8,
        onUpdate: ({ progress: p }) => {
          if (p >= 0.35 && !swapped) {
            swapped = true;
            director.play('skinSwap');
          } else if (p < 0.3 && swapped) {
            swapped = false;
            gsap.to(heart, { skin: 0, duration: 0.6, overwrite: 'auto' });
          }
          if (p >= 0.5 && !shone) shone = director.play('shine');
          if (p < 0.4) shone = false;
          const show = p >= 0.75;
          if (show !== lineOn) {
            lineOn = show;
            gsap.to(line, {
              autoAlpha: show ? 1 : 0,
              y: show ? 0 : 16,
              duration: 0.5,
              overwrite: 'auto',
            });
          }
        },
      },
    })
    .fromTo(
      heart.ndc,
      { x: from.x, y: from.y },
      { x: to.x, y: to.y, ...scrub },
      0,
    )
    .fromTo(heart, { scale: 0.3 }, { scale: to.scale, ...scrub }, 0)
    .fromTo(
      heart,
      { petalRelease: 1 },
      { petalRelease: 0, ...scrub, duration: 0.5 },
      0,
    );
};

// Experience §11: batched clip reveals, light desktop parallax, quiet corner companion.
const buildGallery: SectionBuilder = (root, mobile, tier) => {
  const el = root.querySelector<HTMLElement>('#gallery');
  if (!el) return;
  baselineOn(el, 'gallery');
  const from = poseFor('dawn', mobile);
  const to = poseFor('gallery', mobile);
  const scrub = { immediateRender: false, ease: 'none' };
  gsap
    .timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'top 20%',
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

  const tiles = gsap.utils.toArray<HTMLElement>('[data-love-tile]', el);
  const clip = tier !== 'low';
  const hidden = clip
    ? {
        y: 24,
        autoAlpha: 0,
        clipPath: 'inset(12% 8% 12% 8% round var(--radius-lg))',
      }
    : { y: 24, autoAlpha: 0 };
  const shown = clip
    ? {
        y: 0,
        autoAlpha: 1,
        clipPath: 'inset(0% 0% 0% 0% round var(--radius-lg))',
      }
    : { y: 0, autoAlpha: 1 };
  gsap.set(tiles, hidden);
  ScrollTrigger.batch(tiles, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, {
        ...shown,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: 'auto',
      });
      director.play('shine'); // the director throttles shine to once per 4 s
    },
  });

  if (mobile) return;
  // ±6 % parallax on at most six tiles (Phase 5 §5 Step 3).
  tiles.slice(0, 6).forEach((tile) => {
    const img = tile.querySelector('[data-tile-img]');
    if (!img) return;
    gsap.fromTo(
      img,
      { yPercent: -6, scale: 1.12 },
      {
        yPercent: 6,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: {
          trigger: tile,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
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
      gsap.to(heart, {
        star: isActive ? 1 : 0,
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
      gsap.to(heart, {
        scale: WISH_REST.scale,
        duration: 0.6,
        overwrite: 'auto',
      });
    },
  });
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
  ScrollTrigger.create({
    trigger: el,
    start: 'top center',
    end: 'bottom center',
    onToggle: ({ isActive }) => {
      gsap.ticker.remove(follow);
      if (!isActive) {
        gsap.to(heart, { pearlRim: 0, duration: 0.4, overwrite: 'auto' });
        return;
      }
      gsap.ticker.add(follow);
      const seal = el.querySelector<HTMLElement>('[data-seal]');
      director.play('dockToSeal', {
        scale: seal ? sealScale(seal.offsetWidth) : 0.3,
      });
    },
  });
  return () => gsap.ticker.remove(follow);
};

// Experience §14: centre stage, one finaleBurst per pass.
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
  ScrollTrigger.create({
    trigger: el,
    start: 'top 60%',
    onEnter: () => {
      if (session.finalePlayed) return;
      session.finalePlayed = true;
      director.play('finaleBurst');
    },
  });
};

const sections = [
  buildHero,
  buildBloom,
  buildMemories,
  buildTimeline,
  buildDawn,
  buildGallery,
  buildWish,
  buildLetter,
  buildFinale,
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

// Calm / reduced motion: no scrubbing; sections use their static data-dawn colours.
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
        return;
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
