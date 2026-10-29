import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import type { ArtDirectedImage as ArtDirectedImageData } from '@/data/home';

import { ArtDirectedImage } from './art-directed-image';

type Cta = { label: string; href: string };

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  image: ArtDirectedImageData;
  priority?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  image,
  priority,
}: Props) {
  return (
    <section aria-labelledby="page-hero-title">
      <ArtDirectedImage image={image} priority={priority} />
      <div className="mx-auto max-w-[1440px] px-4 py-10 text-center md:px-8 md:py-14">
        {eyebrow && (
          <p className="text-caption text-primary-text font-semibold tracking-widest uppercase">
            {eyebrow}
          </p>
        )}
        <h1
          id="page-hero-title"
          className="font-display text-h1 md:text-display mx-auto mt-3 max-w-3xl font-semibold"
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-body-lg text-muted-foreground mx-auto mt-4 max-w-2xl">
            {subtitle}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
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
