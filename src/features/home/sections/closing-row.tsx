import Link from 'next/link';

import { CtaArrow } from '@/components/marketing/cta-arrow';

import {
  GoldHeart,
  SectionHeading,
} from '@/components/marketing/section-heading';
import { Reveal } from '@/components/motion/reveal';
import { buttonVariants } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { testimonials } from '@/data/testimonials';
import { NewsletterForm } from '@/features/newsletter/newsletter-form';
import { cn } from '@/lib/utils';

const card =
  'bg-card text-card-foreground border-border h-full rounded-md border p-6 shadow-sm md:p-8';

// Final shop CTA · testimonial (real only, D-23) · newsletter.
export function ClosingRow() {
  const quote = testimonials[0];

  return (
    <section
      aria-label="Shop and stay in touch"
      className="section-y mx-auto grid max-w-[1440px] gap-4 px-4 md:grid-cols-3 md:px-8"
    >
      <Reveal className={cn(!quote && 'md:col-span-2')}>
        <div className={card}>
          <h2 className="font-display text-h3 font-semibold">
            Found something you love?
            <GoldHeart />
          </h2>
          <p className="text-small text-muted-foreground mt-3 font-sans">
            Order online and we confirm every order personally over WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={routes.newIn}
              className={buttonVariants({ size: 'lg', className: 'group' })}
            >
              Shop New In
              <CtaArrow />
            </Link>
            <Link
              href={routes.gifts}
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              Find a Gift
            </Link>
          </div>
          <Link
            href={routes.contact}
            className="text-caption text-primary-text group mt-4 inline-flex min-h-11 items-center gap-1 font-sans font-semibold tracking-widest uppercase"
          >
            Contact us <CtaArrow />
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
