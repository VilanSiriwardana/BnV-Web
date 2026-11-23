'use client';

import { RotateCcw } from 'lucide-react';
import { type ReactNode, useRef } from 'react';

import { Button } from '@/components/ui/button';

import { useMusicToggle } from '../ui/music-toggle';
import { QuietHeart } from '../ui/static-heart';
import { QuietSpell, useSpellFade } from './finale-spell';
import { TinyHeart } from './letter-ornaments';
import {
  LoveSection,
  labelText,
  proseColumn,
  sectionTitle,
} from './love-section';

type Props = {
  name: string;
  message: string;
  credit: string;
  onReplay: () => void;
  /** F1: the two phrases the heart spells. */
  spell: [string, string];
  children?: ReactNode;
};

// Experience §14, Romance Additions §9.6. The heart sits high (HEART_PATH.finale) and its zone
// stays clear of text; finaleSpell and Replay are driven from story.ts and love-experience.tsx.
export function Finale({
  name,
  message,
  credit,
  onReplay,
  spell,
  children,
}: Props) {
  const { muted, toggle } = useMusicToggle();
  const text = useRef<HTMLDivElement>(null);
  useSpellFade(text);
  return (
    <LoveSection
      id="finale"
      depth={0.5}
      stage="100vh"
      className="flex min-h-svh flex-col items-center justify-end pb-[10svh]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[28%] left-1/2 -z-10 size-[min(70vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--love-aurora-gold)_0%,var(--love-aurora-lav)_35%,transparent_62%)] opacity-60"
      />
      <QuietHeart glow className="mb-10 size-40 md:size-52" />
      <QuietSpell lines={spell} />
      <p className="sr-only">
        The heart spells {spell[0]}, then {spell[1]}.
      </p>
      <div ref={text} className="relative flex w-full flex-col items-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-10%] -inset-y-12 -z-10 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--background)_70%,transparent)_0%,transparent_70%)]"
        />
        <h2 id="finale-title" className={sectionTitle}>
          Happy birthday, <span className="text-primary">{name}</span>.
        </h2>
        <p className={`${proseColumn} mt-6 italic`}>{message}</p>
        <div
          aria-hidden
          className="text-gold-text mt-8 flex w-40 items-center gap-3"
        >
          <span className="bg-gold/50 h-px flex-1" />
          <TinyHeart className="size-3" />
          <span className="bg-gold/50 h-px flex-1" />
        </div>
        <Button
          variant="love-primary"
          size="lg"
          className="mt-6"
          onClick={onReplay}
        >
          <RotateCcw aria-hidden className="text-gold" />
          Replay our story
        </Button>
        <div className="mt-4 flex flex-col items-center gap-3">
          <Button
            variant="love-link"
            size="inline"
            aria-pressed={!muted}
            onClick={toggle}
          >
            ♪ Music {muted ? 'on' : 'off'}
          </Button>
          {children}
        </div>
        {credit && <p className={`${labelText} mt-8`}>Music: {credit}</p>}
      </div>
    </LoveSection>
  );
}
