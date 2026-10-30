import { Gift, HeartHandshake, PenLine } from 'lucide-react';
import Link from 'next/link';

import { CtaArrow } from '@/components/marketing/cta-arrow';

import { Parallax } from '@/components/motion/parallax';
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
      className="section-y mx-auto max-w-[1440px] px-4 md:px-8"
    >
      <ClipReveal>
        <div className="bg-primary/20 dark:bg-surface-elevated grid overflow-hidden rounded-lg md:grid-cols-[2fr_3fr]">
          <div className="flex flex-col justify-center px-6 py-10 md:px-10 md:py-14">
            <Eyebrow>{giftBanner.eyebrow}</Eyebrow>
            <h2
              id="gift-box-title"
              className="font-display text-h2 mt-4 font-semibold"
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
                className: 'group mt-8 self-start',
              })}
            >
              <Gift aria-hidden strokeWidth={1.5} />
              {giftBanner.cta.label}
              <CtaArrow />
            </Link>
            <IconRow items={features} layout="inline" className="mt-8" />
          </div>
          <Parallax className="relative min-h-64 overflow-hidden md:min-h-full">
            <ArtDirectedImage
              image={giftBanner.image}
              className="absolute inset-0 aspect-auto h-full md:aspect-auto"
            />
          </Parallax>
        </div>
      </ClipReveal>
    </section>
  );
}
