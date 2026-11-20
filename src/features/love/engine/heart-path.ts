import { heart } from './heart-state';

// Experience §4.2: where the heart rests in each section, as NDC (x −1 left … +1 right,
// y −1 bottom … +1 top). A table, not code: tune positions here.
export const SECTION_IDS = [
  'hero',
  'bloom',
  'memories',
  'timeline',
  'starlight',
  'gallery',
  'dance',
  'reasons',
  'wish',
  'letter',
  'finale',
  'afterglow',
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export type HeartPose = { x: number; y: number; scale: number };
type PathEntry = {
  desktop: HeartPose;
  mobile: HeartPose;
  /** Extra gold in the heart colours, 0..1 (all-night theme). */
  gold: number;
  glow: number;
};

// Resting pose at the end of each section. Mobile rule: top 30 % or bottom-right while text shows.
export const HEART_PATH: Record<SectionId, PathEntry> = {
  hero: {
    desktop: { x: 0, y: 0.05, scale: 1 },
    mobile: { x: 0, y: 0.25, scale: 0.9 },
    gold: 0,
    // Matches the intro glow (heart-state) so nothing brightens once the intro settles.
    glow: 0.4,
  },
  bloom: {
    desktop: { x: 0.55, y: 0.1, scale: 0.55 },
    mobile: { x: 0, y: 0.6, scale: 0.3 },
    gold: 0,
    glow: 0.7,
  },
  memories: {
    desktop: { x: 0, y: -0.55, scale: 0.38 },
    mobile: { x: 0, y: 0.62, scale: 0.28 },
    gold: 0.1,
    glow: 0.55,
  },
  timeline: {
    desktop: { x: 0, y: 0, scale: 0.3 },
    mobile: { x: -0.8, y: 0, scale: 0.26 },
    gold: 0.2,
    glow: 0.6,
  },
  starlight: {
    desktop: { x: 0, y: 0.04, scale: 0.42 },
    mobile: { x: 0, y: 0.04, scale: 0.32 },
    gold: 0.4,
    glow: 0.5,
  },
  gallery: {
    desktop: { x: 0.86, y: -0.78, scale: 0.2 },
    mobile: { x: 0.8, y: -0.85, scale: 0.16 },
    gold: 0.4,
    glow: 0.35,
  },
  dance: {
    desktop: { x: 0, y: 0.55, scale: 0.18 },
    mobile: { x: 0, y: 0.62, scale: 0.16 },
    gold: 0.45,
    glow: 0.45,
  },
  reasons: {
    desktop: { x: 0, y: 0.5, scale: 0.2 },
    mobile: { x: 0, y: 0.58, scale: 0.18 },
    gold: 0.45,
    glow: 0.5,
  },
  wish: {
    desktop: { x: 0, y: 0, scale: 0.5 },
    mobile: { x: 0, y: 0, scale: 0.5 },
    gold: 0.5,
    glow: 0.5,
  },
  letter: {
    desktop: { x: 0, y: 0, scale: 0.3 },
    mobile: { x: 0, y: 0, scale: 0.3 },
    gold: 0.6,
    glow: 0.4,
  },
  finale: {
    desktop: { x: 0, y: 0.25, scale: 1.1 },
    mobile: { x: 0, y: 0.3, scale: 0.9 },
    gold: 0.6,
    glow: 0.7,
  },
  afterglow: {
    desktop: { x: 0.86, y: -0.78, scale: 0.2 },
    mobile: { x: 0.8, y: -0.85, scale: 0.16 },
    gold: 0.6,
    glow: 0.4,
  },
};

export function poseFor(section: SectionId, mobile: boolean): HeartPose {
  const entry = HEART_PATH[section];
  return mobile ? entry.mobile : entry.desktop;
}

// Wish (Experience §12): the star sits centred; the DOM hold button sits over it.
// Hero intro: the weave ends this far below the pose, then floats up with the title.
export const HERO_RISE = 0.14;

export const WISH_STAR_NDC = { x: 0, y: 0 };
// The heart rests below the star and rises to it as she holds.
export const WISH_REST = { y: -0.45, scale: 0.35 };
export const WISH_TOP = { y: -0.05, scale: 0.5 };
// Blowing lifts the heart only part of the way; wishMerge takes it the rest.
export const WISH_BLOW_TOP = { y: -0.15, scale: 0.42 };

// Our sky (F3): the heart waits low while she connects the stars, then rises into the shape
// (HEART_PATH.starlight, via skyHeartIn).
export const SKY_WAIT = {
  desktop: { x: 0, y: -0.75, scale: 0.2 },
  mobile: { x: 0, y: -0.8, scale: 0.18 },
};

// Live viewport (world units at the heart's depth) → world position.
export function ndcToWorld(
  ndc: { x: number; y: number },
  viewport: { width: number; height: number },
) {
  return { x: (ndc.x * viewport.width) / 2, y: (ndc.y * viewport.height) / 2 };
}

export function isMobileViewport() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 767px)').matches
  );
}

export function placeHeart(section: SectionId, mobile = isMobileViewport()) {
  const pose = poseFor(section, mobile);
  heart.ndc.x = pose.x;
  heart.ndc.y = pose.y;
  heart.scale = pose.scale;
}
