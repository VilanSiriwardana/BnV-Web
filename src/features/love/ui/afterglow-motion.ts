import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Flip } from 'gsap/Flip';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';
import { SplitText } from 'gsap/SplitText';

// Blueprint 059: shared motion kit for the Afterglow rooms (one plugin registration).
if (typeof window !== 'undefined') {
  gsap.registerPlugin(
    CustomEase,
    DrawSVGPlugin,
    Flip,
    MorphSVGPlugin,
    Physics2DPlugin,
    SplitText,
  );
  CustomEase.create('love-soft', 'M0,0 C0.2,0.7 0.3,1 1,1');
  CustomEase.create(
    'love-dial',
    'M0,0 C0.4,0 0.2,1.15 0.6,1.02 0.8,0.98 1,1 1,1',
  );
}

export { Flip, gsap, SplitText };

/** Line-by-line ink reveal; returns a cleanup that restores the original markup. */
export function inkReveal(
  targets: Element | Element[],
  {
    delay = 0,
    type = 'lines',
  }: { delay?: number; type?: 'lines' | 'chars' } = {},
) {
  const split = SplitText.create(targets, {
    type: type === 'chars' ? 'words,chars' : 'lines',
    mask: type === 'chars' ? undefined : 'lines',
  });
  const parts = type === 'chars' ? split.chars : split.lines;
  const tween = gsap.from(parts, {
    yPercent: type === 'chars' ? 40 : 100,
    opacity: 0,
    filter: 'blur(6px)',
    duration: type === 'chars' ? 0.7 : 0.9,
    ease: 'love-soft',
    stagger: type === 'chars' ? 0.03 : 0.08,
    delay,
    onComplete: () => split.revert(),
  });
  return () => {
    tween.kill();
    split.revert();
  };
}

const SPARK_COLORS = ['var(--gold)', 'var(--primary)', 'var(--secondary)'];

/** A one-shot burst of small glowing sparks (and hearts) from the centre of `container`. */
export function sparkBurst(
  container: HTMLElement,
  {
    count = 18,
    spread = 70,
    up = true,
  }: { count?: number; spread?: number; up?: boolean } = {},
) {
  const rect = container.getBoundingClientRect();
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    const heart = i % 4 === 0;
    s.setAttribute('aria-hidden', 'true');
    s.textContent = heart ? '♥' : '';
    Object.assign(s.style, {
      position: 'absolute',
      left: `${rect.width / 2}px`,
      top: `${rect.height / 2}px`,
      width: heart ? 'auto' : '6px',
      height: heart ? 'auto' : '6px',
      fontSize: '12px',
      lineHeight: '1',
      borderRadius: '9999px',
      pointerEvents: 'none',
      color: SPARK_COLORS[i % 3],
      background: heart ? 'transparent' : SPARK_COLORS[i % 3],
      boxShadow: heart ? 'none' : `0 0 10px ${SPARK_COLORS[i % 3]}`,
    });
    container.appendChild(s);
    const angle = up
      ? -90 + gsap.utils.random(-spread, spread)
      : gsap.utils.random(0, 360);
    gsap
      .timeline({ onComplete: () => s.remove() })
      .to(s, {
        duration: gsap.utils.random(1.1, 1.8),
        physics2D: {
          velocity: gsap.utils.random(160, 320),
          angle,
          gravity: 420,
        },
        rotation: gsap.utils.random(-180, 180),
        ease: 'none',
      })
      .to(s, { opacity: 0, scale: 0.3, duration: 0.5 }, '-=0.5');
  }
}

/** Gentle 3D tilt toward the pointer; returns a cleanup. */
export function magneticTilt(el: HTMLElement | SVGElement, strength = 8) {
  gsap.set(el, { transformPerspective: 700 });
  const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' });
  const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' });
  const move = (ev: Event) => {
    const e = ev as PointerEvent;
    if (e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    ry(((e.clientX - r.left) / r.width - 0.5) * strength * 2);
    rx(-((e.clientY - r.top) / r.height - 0.5) * strength * 2);
  };
  const leave = () => {
    rx(0);
    ry(0);
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  return () => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerleave', leave);
    gsap.set(el, { clearProps: 'transform' });
  };
}

/** Animates `target` from where `origin` sits now (a shared-element handoff). */
export function flipFrom(origin: Element, target: Element, duration = 0.8) {
  const state = Flip.getState(origin);
  return Flip.from(state, {
    targets: target,
    duration,
    ease: 'power3.inOut',
    absolute: true,
    fade: true,
  });
}
