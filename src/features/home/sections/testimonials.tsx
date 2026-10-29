import { SectionHeading } from '@/components/marketing/section-heading';
import { testimonials } from '@/data/testimonials';

// Rendered only when real, permissioned testimonials exist (D-23). No ratings or review markup.
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section
      aria-labelledby="memories-title"
      className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16"
    >
      <SectionHeading
        id="memories-title"
        eyebrow="Memories"
        title="Moments shared with us"
      />
      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <li key={t.name}>
            <figure className="bg-card rounded-md p-6 shadow-sm">
              <blockquote className="font-display text-h4">
                “{t.quote}”
              </blockquote>
              <figcaption className="text-small text-muted-foreground mt-4">
                {t.name}
                {t.context && ` · ${t.context}`}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
