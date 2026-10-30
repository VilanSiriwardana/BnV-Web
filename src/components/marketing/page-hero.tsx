import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import type { ArtDirectedImage as ArtDirectedImageData } from '@/data/home';
import { cn } from '@/lib/utils';

import { ArtDirectedImage } from './art-directed-image';
import { Eyebrow } from './eyebrow';

type Cta = { label: string; href: string };

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  image: ArtDirectedImageData;
  eager?: boolean;
};

// Cinematic hero: copy over the image. Motion is CSS so the h1 paints immediately (LCP).
export function PageHero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  image,
  eager,
}: Props) {
  return (
    <section
      aria-labelledby="page-hero-title"
      className="relative isolate flex min-h-[calc(100svh-6rem)] items-end overflow-hidden md:min-h-[85vh]"
    >
      <div className="animate-hero-zoom absolute inset-0 -z-10">
        <ArtDirectedImage
          image={image}
          eager={eager}
          className="aspect-auto h-full md:aspect-auto"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/35 to-black/5"
      />
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-24 pb-12 text-white md:px-8 md:pb-20">
        {eyebrow && (
          <Eyebrow className="animate-word-rise text-white/85">
            {eyebrow}
          </Eyebrow>
        )}
        <h1
          id="page-hero-title"
          aria-label={title}
          className="font-display text-display mt-4 max-w-4xl font-semibold text-balance break-words"
        >
          {title.split(' ').map((word, i) => (
            <span key={`${word}-${i}`} aria-hidden>
              <span
                className="animate-word-rise inline-block"
                style={{ animationDelay: `${80 + Math.min(i, 6) * 40}ms` }}
              >
                {word}
              </span>{' '}
            </span>
          ))}
        </h1>
        {subtitle && (
          <p
            className="text-body-lg animate-word-rise mt-5 max-w-xl text-white/90"
            style={{ animationDelay: '360ms' }}
          >
            {subtitle}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div
            className="animate-word-rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
            style={{ animationDelay: '440ms' }}
          >
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className={buttonVariants({ size: 'lg' })}
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={cn(
                  buttonVariants({ variant: 'link', size: 'lg' }),
                  'px-0 text-white focus-visible:ring-white',
                )}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
