import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';
import { testimonials } from '@/data/testimonials';

// Rendered only when real, permissioned testimonials exist (D-23). No ratings or review markup.
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section
      aria-labelledby="memories-title"
      className="section-y mx-auto max-w-[1440px] px-4 md:px-8"
    >
      <Reveal>
        <SectionHeading
          id="memories-title"
          eyebrow="Memories"
          title="Moments shared with us"
        />
      </Reveal>
      <Stagger className="mt-8 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <StaggerItem key={`${t.name}-${i}`}>
            <figure className="bg-card rounded-md p-6 shadow-sm">
              <blockquote className="font-body text-h3 leading-normal break-words italic md:line-clamp-6">
                “{t.quote}”
              </blockquote>
              <figcaption className="text-small text-muted-foreground mt-4 font-sans break-words">
                {t.name}
                {t.context && ` · ${t.context}`}
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
