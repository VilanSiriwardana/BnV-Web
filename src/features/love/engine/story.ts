import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { director } from './heart-director';
import { poseFor, type SectionId } from './heart-path';
import { heart } from './heart-state';
import { buildTheme, clearTheme } from './theme-timeline';
import type { Tier } from './tiers';

type SectionBuilder = (root: HTMLElement, mobile: boolean) => void;

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
const buildMemories: SectionBuilder = () => {};
const buildTimeline: SectionBuilder = () => {};
const buildDawn: SectionBuilder = () => {};
const buildGallery: SectionBuilder = () => {};
const buildWish: SectionBuilder = () => {};
const buildLetter: SectionBuilder = () => {};
const buildFinale: SectionBuilder = () => {};

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
  ctx: { calm: boolean; tier: Tier },
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
      if (!motion || ctx.calm) {
        applyStaticStory(root);
        return;
      }
      buildTheme(root);
      buildProgress(root);
      sections.forEach((build) => build(root, mobile));
    },
  );
  return () => {
    mm.revert();
    clearTheme(root);
  };
}
