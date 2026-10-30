'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Expand } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { Carousel } from '@/components/ui/carousel';
import { Lightbox } from '@/components/ui/lightbox';
import { duration, ease } from '@/config/motion';
import { imageQuality, imageSizes } from '@/config/images';
import { cn } from '@/lib/utils';
import { blurFor } from '@/lib/utils/image';

type GalleryImage = { id: string; imageUrl: string; altText: string | null };

type Props = { images: GalleryImage[]; name: string };

const LENS_SCALE = 2;

export function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [lens, setLens] = useState(false);
  const [canLens, setCanLens] = useState(false);
  const reduce = useReducedMotion();
  const stage = useRef<HTMLButtonElement>(null);
  const frame = useRef(0);
  const thumbs = useRef<HTMLDivElement>(null);
  const current = images[active];

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setCanLens(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    thumbs.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [active]);

  const lensOn = canLens && !reduce;

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!lensOn) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = stage.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--zx', `${((clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--zy', `${((clientY - r.top) / r.height) * 100}%`);
    });
  };

  const lightbox = (
    <Lightbox
      open={zoomed}
      onOpenChange={setZoomed}
      startIndex={active}
      label={name}
      images={images.map((img) => ({
        src: img.imageUrl,
        alt: img.altText ?? name,
      }))}
    />
  );

  return (
    <div className="lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:self-start">
      {/* Mobile: swipe through every image. */}
      <div className="lg:hidden">
        {images.length > 1 ? (
          <Carousel
            label={`${name} images`}
            slideClassName="basis-full"
            onIndexChange={setActive}
            thumbnails={images.map((img) => (
              <Image
                key={img.id}
                src={img.imageUrl}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            ))}
          >
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setZoomed(true)}
                aria-label="Open full-screen image viewer"
                className="bg-muted focus-ring relative block aspect-[4/5] w-full overflow-hidden rounded-md"
              >
                <Image
                  src={img.imageUrl}
                  alt={img.altText ?? name}
                  fill
                  loading={i === 0 ? 'eager' : undefined}
                  quality={imageQuality.hero}
                  sizes={imageSizes.gallery}
                  {...blurFor(img.imageUrl)}
                  className="object-cover"
                />
              </button>
            ))}
          </Carousel>
        ) : (
          current && (
            <div className="bg-muted relative aspect-[4/5] overflow-hidden rounded-md">
              <Image
                src={current.imageUrl}
                alt={current.altText ?? name}
                fill
                loading="eager"
                quality={imageQuality.hero}
                sizes={imageSizes.gallery}
                {...blurFor(current.imageUrl)}
                className="object-cover"
              />
            </div>
          )
        )}
      </div>

      {/* Desktop: vertical thumbnails beside a viewport-high stage with a hover lens. */}
      <div
        className={cn(
          'hidden gap-3 lg:grid',
          images.length > 1 ? 'lg:grid-cols-[5rem_1fr]' : 'lg:grid-cols-1',
        )}
      >
        {images.length > 1 && (
          <div
            ref={thumbs}
            className="max-h-[min(calc(100svh-var(--header-h)-2rem),56rem)] snap-y overflow-y-auto overscroll-contain pr-1"
          >
            <Stagger className="flex flex-col gap-2">
              {images.map((image, i) => (
                <StaggerItem key={image.id}>
                  <button
                    type="button"
                    data-index={i}
                    onClick={() => setActive(i)}
                    onPointerEnter={() => setActive(i)}
                    aria-label={`Show image ${i + 1} of ${images.length}`}
                    aria-pressed={i === active}
                    className={cn(
                      'bg-muted focus-ring ease-standard relative block aspect-[4/5] w-full cursor-pointer snap-start overflow-hidden rounded-sm opacity-60 transition-[opacity,box-shadow] duration-150 hover:opacity-100',
                      i === active && 'ring-primary-text opacity-100 ring-2',
                    )}
                  >
                    <Image
                      src={image.imageUrl}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        )}
        <button
          ref={stage}
          type="button"
          onClick={() => setZoomed(true)}
          onPointerEnter={() => lensOn && setLens(true)}
          onPointerLeave={() => setLens(false)}
          onPointerMove={onPointerMove}
          aria-label="Open full-screen image viewer"
          disabled={!current}
          className="group bg-muted focus-ring relative block h-[min(calc(100svh-var(--header-h)-2rem),56rem)] w-full cursor-zoom-in overflow-hidden rounded-md"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {current && (
              <motion.div
                key={current.id}
                className="absolute inset-0"
                initial={{ opacity: 0, filter: reduce ? 'none' : 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.base, ease: ease.standard }}
              >
                <Image
                  src={current.imageUrl}
                  alt={current.altText ?? name}
                  fill
                  loading={active === 0 ? 'eager' : undefined}
                  fetchPriority={active === 0 ? 'high' : undefined}
                  quality={imageQuality.hero}
                  sizes={imageSizes.gallery}
                  {...blurFor(current.imageUrl)}
                  style={{
                    transformOrigin: 'var(--zx, 50%) var(--zy, 50%)',
                    transform: `scale(${lens ? LENS_SCALE : 1})`,
                  }}
                  className="ease-standard object-contain transition-transform duration-200"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <span
            aria-hidden
            className={cn(
              'glass text-small ease-standard pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans font-medium transition-opacity duration-200',
              lens ? 'opacity-0' : 'opacity-0 group-hover:opacity-100',
            )}
          >
            <Expand className="size-3.5" />
            Click to expand
          </span>
        </button>
      </div>
      {lightbox}
    </div>
  );
}
