import Link from 'next/link';

import {
  GoldHeart,
  SectionHeading,
} from '@/components/marketing/section-heading';
import { Reveal } from '@/components/motion/reveal';
import { routes } from '@/config/routes';
import { trust } from '@/data/home';
import { testimonials } from '@/data/testimonials';
import { NewsletterForm } from '@/features/newsletter/newsletter-form';
import { cn } from '@/lib/utils';

const card =
  'bg-card text-card-foreground border-border h-full rounded-md border p-6 shadow-sm md:p-8';

// How ordering works · testimonial (real only, D-23) · newsletter.
export function ClosingRow() {
  const quote = testimonials[0];

  return (
    <section
      aria-label="How ordering works and staying in touch"
      className="mx-auto grid max-w-[1440px] gap-4 px-4 py-12 md:grid-cols-3 md:px-8 md:py-16"
    >
      <Reveal className={cn(!quote && 'md:col-span-2')}>
        <div className={card}>
          <h2 className="font-display text-h3 font-semibold">
            How ordering works
            <GoldHeart />
          </h2>
          <ol className="mt-5 flex flex-col gap-4 font-sans">
            {trust.map(({ title, text }, i) => (
              <li key={title} className="flex items-start gap-3">
                <span className="bg-primary-soft text-gold-text grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums">
                  {i + 1}
                </span>
                <span>
                  <span className="text-small block font-semibold">
                    {title}
                  </span>
                  <span className="text-small text-muted-foreground">
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <Link
            href={routes.contact}
            className="text-caption text-primary-text mt-4 inline-flex min-h-11 items-center gap-1 font-sans font-semibold tracking-widest uppercase"
          >
            Contact us <span aria-hidden>→</span>
          </Link>
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
