import Link from 'next/link';

import { ArtDirectedImage } from '@/components/marketing/art-directed-image';
import {
  GoldHeart,
  SectionHeading,
} from '@/components/marketing/section-heading';
import { Reveal } from '@/components/motion/reveal';
import { story } from '@/data/home';
import { testimonials } from '@/data/testimonials';
import { NewsletterForm } from '@/features/newsletter/newsletter-form';
import { cn } from '@/lib/utils';

const card =
  'bg-card text-card-foreground border-border h-full rounded-md border p-6 shadow-sm md:p-8';

// Our Story polaroid · testimonial (real only, D-23) · newsletter, as in the Home mockup.
export function ClosingRow() {
  const quote = testimonials[0];

  return (
    <section
      aria-label="Our story and staying in touch"
      className="mx-auto grid max-w-[1440px] gap-4 px-4 py-12 md:grid-cols-3 md:px-8 md:py-16"
    >
      <Reveal className={cn(!quote && 'md:col-span-2')}>
        <div className={cn(card, 'grid items-center gap-6 sm:grid-cols-2')}>
          <div>
            <h2 className="font-display text-h3 font-semibold">
              Our Story
              <GoldHeart />
            </h2>
            <p className="text-muted-foreground mt-3 line-clamp-5">
              {story.body}
            </p>
            <Link
              href={story.cta.href}
              className="text-caption text-primary-text mt-4 inline-flex min-h-11 items-center gap-1 font-sans font-semibold tracking-widest uppercase"
            >
              {story.cta.label} <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="mx-auto w-full max-w-60 -rotate-2 rounded-sm bg-white p-2 pb-8 shadow-md">
            <ArtDirectedImage
              image={story.image}
              className="aspect-square md:aspect-square"
            />
          </div>
        </div>
      </Reveal>
      {quote && (
        <Reveal delay={0.08}>
          <figure
            className={cn(card, 'flex flex-col justify-center text-center')}
          >
            <blockquote className="font-body text-h3 leading-normal break-words italic md:line-clamp-6">
              “{quote.quote}”
            </blockquote>
            <figcaption className="text-small text-muted-foreground mt-4 font-sans break-words">
              {quote.name}
              {quote.context && ` · ${quote.context}`}
            </figcaption>
          </figure>
        </Reveal>
      )}
      <Reveal delay={0.16}>
        <div className={cn(card, 'flex flex-col justify-center')}>
          <SectionHeading
            id="stay-close-title"
            title="Stay close to what matters"
            heart
            align="center"
            description="New pieces, gift ideas and the occasional offer. No spam, ever."
          />
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
