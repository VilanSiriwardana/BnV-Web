import Link from 'next/link';

import { Reveal } from '@/components/motion/reveal';
import { buttonVariants } from '@/components/ui/button';
import type { ArtDirectedImage as ArtDirectedImageData } from '@/data/home';
import { cn } from '@/lib/utils';

import { ArtDirectedImage } from './art-directed-image';

type Cta = { label: string; href: string };

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: Cta;
  secondary?: Cta;
  image: ArtDirectedImageData;
  tone?: 'surface' | 'muted' | 'background';
};

export function TeaserBand({
  id,
  eyebrow,
  title,
  description,
  cta,
  secondary,
  image,
  tone = 'background',
}: Props) {
  return (
    <section
      aria-labelledby={id}
      className={cn(
        tone === 'surface' && 'bg-surface',
        tone === 'muted' && 'bg-muted',
      )}
    >
      <ArtDirectedImage image={image} />
      <Reveal className="mx-auto max-w-[1440px] px-4 py-10 text-center md:px-8 md:py-14">
        <p className="text-caption text-primary-text font-semibold tracking-widest uppercase">
          {eyebrow}
        </p>
        <h2 id={id} className="font-display text-h2 mt-2 font-semibold">
          {title}
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
          {description}
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={cta.href} className={buttonVariants()}>
            {cta.label}
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className={buttonVariants({ variant: 'link' })}
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </Reveal>
    </section>
  );
}
