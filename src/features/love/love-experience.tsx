'use client';

import type { LoveSiteConfig } from './config';
import { useMotionPrefs } from './engine/motion-prefs';
import { MotionPrefsProvider } from './engine/motion-prefs-provider';
import { ScrollEngine } from './engine/scroll-engine';
import { Bloom } from './sections/bloom';
import { Dawn } from './sections/dawn';
import { Finale } from './sections/finale';
import { Gallery } from './sections/gallery';
import { Gate } from './sections/gate';
import { Hero } from './sections/hero';
import { Letter } from './sections/letter';
import { Memories } from './sections/memories';
import { Timeline } from './sections/timeline';
import { Wish } from './sections/wish';

export function LoveExperience({ site }: { site: LoveSiteConfig }) {
  return (
    <MotionPrefsProvider>
      <ScrollEngine>
        <LoveStory site={site} />
      </ScrollEngine>
    </MotionPrefsProvider>
  );
}

function LoveStory({ site }: { site: LoveSiteConfig }) {
  const { calm } = useMotionPrefs();
  const name = site.recipient.name;
  return (
    <div
      data-love-root
      data-love-motion={calm ? undefined : ''}
      className="bg-background text-foreground min-h-svh"
    >
      <a
        href="#letter"
        className="bg-primary text-label text-primary-foreground focus-ring sr-only rounded-md px-4 py-2 font-sans focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
      >
        Skip to the letter
      </a>
      <main>
        <Gate name={name} />
        <Hero name={name} sub={site.copy.heroSub} />
        <Bloom line={site.copy.bloomLine} />
        <Memories hint={site.copy.memoriesHint} memories={site.memories} />
        <Timeline title={site.copy.timelineTitle} items={site.timeline} />
        <Dawn quote={site.copy.dawnQuote} />
        <Gallery title={site.copy.galleryTitle} photos={site.gallery} />
        <Wish name={name} prompt={site.copy.wishPrompt} />
        <Letter title={site.copy.letterTitle} letter={site.letter} />
        <Finale name={name} message={site.copy.finaleMessage} />
      </main>
    </div>
  );
}
