import Link from 'next/link';

import { ArtDirectedImage } from '@/components/marketing/art-directed-image';
import { Eyebrow } from '@/components/marketing/eyebrow';
import { Reveal } from '@/components/motion/reveal';
import { buttonVariants } from '@/components/ui/button';
import { story } from '@/data/home';
import { cn } from '@/lib/utils';

export function BrandStory() {
  return (
    <section
      aria-labelledby="brand-story-title"
      className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-16 md:grid-cols-12 md:gap-12 md:px-8 md:py-24"
    >
      <Reveal className="md:col-span-7">
        <ArtDirectedImage
          image={story.image}
          className="aspect-[4/5] rounded-lg md:aspect-[5/4]"
        />
      </Reveal>
      <Reveal delay={0.1} className="md:col-span-5">
        <Eyebrow>{story.eyebrow}</Eyebrow>
        <h2
          id="brand-story-title"
          className="font-display text-h1 mt-4 font-semibold text-balance"
        >
          {story.title}
        </h2>
        <p className="text-body-lg text-muted-foreground mt-6 max-w-prose">
          {story.body}
        </p>
        <Link
          href={story.cta.href}
          className={cn(
            buttonVariants({ variant: 'secondary', size: 'lg' }),
            'mt-8',
          )}
        >
          {story.cta.label}
        </Link>
      </Reveal>
    </section>
  );
}
