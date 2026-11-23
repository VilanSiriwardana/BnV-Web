'use client';

import gsap from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Button } from '@/components/ui/button';

import { spawnTapHearts } from '../canvas/mini-hearts';
import { audio } from '../engine/audio-engine';
import { playChime } from '../engine/chime';
import { director } from '../engine/heart-director';
import { reasons } from '../engine/reasons-state';
import { frontIndex, type Ring, stepRing } from '../engine/ring-physics';

const DRAG_THRESHOLD = 8;
const RAD_PER_PX = 0.006;
const SCROLL_IDLE_MS = 120;
const FRONT_EVENT_MS = 800;
const BEAT_MS = 33;

export const pad2 = (i: number) => String(i + 1).padStart(2, '0');

// Romance Additions F4. One clock: gsap.ticker writes --ring-angle (and --love-beat while in view);
// React state changes only when a new card reaches the front.
export function ReasonsRing({ items }: { items: string[] }) {
  const n = items.length;
  const step = (2 * Math.PI) / n;
  const ringRef = useRef<HTMLDivElement>(null);
  const ring = useRef<Ring>({ angle: 0, vel: 0 });
  const held = useRef(false); // pointer drag or keyboard tween in progress
  const [front, setFront] = useState(0);
  const drag = useRef({
    id: -1,
    x: 0,
    y: 0,
    lastX: 0,
    lastT: 0,
    vel: 0,
    captured: false,
    moved: false,
  });

  useEffect(() => {
    const el = ringRef.current;
    if (!el) return;
    let lastBase = 0;
    let lastScroll = -Infinity;
    let lastFront = 0;
    let lastFrontEvent = -Infinity;
    let lastBeat = 0;
    let written = NaN;
    let moving = false;

    const tick = (_t: number, deltaMs: number) => {
      const now = performance.now();
      const base = -reasons.progress * 2 * Math.PI;
      if (base !== lastBase) {
        ring.current.angle += base - lastBase;
        lastBase = base;
        lastScroll = now;
      }
      const hold = held.current || now - lastScroll < SCROLL_IDLE_MS;
      // Mutated in place so keyboard tweens keep their target.
      Object.assign(
        ring.current,
        stepRing(ring.current, deltaMs / 1000, step, hold),
      );
      const { angle } = ring.current;
      if (angle !== written) {
        written = angle;
        el.style.setProperty('--ring-angle', `${angle.toFixed(4)}rad`);
      }
      const isMoving = hold || ring.current.vel !== 0;
      if (isMoving !== moving) {
        moving = isMoving;
        el.style.willChange = moving ? 'transform' : '';
      }
      const f = frontIndex(angle, step, n);
      if (f !== lastFront) {
        lastFront = f;
        setFront(f);
        playChime(f);
        if (now - lastFrontEvent >= FRONT_EVENT_MS) {
          lastFrontEvent = now;
          director.play('reasonFront');
        }
      }
      if (reasons.active && now - lastBeat >= BEAT_MS) {
        lastBeat = now;
        el.style.setProperty('--love-beat', audio.bands.bass.toFixed(2));
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [n, step]);

  const go = (dir: 1 | -1) => {
    const target = (Math.round(ring.current.angle / step) - dir) * step;
    held.current = true;
    gsap.to(ring.current, {
      angle: target,
      vel: 0,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: true,
      onComplete: () => {
        held.current = false;
      },
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
    else return;
    e.preventDefault();
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    d.id = e.pointerId;
    d.x = d.lastX = e.clientX;
    d.y = e.clientY;
    d.lastT = performance.now();
    d.vel = 0;
    d.captured = false;
    d.moved = false;
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (e.pointerId !== d.id) return;
    const dx = e.clientX - d.x;
    if (!d.captured) {
      if (
        Math.abs(dx) < DRAG_THRESHOLD ||
        Math.abs(dx) < Math.abs(e.clientY - d.y)
      )
        return;
      d.captured = true;
      d.moved = true;
      held.current = true;
      gsap.killTweensOf(ring.current);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const now = performance.now();
    const delta = (e.clientX - d.lastX) * RAD_PER_PX;
    const dt = Math.max(1, now - d.lastT) / 1000;
    ring.current.angle += delta;
    ring.current.vel = 0;
    d.vel = d.vel * 0.6 + (delta / dt) * 0.4;
    d.lastX = e.clientX;
    d.lastT = now;
  };

  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (e.pointerId !== d.id) return;
    d.id = -1;
    if (!d.captured) return;
    held.current = false;
    ring.current.vel = d.vel;
  };

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Reasons"
      className="pointer-events-auto mt-6 flex w-full flex-col items-center"
    >
      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        className="focus-ring relative h-76 w-full touch-pan-y select-none perspective-[1100px] md:h-88"
      >
        <div
          ref={ringRef}
          className="absolute inset-0 [--card-w:12rem] [--ring-r:calc(var(--card-w)*1.95)] transform-3d max-md:scale-[0.62] md:[--card-w:15rem]"
          style={{ '--ring-angle': '0rad' } as CSSProperties}
        >
          <div className="absolute inset-0 transform-[translateZ(calc(var(--ring-r)*-1))_rotateY(var(--ring-angle))] transform-3d">
            {items.map((text, i) => (
              <ReasonCard
                key={i}
                index={i}
                text={text}
                deg={(i * 360) / n}
                isFront={i === front}
                onTap={() => {
                  if (drag.current.moved) return;
                  if (i === front) spawnTapHearts(3);
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <Button
          variant="love-ghost"
          size="icon"
          className="size-11 rounded-full"
          aria-label="Previous reason"
          onClick={() => go(-1)}
        >
          <ChevronLeft aria-hidden className="text-gold" />
        </Button>
        <p
          aria-live="polite"
          className="text-small min-w-16 font-sans tracking-wide tabular-nums"
        >
          <span className="sr-only">
            Reason {front + 1} of {n}: {items[front]}
          </span>
          <span aria-hidden>
            {pad2(front)} / {pad2(n - 1)}
          </span>
        </p>
        <Button
          variant="love-ghost"
          size="icon"
          className="size-11 rounded-full"
          aria-label="Next reason"
          onClick={() => go(1)}
        >
          <ChevronRight aria-hidden className="text-gold" />
        </Button>
      </div>
    </div>
  );
}

function ReasonCard({
  index,
  text,
  deg,
  isFront,
  onTap,
}: {
  index: number;
  text: string;
  deg: number;
  isFront: boolean;
  onTap: () => void;
}) {
  const facing = `max(0, cos(calc(var(--ring-angle) + ${deg}deg)))`;
  return (
    <figure
      aria-hidden={!isFront}
      onClick={onTap}
      className="bg-surface border-gold/30 absolute top-1/2 left-1/2 -mt-32 -ml-[calc(var(--card-w)/2)] flex h-64 w-(--card-w) flex-col justify-between rounded-lg border p-5 text-left shadow-[0_0_calc(6px+var(--love-beat,0)*10px)_color-mix(in_oklab,var(--gold)_25%,transparent)] backface-hidden max-md:shadow-none"
      style={{
        transform: `rotateY(${deg}deg) translateZ(var(--ring-r))`,
        opacity: `calc(0.2 + 0.8 * ${facing})`,
        scale: `calc(0.86 + 0.14 * ${facing})`,
      }}
    >
      <span className="text-gold-text font-sans text-xs tracking-[0.2em]">
        {pad2(index)}
      </span>
      <div className="relative my-3 flex-1 overflow-hidden rounded">
        <Image
          src={`/images/prototype/love-gallery-${String(index + 1).padStart(2, '0')}.webp`}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 767px) 192px, 240px"
          aria-hidden
        />
      </div>
      <blockquote className="font-body text-[20px] leading-snug text-pretty">
        {text}
      </blockquote>
    </figure>
  );
}
