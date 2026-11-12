'use client';

import { Button } from '@/components/ui/button';

import { LoveSection, proseColumn, sectionTitle } from './love-section';

export function Finale({ name, message }: { name: string; message: string }) {
  return (
    <LoveSection id="finale" dawn={1} className="flex min-h-svh items-center">
      <h2 id="finale-title" className={sectionTitle}>
        Happy birthday, <span className="text-gold-text">{name}</span>.
      </h2>
      <p className={`${proseColumn} mt-6`}>{message}</p>
      <Button
        size="lg"
        className="mt-10"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Replay our story
      </Button>
    </LoveSection>
  );
}
