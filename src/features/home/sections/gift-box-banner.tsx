import { Gift, HeartHandshake, PenLine } from 'lucide-react';
import Link from 'next/link';

import { ArtDirectedImage } from '@/components/marketing/art-directed-image';
import { Eyebrow } from '@/components/marketing/eyebrow';
import { IconRow } from '@/components/marketing/icon-row';
import { HeadingAccent } from '@/components/marketing/section-heading';
import { ClipReveal } from '@/components/motion/clip-reveal';
import { buttonVariants } from '@/components/ui/button';
import { giftBanner } from '@/data/home';

const featureIcons = [HeartHandshake, Gift, PenLine];

export function GiftBoxBanner() {
  const features = giftBanner.features.map((title, i) => ({
    icon: featureIcons[i],
    title,
  }));

  return (
    <section
      aria-labelledby="gift-box-title"
      className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16"
    >
      <ClipReveal>
        <div className="bg-primary/20 dark:bg-surface-elevated grid overflow-hidden rounded-lg md:grid-cols-[2fr_3fr]">
          <div className="flex flex-col justify-center px-6 py-10 md:px-10 md:py-14">
            <Eyebrow heart>{giftBanner.eyebrow}</Eyebrow>
            <h2
              id="gift-box-title"
              className="font-display text-h1 mt-4 font-semibold"
            >
              {giftBanner.title}{' '}
              <HeadingAccent>{giftBanner.accent}</HeadingAccent>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md">
              {giftBanner.description}
            </p>
            <Link
              href={giftBanner.cta.href}
              className={buttonVariants({
                size: 'lg',
                className: 'mt-8 self-start',
              })}
            >
              {giftBanner.cta.label}
            </Link>
            <IconRow items={features} layout="inline" className="mt-8" />
          </div>
          <div className="relative min-h-64 md:min-h-full">
            <ArtDirectedImage
              image={giftBanner.image}
              className="absolute inset-0 aspect-auto h-full md:aspect-auto"
            />
          </div>
        </div>
      </ClipReveal>
    </section>
  );
}
