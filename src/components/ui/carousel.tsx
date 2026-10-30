'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { focusRing } from '@/components/ui/styles';
import { cn } from '@/lib/utils/cn';

type Props = {
  children: React.ReactNode[];
  label: string;
  slideClassName?: string;
  className?: string;
  loop?: boolean;
  showDots?: boolean;
  startIndex?: number;
  thumbnails?: React.ReactNode[];
};

export function Carousel({
  children,
  label,
  slideClassName = 'basis-[85%] sm:basis-1/2 lg:basis-1/3',
  className,
  loop = false,
  showDots = true,
  startIndex = 0,
  thumbnails,
}: Props) {
  const [ref, api] = useEmblaCarousel({
    loop,
    align: 'start',
    startIndex,
    containScroll: 'trimSnaps',
  });
  const thumbsRef = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(0);
  const [snaps, setSnaps] = React.useState<number[]>([]);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;
    const sync = () => {
      setIndex(api.selectedScrollSnap());
      setSnaps(api.scrollSnapList());
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
      thumbsRef.current
        ?.querySelector(`[data-index="${api.selectedScrollSnap()}"]`)
        ?.scrollIntoView({ block: 'nearest', inline: 'center' });
    };
    sync();
    api.on('select', sync).on('reInit', sync);
    return () => {
      api.off('select', sync).off('reInit', sync);
    };
  }, [api]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={cn('relative', className)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') api?.scrollPrev();
        if (e.key === 'ArrowRight') api?.scrollNext();
      }}
    >
      <div ref={ref} className="overflow-hidden">
        <div className="-ml-4 flex touch-pan-y">
          {children.map((child, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${children.length}`}
              className={cn(
                'min-w-0 shrink-0 grow-0 cursor-grab pl-4 active:cursor-grabbing',
                slideClassName,
              )}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        {showDots && snaps.length > 1 ? (
          <div className="flex items-center gap-1.5">
            {snaps.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index || undefined}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  'ease-standard h-1.5 rounded-full transition-[width,background-color] duration-250',
                  i === index
                    ? 'bg-primary-text w-6'
                    : 'bg-primary/50 hover:bg-primary w-1.5',
                  focusRing,
                )}
              />
            ))}
          </div>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous"
            disabled={!canPrev}
            onClick={() => api?.scrollPrev()}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next"
            disabled={!canNext}
            onClick={() => api?.scrollNext()}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
      {thumbnails && thumbnails.length > 1 && (
        <div
          ref={thumbsRef}
          className="mt-4 flex snap-x gap-2 overflow-x-auto overscroll-x-contain pb-1"
        >
          {thumbnails.map((thumb, i) => (
            <button
              key={i}
              type="button"
              data-index={i}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index || undefined}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                'relative size-16 shrink-0 cursor-pointer snap-start overflow-hidden rounded-sm opacity-60 transition-[opacity,box-shadow] duration-150 hover:opacity-100',
                i === index && 'ring-primary opacity-100 ring-2',
                focusRing,
              )}
            >
              {thumb}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
