import Link from 'next/link';

import { cn } from '@/lib/utils';

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
        {eyebrow && (
          <p className="text-caption text-primary-text font-semibold tracking-widest uppercase">
            {eyebrow}
          </p>
        )}
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
          className="text-small text-primary-text font-semibold underline-offset-4 hover:underline"
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}
