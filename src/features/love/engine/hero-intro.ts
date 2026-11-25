import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

import { spawnTapHearts } from '../canvas/mini-hearts';
import { director } from './heart-director';
import { HEART_PATH, HERO_RISE, isMobileViewport, poseFor } from './heart-path';
import { heart } from './heart-state';
import { REDUCED_MOTION_QUERY } from './motion-prefs';

if (typeof window !== 'undefined') gsap.registerPlugin(SplitText);

const TAP_COOLDOWN_MS = 1200;
const MAX_YAW = (6 * Math.PI) / 180;

let intro: gsap.core.Timeline | null = null;
let idle: gsap.core.Timeline | null = null;
let split: SplitText | null = null;
let removeParallax: (() => void) | null = null;
let lastTap = -Infinity;
let entered = false;

function startParallax() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const onMove = (e: PointerEvent) => {
    heart.yaw = ((e.clientX / window.innerWidth) * 2 - 1) * MAX_YAW;
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  removeParallax = () => window.removeEventListener('pointermove', onMove);
}

// Additive idle fields, so breathing never fights director tweens (Tech Stack §7.4).
function startIdle(delay: number) {
  idle = gsap
    .timeline({ repeat: -1, yoyo: true, delay })
    .fromTo(
      heart,
      { idleScale: -0.015, idleGlow: -0.04 },
      { idleScale: 0.015, idleGlow: 0.04, duration: 2, ease: 'sine.inOut' },
    );
}

// Experience §6 timings. Played once by the gate tap; `from` is the seed's NDC position.
export function playHeroIntro(
  root: HTMLElement,
  { from, calm }: { from?: { x: number; y: number }; calm: boolean },
) {
  killHeroIntro();
  entered = true;
  director.setBaseline('hero');
  const pose = poseFor('hero', isMobileViewport());
  heart.scale = pose.scale;
  gsap.killTweensOf(heart, 'ambientIn');
  heart.ambientIn = 0;
  const title = root.querySelector<HTMLElement>('[data-hero-title]');
  const fades = root.querySelectorAll<HTMLElement>('[data-hero-fade]');
  const cue = root.querySelector<HTMLElement>('[data-hero-cue]');

  if (calm) {
    Object.assign(heart.ndc, { x: pose.x, y: pose.y });
    heart.form = 1;
    heart.ambientIn = 1;
    return;
  }
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
    Object.assign(heart.ndc, { x: pose.x, y: pose.y });
    director.play('ribbonWeave');
    heart.ambientIn = 1;
    gsap.fromTo(
      [title, ...fades, cue],
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3 },
    );
    return;
  }

  if (from) Object.assign(heart.ndc, from);
  heart.glow = HEART_PATH.hero.glow;
  intro = gsap.timeline();
  intro
    .to(
      heart.ndc,
      { x: pose.x, y: pose.y - HERO_RISE, duration: 3.2, ease: 'power2.inOut' },
      0,
    )
    .to(heart.ndc, { y: pose.y, duration: 2.6, ease: 'sine.inOut' }, 3.4)
    .call(() => void director.play('ribbonWeave'), [], 0)
    .call(() => void director.play('pulse'), [], 3.2);

  if (title) {
    // aria: 'auto' keeps one readable label on the heading; split chars are aria-hidden.
    split = SplitText.create(title, { type: 'words,chars', aria: 'auto' });
    intro.fromTo(
      split.chars,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
      3.4,
    );
  }
  intro
    .fromTo(
      fades,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.4 },
      4.2,
    )
    .fromTo(cue, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 5)
    // Ambient hearts wait for the intro to finish, then ease in.
    .to(heart, { ambientIn: 1, duration: 1.6, ease: 'sine.inOut' }, 5.4);
  // Hide the copy before the first frame so nothing flashes before the intro reaches it.
  intro.progress(0.0001).progress(0);
  if (cue?.firstElementChild)
    gsap.to(cue.firstElementChild, {
      y: -4,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

  startIdle(3.4);
  startParallax();
}

export function tapHeart() {
  const now = performance.now();
  if (!entered || now - lastTap < TAP_COOLDOWN_MS) return;
  lastTap = now;
  director.play('pulse');
  spawnTapHearts(6);
}

export function killHeroIntro() {
  intro?.kill();
  idle?.kill();
  split?.revert();
  removeParallax?.();
  intro = idle = split = removeParallax = null;
  heart.idleScale = heart.idleGlow = heart.yaw = 0;
}

// Replay (Experience §14): back at the top, the ribbons weave again. Idle and parallax keep running.
export function replayHeroWeave() {
  director.settle();
  director.setBaseline('hero');
  const pose = poseFor('hero', isMobileViewport());
  Object.assign(heart.ndc, { x: pose.x, y: pose.y });
  heart.scale = pose.scale;
  heart.gold = HEART_PATH.hero.gold;
  heart.form = 0;
  director.play('ribbonWeave');
  director.play('pulse');
}
