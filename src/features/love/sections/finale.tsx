'use client';

import { Button } from '@/components/ui/button';

import { useMusicToggle } from '../ui/music-toggle';
import { QuietHeart } from '../ui/static-heart';
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
};

// Experience §14. The heart, finaleBurst and the Replay reset are driven from story.ts and
// love-experience.tsx; this is the DOM only.
export function Finale({ name, message, credit, onReplay }: Props) {
  const { muted, toggle } = useMusicToggle();
  return (
    <LoveSection
      id="finale"
      depth={0.5}
      stage="100vh"
      className="flex min-h-svh items-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[min(90vw,40rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--love-aurora-gold)_0%,var(--love-aurora-lav)_40%,transparent_70%)]"
      />
      <QuietHeart glow className="mb-10 size-40 md:size-52" />
      <h2 id="finale-title" className={sectionTitle}>
        Happy birthday, <span className="text-primary">{name}</span>.
      </h2>
      <p className={`${proseColumn} mt-6`}>{message}</p>
      <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button size="lg" className="w-full sm:w-auto" onClick={onReplay}>
          Replay our story
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="w-full sm:w-auto"
          aria-pressed={!muted}
          onClick={toggle}
        >
          {muted ? 'Music on' : 'Music off'}
        </Button>
      </div>
      {credit && <p className={`${labelText} mt-8`}>Music: {credit}</p>}
    </LoveSection>
  );
}
