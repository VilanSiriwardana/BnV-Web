import gsap from 'gsap';

// All-night theme (2026-11-13): one scrubbed number, --depth (0 aubergine → 1 velvet plum).
// Each step matches the next section's Calm `depth` stop in its LoveSection.
const STEPS: [trigger: string, from: number, to: number][] = [
  ['#memories', 0, 0.5],
  ['#timeline', 0.5, 1],
  ['#gallery', 1, 0.5],
  ['#reasons', 0.5, 0.8],
  ['#wish', 0.8, 1],
  ['#finale', 1, 0.5],
];

export function buildTheme(root: HTMLElement) {
  STEPS.forEach(([trigger, from, to], i) => {
    gsap.fromTo(
      root,
      { '--depth': from },
      {
        '--depth': to,
        ease: 'none',
        immediateRender: i === 0,
        scrollTrigger: {
          trigger,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
        },
      },
    );
  });
}

export function clearTheme(root: HTMLElement) {
  root.style.removeProperty('--depth');
}
