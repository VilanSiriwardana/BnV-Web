'use client';

import 'lenis/dist/lenis.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactLenis, useLenis } from 'lenis/react';
import { type ReactNode, useCallback, useEffect, useMemo } from 'react';

import { useMotionPrefs } from './motion-prefs';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

// One clock (Tech Stack §7.1): the GSAP ticker drives Lenis; Lenis scroll drives ScrollTrigger.
function LenisClock() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(tick);
    };
  }, [lenis]);

  return null;
}

export function ScrollEngine({ children }: { children: ReactNode }) {
  const { calm } = useMotionPrefs();
  if (calm) return children;

  return (
    <ReactLenis root options={{ autoRaf: false, syncTouch: false }}>
      <LenisClock />
      {children}
    </ReactLenis>
  );
}

type ScrollTarget = string | number | HTMLElement;
type ScrollOptions = {
  offset?: number;
  duration?: number;
  immediate?: boolean;
};

export function useLoveScroll() {
  const lenis = useLenis();

  const scrollTo = useCallback(
    (target: ScrollTarget, opts: ScrollOptions = {}) => {
      if (lenis) {
        lenis.scrollTo(target, opts);
        return;
      }
      if (typeof target === 'number') {
        window.scrollTo({ top: target + (opts.offset ?? 0) });
        return;
      }
      const el =
        typeof target === 'string' ? document.querySelector(target) : target;
      el?.scrollIntoView();
    },
    [lenis],
  );

  const stop = useCallback(() => lenis?.stop(), [lenis]);
  const start = useCallback(() => lenis?.start(), [lenis]);

  return useMemo(() => ({ scrollTo, stop, start }), [scrollTo, stop, start]);
}
