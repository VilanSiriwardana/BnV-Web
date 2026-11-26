'use client';

import gsap from 'gsap';
import { useEffect, useRef } from 'react';

import { endGalleryReveal, onGalleryReveal } from '../engine/gallery-reveal';
import { heart } from '../engine/heart-state';
import { REDUCED_MOTION_QUERY } from '../engine/motion-prefs';
import { useLoveScroll } from '../engine/scroll-engine';

const HEART =
  'M0.5 0.9C0.1 0.6 0 0.35 0.2 0.18C0.33 0.08 0.45 0.15 0.5 0.27C0.55 0.15 0.67 0.08 0.8 0.18C1 0.35 0.9 0.6 0.5 0.9Z';

// Blueprint 071: after the arrow strike, a heart-shaped window opens from the heart onto the
// gallery door. The scroll jump and camera swap happen behind the night veil.
export function HeartIris() {
  const root = useRef<HTMLDivElement>(null);
  const hole = useRef<SVGGElement>(null);
  const rim = useRef<SVGGElement>(null);
  const { scrollTo } = useLoveScroll();

  useEffect(() => {
    let tl: gsap.core.Timeline | null = null;
    let safety: gsap.core.Tween | null = null;
    const finish = () => {
      gsap.set(root.current, { autoAlpha: 0 });
      endGalleryReveal();
    };
    const off = onGalleryReveal(() => {
      const el = root.current;
      const gallery = document.getElementById('gallery');
      if (!el || !gallery) return finish();
      // Lenis jumps in one frame (force: even while stopped) and its scroll event feeds ScrollTrigger.
      const jump = () => {
        scrollTo(gallery.getBoundingClientRect().top + window.scrollY + 2, {
          immediate: true,
          force: true,
        });
      };
      tl?.kill();
      safety?.kill();
      safety = gsap.delayedCall(3, finish);
      if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
        tl = gsap
          .timeline({ onComplete: finish })
          .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
          .call(jump)
          .to(el, { autoAlpha: 0, duration: 0.4 }, '+=0.1');
        return;
      }
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = (heart.ndc.x * 0.5 + 0.5) * w;
      const y = (0.5 - heart.ndc.y * 0.5) * h;
      const s = { v: 0 };
      const place = () => {
        const t = `translate(${x} ${y}) scale(${s.v}) translate(-0.5 -0.55)`;
        hole.current?.setAttribute('transform', t);
        rim.current?.setAttribute('transform', t);
      };
      place();
      tl = gsap
        .timeline({ onComplete: finish })
        .set(el, { autoAlpha: 1 })
        .set(rim.current, { opacity: 1 })
        .call(jump)
        .to(s, {
          v: Math.max(w, h) * 3.2,
          duration: 0.95,
          ease: 'power2.inOut',
          onUpdate: place,
          delay: 0.08,
        })
        .to(rim.current, { opacity: 0, duration: 0.5 }, '-=0.5');
    });
    return () => {
      off();
      tl?.kill();
      safety?.kill();
      endGalleryReveal();
    };
  }, [scrollTo]);

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none invisible fixed inset-0 z-40 opacity-0"
    >
      <svg className="h-full w-full">
        <defs>
          <mask id="love-heart-iris" maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="white" />
            <g ref={hole}>
              <path d={HEART} fill="black" />
            </g>
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="var(--night-background)"
          mask="url(#love-heart-iris)"
        />
        <g ref={rim} className="text-gold">
          <path
            d={HEART}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            style={{ filter: 'drop-shadow(0 0 8px var(--love-aurora-gold))' }}
          />
        </g>
      </svg>
    </div>
  );
}
