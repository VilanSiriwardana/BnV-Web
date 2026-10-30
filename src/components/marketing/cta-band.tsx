import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

import { SectionHeading } from './section-heading';

type Cta = { label: string; href: string };

export function CtaBand({
  id,
  title,
  accent,
  description,
  primary,
  secondary,
}: {
  id: string;
  title: string;
  accent?: string;
  description?: string;
  primary: Cta;
  secondary?: Cta;
}) {
  return (
    <section
      aria-labelledby={id}
      className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16"
    >
      <div className="bg-gradient-brand border-primary/40 rounded-lg border px-6 py-12 shadow-md md:py-16">
        <SectionHeading
          id={id}
          title={title}
          accent={accent}
          description={description}
          heart
          align="center"
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={primary.href} className={buttonVariants({ size: 'lg' })}>
            {primary.label}
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className={buttonVariants({ variant: 'secondary', size: 'lg' })}
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
