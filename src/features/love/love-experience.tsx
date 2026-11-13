'use client';

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import type { LoveSiteConfig } from './config';
import { useMotionPrefs } from './engine/motion-prefs';
import { MotionPrefsProvider } from './engine/motion-prefs-provider';
import { ScrollEngine, useLoveScroll } from './engine/scroll-engine';
import { director } from './engine/heart-director';
import { resetSession } from './engine/session';
import { killHeroIntro, playHeroIntro, tapHeart } from './engine/hero-intro';
import { buildStory } from './engine/story';
import { TierProvider, useTier } from './engine/tier-provider';
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
import { CalmModeToggle } from './ui/calm-mode-toggle';
import { MusicToggle } from './ui/music-toggle';
import { ProgressHeart } from './ui/progress-heart';

// Client-only 3D chunk (Tech Stack §5.1): never in shop bundles, never server-rendered.
const LoveCanvas = dynamic(() => import('./canvas/love-canvas'), {
  ssr: false,
});

// Dev-only panel: the import is dead code in production builds, so the chunk is never emitted.
const HeartDebugPanel =
  process.env.NODE_ENV !== 'production'
    ? dynamic(() => import('./dev/heart-debug-panel'), { ssr: false })
    : null;

const noSubscribe = () => () => {};
const readDebug = () =>
  new URLSearchParams(window.location.search).has('debug');
const serverFalse = () => false;

export function LoveExperience({ site }: { site: LoveSiteConfig }) {
  return (
    <MotionPrefsProvider>
      <TierProvider>
        <ScrollEngine>
          <LoveStory site={site} />
        </ScrollEngine>
      </TierProvider>
    </MotionPrefsProvider>
  );
}

function LoveStory({ site }: { site: LoveSiteConfig }) {
  const { calm } = useMotionPrefs();
  const { tier, stepDown, stepUp } = useTier();
  const showCanvas = !calm && tier !== 'static';
  const debug =
    useSyncExternalStore(noSubscribe, readDebug, serverFalse) &&
    HeartDebugPanel !== null;
  const rootRef = useRef<HTMLDivElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => killHeroIntro, []);
  const name = site.recipient.name;
  const { scrollTo } = useLoveScroll();

  // Experience §14 Replay: clean flags and heart, then glide home; the hero re-weaves on arrival.
  const replay = () => {
    resetSession();
    director.settle();
    ScrollTrigger.refresh();
    scrollTo(0, calm ? { immediate: true } : { duration: 2.6 });
  };

  useGSAP(
    () => {
      const cleanup = buildStory(rootRef.current!, { calm, tier });
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      return cleanup;
    },
    { scope: rootRef, dependencies: [calm, tier] },
  );

  return (
    <div
      ref={rootRef}
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
      {showCanvas && (
        <LoveCanvas
          tier={tier}
          memories={site.memories}
          onDecline={stepDown}
          onIncline={stepUp}
          debug={debug}
          onHeartTap={tapHeart}
          onReady={() => setCanvasReady(true)}
        />
      )}
      {debug && HeartDebugPanel && <HeartDebugPanel />}
      <main>
        <Hero name={name} sub={site.copy.heroSub} />
        <Bloom line={site.copy.bloomLine} />
        <Memories hint={site.copy.memoriesHint} memories={site.memories} />
        <Timeline title={site.copy.timelineTitle} items={site.timeline} />
        <Dawn quote={site.copy.dawnQuote} />
        <Gallery title={site.copy.galleryTitle} photos={site.gallery} />
        <Wish
          name={name}
          prompt={site.copy.wishPrompt}
          done={site.copy.wishDone}
        />
        <Letter title={site.copy.letterTitle} letter={site.letter} />
        <Finale
          name={name}
          message={site.copy.finaleMessage}
          onReplay={replay}
        />
      </main>
      <Gate
        name={name}
        musicSrc={site.music.src}
        sceneReady={canvasReady || !showCanvas}
        onEnter={(seed) => {
          setEntered(true);
          playHeroIntro(rootRef.current!, { from: seed, calm });
        }}
      />
      {entered && <MusicToggle />}
      <ProgressHeart />
      <CalmModeToggle />
    </div>
  );
}
