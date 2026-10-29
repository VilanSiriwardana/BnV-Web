import { NewsletterForm } from '@/features/newsletter/newsletter-form';

export function NewsletterSection() {
  return (
    <section aria-labelledby="newsletter-title" className="bg-surface">
      <div className="mx-auto max-w-[1440px] px-4 py-12 text-center md:px-8 md:py-16">
        <p className="text-caption text-primary-text font-semibold tracking-widest uppercase">
          Stay close
        </p>
        <h2
          id="newsletter-title"
          className="font-display text-h2 mt-2 font-semibold"
        >
          First to know about new drops
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 mb-8 max-w-xl">
          New pieces, gift ideas and the occasional offer. No spam, ever.
        </p>
        <NewsletterForm />
      </div>
    </section>
  );
}
