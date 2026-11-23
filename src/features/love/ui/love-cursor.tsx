'use client';

import gsap from 'gsap';
import { useEffect, useRef } from 'react';

import { useQuiet } from '../engine/use-quiet';
import {
  CURSOR_DEFAULT,
  CURSOR_GRAB,
  CURSOR_GRABBING,
  CURSOR_POINTER,
} from './cursor-svgs';

export function LoveCursor() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const quiet = useQuiet();
  const quietRef = useRef(quiet);

  useEffect(() => {
    quietRef.current = quiet;
  }, [quiet]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = [
      `[data-love-root]{cursor:${CURSOR_DEFAULT}}`,
      `[data-love-root] a,[data-love-root] button,[data-love-root] [role="button"],[data-love-root] .cursor-pointer{cursor:${CURSOR_POINTER}}`,
      `[data-love-root] [role="scrollbar"]{cursor:${CURSOR_POINTER}}`,
      `[data-love-root] [data-scroll-thumb]{cursor:${CURSOR_GRAB}}`,
      `[data-love-root] [role="scrollbar"]:active,[data-love-root] [data-scroll-thumb]:active{cursor:${CURSOR_GRABBING}}`,
    ].join('');
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    let downPos = { x: 0, y: 0 };
    let isDown = false;
    let isDragging = false;
    let holdTimer: ReturnType<typeof setTimeout> | null = null;
    let holdEl: SVGSVGElement | null = null;
    let trailCount = 0;
    let frameSkip = 0;
    const MAX_TRAIL = 30;

    const inRoot = (e: PointerEvent) =>
      (e.target as Element)?.closest?.('[data-love-root]') !== null;

    const spawnDot = (
      x: number,
      y: number,
      size: number,
      color: string,
      duration: number,
      burst?: { angle: number; dist: number },
    ) => {
      const el = document.createElement('div');
      Object.assign(el.style, {
        position: 'absolute',
        left: `${x - size / 2}px`,
        top: `${y - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: color,
        willChange: 'opacity, transform',
        pointerEvents: 'none',
      });
      overlay.appendChild(el);

      if (burst) {
        gsap.fromTo(
          el,
          { opacity: 0.9, x: 0, y: 0 },
          {
            opacity: 0,
            x: Math.cos(burst.angle) * burst.dist,
            y: Math.sin(burst.angle) * burst.dist,
            duration,
            ease: 'power2.out',
            onComplete: () => el.remove(),
          },
        );
      } else {
        gsap.fromTo(
          el,
          { opacity: 0.6 },
          {
            opacity: 0,
            duration,
            ease: 'power1.out',
            onComplete: () => {
              el.remove();
              trailCount--;
            },
          },
        );
        trailCount++;
        if (trailCount > MAX_TRAIL) {
          const oldest = overlay.querySelector<HTMLElement>(
            'div[style*="will-change"]',
          );
          if (oldest) {
            gsap.killTweensOf(oldest);
            oldest.remove();
            trailCount--;
          }
        }
      }
    };

    const clickBurst = (x: number, y: number) => {
      if (quietRef.current) {
        const ring = document.createElement('div');
        Object.assign(ring.style, {
          position: 'absolute',
          left: `${x - 16}px`,
          top: `${y - 16}px`,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '2px solid #d2b16f',
          willChange: 'opacity, transform',
          pointerEvents: 'none',
        });
        overlay.appendChild(ring);
        gsap.fromTo(
          ring,
          { scale: 0.3, opacity: 0.8 },
          {
            scale: 1.2,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => ring.remove(),
          },
        );
        return;
      }
      const count = 7;
      const colors = ['#d2b16f', '#c8b6e2'];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const dist = 20 + Math.random() * 30;
        spawnDot(x, y, 6 + Math.random() * 3, colors[i % 2], 0.4, {
          angle,
          dist,
        });
      }
    };

    const startHold = (x: number, y: number) => {
      if (quietRef.current) return;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '64');
      svg.setAttribute('height', '64');
      svg.setAttribute('viewBox', '0 0 64 64');
      Object.assign(svg.style, {
        position: 'absolute',
        left: `${x - 32}px`,
        top: `${y - 32}px`,
        pointerEvents: 'none',
      });
      const circle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle',
      );
      const r = 24;
      const circ = 2 * Math.PI * r;
      circle.setAttribute('cx', '32');
      circle.setAttribute('cy', '32');
      circle.setAttribute('r', String(r));
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', '#d2b16f');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('stroke-dasharray', String(circ));
      circle.setAttribute('stroke-dashoffset', String(circ));
      circle.setAttribute('stroke-linecap', 'round');
      svg.appendChild(circle);
      overlay.appendChild(svg);
      holdEl = svg;
      gsap.to(circle, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power1.inOut',
      });
    };

    const clearHold = () => {
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
      if (holdEl) {
        const el = holdEl;
        holdEl = null;
        gsap.to(el, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => el.remove(),
        });
      }
    };

    const onDown = (e: PointerEvent) => {
      if (!inRoot(e)) return;
      isDown = true;
      isDragging = false;
      frameSkip = 0;
      downPos = { x: e.clientX, y: e.clientY };
      holdTimer = setTimeout(() => startHold(e.clientX, e.clientY), 300);
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - downPos.x;
      const dy = e.clientY - downPos.y;
      if (!isDragging && dx * dx + dy * dy > 16) {
        isDragging = true;
        clearHold();
      }
      if (isDragging && !quietRef.current) {
        frameSkip++;
        if (frameSkip % 3 === 0) {
          spawnDot(e.clientX, e.clientY, 6, '#c8b6e2', 0.6);
        }
      }
    };

    const onUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      clearHold();
      if (!isDragging && inRoot(e)) {
        clickBurst(e.clientX, e.clientY);
      }
      isDragging = false;
    };

    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);

    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      clearHold();
      if (overlay.children.length) {
        gsap.killTweensOf(Array.from(overlay.children));
      }
      overlay.innerHTML = '';
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    />
  );
}
