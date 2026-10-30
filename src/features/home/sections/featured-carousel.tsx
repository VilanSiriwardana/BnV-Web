'use client';

import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { SectionHeading } from '@/components/marketing/section-heading';
import { Reveal } from '@/components/motion/reveal';
import {
  ProductCard,
  type ProductCardData,
} from '@/components/product/product-card';
import { Button } from '@/components/ui/button';

type Props = {
  title: string;
  href: string;
  products: ProductCardData[];
};

// Continuous glide that pauses on hover, focus or the Pause button and resumes at the same speed.
export function FeaturedCarousel({ title, href, products }: Props) {
  const reduce = useReducedMotion();
  const [ref, api] = useEmblaCarousel(
    { loop: true, dragFree: true, align: 'start' },
    [
      AutoScroll({
        speed: 0.8,
        startDelay: 600,
        playOnInit: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
        stopOnInteraction: false,
      }),
    ],
  );
  const [userPaused, setUserPaused] = useState(false);
  const paused = userPaused || !!reduce;
  const pausedRef = useRef(paused);

  const auto = useCallback(() => api?.plugins().autoScroll, [api]);

  useEffect(() => {
    pausedRef.current = paused;
    if (!api) return;
    if (paused) auto()?.stop();
    else auto()?.play();
  }, [api, auto, paused]);

  // The plugin resumes itself after hover/drag; honour a manual pause.
  useEffect(() => {
    if (!api) return;
    const keepPaused = () => {
      if (pausedRef.current) auto()?.stop();
    };
    api.on('autoScroll:play', keepPaused);
    return () => {
      api.off('autoScroll:play', keepPaused);
    };
  }, [api, auto]);

  const toggle = () => setUserPaused(!paused);

  const step = (direction: 1 | -1) => {
    if (!api) return;
    auto()?.stop();
    if (direction > 0) api.scrollNext();
    else api.scrollPrev();
    const resume = () => {
      api.off('settle', resume);
      if (!pausedRef.current) auto()?.play();
    };
    api.on('settle', resume);
  };

  return (
    <section
      aria-labelledby="featured-title"
      aria-roledescription="carousel"
      className="section-y mx-auto max-w-[1440px] px-4 md:px-8"
    >
      <Reveal className="flex items-end justify-between gap-4">
        <SectionHeading
          id="featured-title"
          title={title}
          link={{ label: 'View all', href }}
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-pressed={paused}
            aria-label={paused ? 'Play carousel' : 'Pause carousel'}
            onClick={toggle}
          >
            {paused ? (
              <Play className="text-icon" />
            ) : (
              <Pause className="text-icon" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden rounded-full md:inline-flex"
            aria-label="Previous products"
            onClick={() => step(-1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden rounded-full md:inline-flex"
            aria-label="Next products"
            onClick={() => step(1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </Reveal>
      <div
        ref={ref}
        className="-mx-4 mt-8 cursor-grab overflow-hidden px-4 pb-2 active:cursor-grabbing md:mx-0 md:px-0"
      >
        <ul className="-ml-4 flex touch-pan-y" aria-live="off">
          {products.map((product, i) => (
            <li
              key={product.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${products.length}`}
              className="w-[72%] shrink-0 pl-4 sm:w-[40%] md:w-[calc(25%)] lg:w-[calc(100%/6)]"
            >
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
