import Link from 'next/link';

import { CtaArrow } from '@/components/marketing/cta-arrow';

import { Parallax } from '@/components/motion/parallax';
import { ArtDirectedImage } from '@/components/marketing/art-directed-image';
import { Eyebrow } from '@/components/marketing/eyebrow';
import { HeadingAccent } from '@/components/marketing/section-heading';
import { Reveal } from '@/components/motion/reveal';
import { buttonVariants } from '@/components/ui/button';
import { story } from '@/data/home';
import { cn } from '@/lib/utils';

export function BrandStory() {
  return (
    <section
      aria-labelledby="brand-story-title"
      className="section-y mx-auto grid max-w-[1440px] items-center gap-10 px-4 md:grid-cols-12 md:gap-12 md:px-8"
    >
      <Reveal className="md:col-span-7">
        <Parallax className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-md md:aspect-[5/4]">
          <ArtDirectedImage
            image={story.image}
            className="aspect-auto h-full md:aspect-auto"
          />
        </Parallax>
      </Reveal>
      <Reveal delay={0.1} className="md:col-span-5">
        <Eyebrow heart>{story.eyebrow}</Eyebrow>
        <h2
          id="brand-story-title"
          className="font-display text-h1 mt-4 font-semibold text-balance"
        >
          {story.title}
          <HeadingAccent block>{story.accent}</HeadingAccent>
        </h2>
        <p className="text-body-lg text-muted-foreground mt-6 max-w-prose">
          {story.body}
        </p>
        <Link
          href={story.cta.href}
          className={cn(
            buttonVariants({ variant: 'secondary', size: 'lg' }),
            'group mt-8',
          )}
        >
          {story.cta.label}
          <CtaArrow />
        </Link>
      </Reveal>
    </section>
  );
}
