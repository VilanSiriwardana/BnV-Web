import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { buildTheme, clearTheme } from './theme-timeline';
import type { Tier } from './tiers';

type SectionBuilder = (root: HTMLElement, mobile: boolean) => void;

// Section stubs; filled in Phases 3–5.
const buildHero: SectionBuilder = () => {};
const buildBloom: SectionBuilder = () => {};
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
