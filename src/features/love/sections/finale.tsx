'use client';

import { Button } from '@/components/ui/button';

import { useMusicToggle } from '../ui/music-toggle';
import { LoveSection, proseColumn, sectionTitle } from './love-section';

type Props = { name: string; message: string; onReplay: () => void };

// Experience §14. The heart, finaleBurst and the Replay reset are driven from story.ts and
// love-experience.tsx; this is the DOM only.
export function Finale({ name, message, onReplay }: Props) {
  const { muted, toggle } = useMusicToggle();
  return (
    <LoveSection
      id="finale"
      dawn={1}
      stage="100vh"
      className="flex min-h-svh items-center"
    >
      <h2 id="finale-title" className={sectionTitle}>
        Happy birthday, <span className="text-gold-text">{name}</span>.
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
    </LoveSection>
  );
}
