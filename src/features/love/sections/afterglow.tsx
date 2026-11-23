'use client';

import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { LoveSiteConfig } from '../config';
import { useLoveScroll } from '../engine/scroll-engine';
import { useQuiet } from '../engine/use-quiet';
import { HIDDEN_HEART_HINT_SECTIONS } from '../ui/hidden-heart-placements';
import { AfterglowGifts } from './afterglow-gifts';
import { AfterglowNotes } from './afterglow-notes';
import { AfterglowSecret } from './afterglow-secret';
import { HeartDivider } from './letter-ornaments';
import { LoveSection, proseColumn, sectionTitle } from './love-section';

type Props = { site: LoveSiteConfig; onReplay: () => void };

// Romance Additions F6: a quiet room after the Finale, natural flow (no pin, no stage).
export function Afterglow({ site, onReplay }: Props) {
  const room = site.afterglow;
  if (!room) return null;
  return (
    <LoveSection id="afterglow" depth={0.5} className="overflow-hidden">
      <div
        aria-hidden
        data-love-aurora
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60svh] opacity-35"
        style={{
          background:
            'radial-gradient(55% 45% at 30% 30%, var(--love-aurora-lav), transparent 70%), radial-gradient(45% 40% at 72% 40%, var(--love-aurora-gold), transparent 70%)',
        }}
      />
      <h2 id="afterglow-title" data-reveal className={sectionTitle}>
        {site.copy.afterglowTitle ?? 'Afterglow'}
      </h2>
      {site.copy.afterglowIntro && (
        <p data-reveal className={`${proseColumn} mt-6 italic`}>
          {site.copy.afterglowIntro}
        </p>
      )}
      <div className="mt-24 flex w-full flex-col items-center gap-32">
        {room.gifts && <AfterglowGifts slug={site.slug} gifts={room.gifts} />}
        {room.openWhen && room.openWhen.length > 0 && (
          <AfterglowNotes
            slug={site.slug}
            notes={room.openWhen}
            intro={room.openWhenIntro}
          />
        )}
        {room.secret && (
          <AfterglowSecret
            slug={site.slug}
            secret={room.secret}
            hint={
              site.hidden?.hint ?? `Look near ${HIDDEN_HEART_HINT_SECTIONS}.`
            }
          />
        )}
      </div>
      <div data-reveal className="mt-32 flex flex-col items-center gap-6">
        <HeartDivider />
        <p className={`${proseColumn} italic`}>
          That’s everything, for now. — {site.sender.name}
        </p>
        <Button variant="love-primary" size="lg" onClick={onReplay}>
          <RotateCcw aria-hidden className="text-gold" />
          Replay our story
        </Button>
      </div>
    </LoveSection>
  );
}

// F6: the quiet link under the Finale buttons.
export function AfterglowLink() {
  const { scrollTo } = useLoveScroll();
  const quiet = useQuiet();
  return (
    <Button
      variant="love-link"
      size="inline"
      onClick={() =>
        scrollTo('#afterglow', quiet ? { immediate: true } : { duration: 1.8 })
      }
    >
      There’s a little more…
    </Button>
  );
}
