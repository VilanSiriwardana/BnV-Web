import Link from 'next/link';

import { cn } from '@/lib/utils';

import { Eyebrow } from './eyebrow';

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { label: string; href: string };
  className?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  link,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 id={id} className="font-display text-h2 mt-2 font-semibold">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="text-small text-primary-text inline-flex min-h-11 shrink-0 items-center font-sans font-semibold underline underline-offset-4"
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}
