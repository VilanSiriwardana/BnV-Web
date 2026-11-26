'use client';

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import type { LoveSiteConfig } from './config';
import { MotionPrefsProvider } from './engine/motion-prefs-provider';
import { ScrollEngine, useLoveScroll } from './engine/scroll-engine';
import { director } from './engine/heart-director';
import { resetSession } from './engine/session';
import { killHeroIntro, playHeroIntro, tapHeart } from './engine/hero-intro';
import { buildStory } from './engine/story';
import { TierProvider, useTier } from './engine/tier-provider';
import { useQuiet } from './engine/use-quiet';
import { Afterglow, AfterglowLink } from './sections/afterglow';
import { Bloom } from './sections/bloom';
import { Starlight } from './sections/starlight';
import { Finale } from './sections/finale';
import { Dance } from './sections/dance';
import { Gallery } from './sections/gallery';
import { Gate } from './sections/gate';
import { Hero } from './sections/hero';
import { Letter } from './sections/letter';
import { Memories } from './sections/memories';
import { Reasons } from './sections/reasons';
import { Timeline } from './sections/timeline';
import { Wish } from './sections/wish';
import { CalmModeToggle } from './ui/calm-mode-toggle';
import { FoundChip } from './ui/found-chip';
import { LoveSlugContext } from './ui/hidden-heart';
import { MusicToggle } from './ui/music-toggle';
import { LoveCursor } from './ui/love-cursor';
import { LoveScrollbar } from './ui/love-scrollbar';

// Client-only 3D chunk (Tech Stack §5.1): never in shop bundles, never server-rendered.
const LoveCanvas = dynamic(() => import('./canvas/love-canvas'), {
  ssr: false,
});

// Dev-only panel: the import is dead code in production builds, so the chunk is never emitted.
const HeartDebugPanel =
  process.env.NODE_ENV !== 'production'
    ? dynamic(() => import('./dev/heart-debug-panel'), { ssr: false })
    : null;
const GalleryDebugPanel =
  process.env.NODE_ENV !== 'production'
    ? dynamic(() => import('./dev/gallery-debug-panel'), { ssr: false })
    : null;

// Blueprint 065: a refresh always starts the story from the top.
if (typeof window !== 'undefined') history.scrollRestoration = 'manual';

const noSubscribe = () => () => {};
const readDebug = () =>
  new URLSearchParams(window.location.search).has('debug');
const serverFalse = () => false;
const readMic = () =>
  typeof navigator.mediaDevices?.getUserMedia === 'function';

export function LoveExperience({ site }: { site: LoveSiteConfig }) {
  return (
    <MotionPrefsProvider>
      <TierProvider>
        <ScrollEngine>
          <LoveSlugContext value={site.slug}>
            <LoveStory site={site} />
          </LoveSlugContext>
        </ScrollEngine>
      </TierProvider>
    </MotionPrefsProvider>
  );
}

function LoveStory({ site }: { site: LoveSiteConfig }) {
  const quiet = useQuiet();
  const { tier, setTier, stepDown, stepUp } = useTier();
  const showCanvas = !quiet;
  const debug =
    useSyncExternalStore(noSubscribe, readDebug, serverFalse) &&
    HeartDebugPanel !== null;
  const rootRef = useRef<HTMLDivElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => killHeroIntro, []);
  const name = site.recipient.name;
  // F5: the candle replaces the star when the config allows it and a mic API exists.
  const micApi = useSyncExternalStore(noSubscribe, readMic, serverFalse);
  const candleMode = site.wish?.mode !== 'star' && micApi;
  const spell: [string, string] = [
    site.finale?.spell?.line1 ?? name,
    site.finale?.spell?.line2 ?? 'I love you',
  ];
  const { scrollTo } = useLoveScroll();

  // Experience §14 Replay: clean flags and heart, then glide home; the hero re-weaves on arrival.
  const replay = () => {
    resetSession();
    director.settle();
    ScrollTrigger.refresh();
    scrollTo(0, quiet ? { immediate: true } : { duration: 2.6 });
  };

  useGSAP(
    () => {
      window.scrollTo(0, 0);
      const cleanup = buildStory(rootRef.current!, { quiet, tier });
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      return cleanup;
    },
    { scope: rootRef, dependencies: [quiet, tier] },
  );

  return (
    <div
      ref={rootRef}
      data-love-root
      data-love-motion={quiet ? undefined : ''}
      className="bg-background text-foreground min-h-svh"
    >
      <LoveCursor />
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
          gallery={site.gallery}
          galleryEnd={site.galleryEnd}
          reasons={site.reasons}
          onContextLost={() => setTier('static')}
          onDecline={stepDown}
          onIncline={stepUp}
          debug={debug}
          onHeartTap={tapHeart}
          onReady={() => setCanvasReady(true)}
          spell={spell}
          candleMode={candleMode}
        />
      )}
      {debug && HeartDebugPanel && <HeartDebugPanel />}
      {debug && GalleryDebugPanel && <GalleryDebugPanel />}
      <main id="love-main">
        <Hero name={name} sub={site.copy.heroSub} />
        <Bloom
          line={site.copy.bloomLine}
          lines={site.copy.bloomLines}
          emphasis={site.copy.bloomEmphasis}
        />
        <Memories hint={site.copy.memoriesHint} memories={site.memories} />
        <Timeline title={site.copy.timelineTitle} items={site.timeline} />
        <Starlight
          line={site.copy.starlightLine}
          hint={site.copy.skyHint ?? 'Join the stars, one to the next.'}
          done={site.copy.skyDone ?? 'It was always a heart.'}
          reveal={site.copy.skyReveal ?? []}
          slug={site.slug}
          memories={site.memories}
        />
        <Gallery
          title={site.copy.galleryTitle}
          photos={site.gallery}
          galleryEnd={site.galleryEnd}
          name={name}
          welcome={site.copy.galleryWelcome}
          plaque={site.copy.galleryPlaque}
          ritual={site.copy.galleryRitual}
        />
        <Dance title={site.copy.danceTitle} line={site.copy.danceLine} />
        <Reasons
          title={site.copy.reasonsTitle ?? 'Reasons'}
          hint={site.copy.reasonsHint ?? ''}
          items={site.reasons ?? []}
        />
        <Wish
          name={name}
          prompt={site.copy.wishPrompt}
          done={site.copy.wishDone}
          candleMode={candleMode}
          blowHint={site.copy.blowHint}
        />
        <Letter title={site.copy.letterTitle} letter={site.letter} />
        <Finale
          name={name}
          message={site.copy.finaleMessage}
          spell={spell}
          credit={site.music.credit}
          onReplay={replay}
        >
          {site.afterglow && <AfterglowLink />}
        </Finale>
        <Afterglow site={site} onReplay={replay} />
      </main>
      <Gate
        name={name}
        musicSrc={site.music.src}
        sceneReady={canvasReady || !showCanvas}
        onEnter={(seed) => {
          setEntered(true);
          playHeroIntro(rootRef.current!, { from: seed, calm: quiet });
        }}
      />
      {entered && <MusicToggle />}
      {entered && <FoundChip slug={site.slug} />}
      <LoveScrollbar />
      <CalmModeToggle />
    </div>
  );
}
