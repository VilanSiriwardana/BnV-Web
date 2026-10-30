import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import type { ArtDirectedImage as ArtDirectedImageData } from '@/data/home';
import { cn } from '@/lib/utils';

import { ArtDirectedImage } from './art-directed-image';
import { Eyebrow } from './eyebrow';
import { HeadingAccent } from './section-heading';

type Cta = { label: string; href: string };

type Props = {
  eyebrow?: string;
  title: string;
  accent?: string;
  subtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  image: ArtDirectedImageData;
  eager?: boolean;
  variant?: 'split' | 'cinematic';
};

// Motion is CSS so the h1 paints immediately (LCP); reduced motion falls back to fades in globals.css.
function HeroTitle({
  title,
  accent,
  className,
}: {
  title: string;
  accent?: string;
  className?: string;
}) {
  const words = title.split(' ');
  return (
    <h1
      id="page-hero-title"
      aria-label={accent ? `${title} ${accent}` : title}
      className={cn(
        'font-display text-display mt-4 font-semibold text-balance break-words',
        className,
      )}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden>
          <span
            className="animate-word-rise inline-block"
            style={{ animationDelay: `${80 + Math.min(i, 6) * 40}ms` }}
          >
            {word}
          </span>{' '}
        </span>
      ))}
      {accent && (
        <span
          aria-hidden
          className="animate-word-rise block"
          style={{ animationDelay: `${80 + Math.min(words.length, 7) * 40}ms` }}
        >
          <HeadingAccent>{accent}</HeadingAccent>
        </span>
      )}
    </h1>
  );
}

export function PageHero({
  eyebrow,
  title,
  accent,
  subtitle,
  primaryCta,
  secondaryCta,
  image,
  eager,
  variant = 'split',
}: Props) {
  const cinematic = variant === 'cinematic';

  const ctas = (primaryCta || secondaryCta) && (
    <div
      className="animate-word-rise mt-8 flex flex-wrap items-center gap-3"
      style={{ animationDelay: '440ms' }}
    >
      {primaryCta && (
        <Link href={primaryCta.href} className={buttonVariants({ size: 'lg' })}>
          {primaryCta.label}
        </Link>
      )}
      {secondaryCta && (
        <Link
          href={secondaryCta.href}
          className={
            cinematic
              ? cn(
                  buttonVariants({ variant: 'link', size: 'lg' }),
                  'px-0 text-white focus-visible:ring-white',
                )
              : buttonVariants({ variant: 'secondary', size: 'lg' })
          }
        >
          {secondaryCta.label}
        </Link>
      )}
    </div>
  );

  if (cinematic) {
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
            <Eyebrow heart className="animate-word-rise text-white/85">
              {eyebrow}
            </Eyebrow>
          )}
          <HeroTitle title={title} accent={accent} className="max-w-4xl" />
          {subtitle && (
            <p
              className="text-body-lg animate-word-rise mt-5 max-w-xl text-white/90"
              style={{ animationDelay: '360ms' }}
            >
              {subtitle}
            </p>
          )}
          {ctas}
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="page-hero-title"
      className="bg-surface/40 dark:bg-surface relative overflow-hidden"
    >
      <div className="mx-auto grid max-w-[1440px] items-center md:min-h-[min(80vh,720px)] md:grid-cols-2">
        <div className="relative order-first h-72 overflow-hidden sm:h-96 md:order-last md:h-full">
          <div className="animate-hero-zoom absolute inset-0 md:[mask-image:linear-gradient(to_right,transparent,black_25%)]">
            <ArtDirectedImage
              image={image}
              eager={eager}
              className="aspect-auto h-full md:aspect-auto"
            />
          </div>
        </div>
        <div className="px-4 py-12 md:py-16 md:pr-6 md:pl-8 lg:pl-16">
          {eyebrow && (
            <Eyebrow heart className="animate-word-rise">
              {eyebrow}
            </Eyebrow>
          )}
          <HeroTitle title={title} accent={accent} className="max-w-xl" />
          {subtitle && (
            <p
              className="text-body-lg text-muted-foreground animate-word-rise mt-5 max-w-lg"
              style={{ animationDelay: '360ms' }}
            >
              {subtitle}
            </p>
          )}
          {ctas}
        </div>
      </div>
    </section>
  );
}
