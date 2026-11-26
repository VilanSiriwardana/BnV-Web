'use client';

import { tapHeart } from '../engine/hero-intro';
import { QuietHeart } from '../ui/static-heart';
import { LoveSection, proseColumn } from './love-section';
import { HiddenHeart } from '../ui/hidden-heart';
import { ScrollCue } from '../ui/scroll-cue';

export function Hero({ name, sub }: { name: string; sub: string }) {
  return (
    <LoveSection
      id="hero"

      stage="200vh"
      className="relative flex min-h-svh items-end pb-[16svh] md:pb-[12svh]"
    >
      <div data-hero-copy className="flex flex-col items-center">
        <QuietHeart className="mb-16 size-40 md:mb-20 md:size-56" />
        <h1
          id="hero-title"
          data-hero-title
          className="text-display text-gold-text relative text-balance break-words"
        >
          Happy Birthday, <span className="text-primary">{name}</span>
          <HiddenHeart id="hero" />
        </h1>
        <p
          data-hero-fade
          className={`${proseColumn} text-muted-foreground mt-6`}
        >
          {sub}
        </p>
      </div>
      <button
        type="button"
        onClick={tapHeart}
        className="focus-ring sr-only focus:not-sr-only focus:mt-6 focus:rounded-md focus:px-4 focus:py-2 focus:font-sans"
      >
        Make the heart beat
      </button>
      <div
        data-hero-cue
        aria-hidden
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <ScrollCue label="Keep scrolling" />
      </div>
    </LoveSection>
  );
}
