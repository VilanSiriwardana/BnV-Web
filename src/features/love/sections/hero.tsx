'use client';

import { Heart } from 'lucide-react';

import { tapHeart } from '../engine/hero-intro';
import { LoveSection, proseColumn } from './love-section';

export function Hero({ name, sub }: { name: string; sub: string }) {
  return (
    <LoveSection
      id="hero"
      dawn={0}
      stage="200vh"
      className="relative flex min-h-svh items-end pb-[16svh] md:pb-[12svh]"
    >
      <div data-hero-copy className="flex flex-col items-center">
        <h1
          id="hero-title"
          data-hero-title
          className="text-display text-balance break-words"
        >
          Happy Birthday, <span className="text-gold-text">{name}</span>
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
        className="text-primary absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <Heart className="size-4" />
      </div>
    </LoveSection>
  );
}
