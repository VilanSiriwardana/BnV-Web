import { Heart } from 'lucide-react';
import Link from 'next/link';

import { CtaArrow } from '@/components/marketing/cta-arrow';

import { cn } from '@/lib/utils';

import { Eyebrow } from './eyebrow';

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  accent?: string;
  heart?: boolean;
  align?: 'start' | 'center';
  description?: string;
  link?: { label: string; href: string };
  className?: string;
};

// Lavender Cormorant italic phrase that follows a Cinzel heading (PageImages mockups).
export function HeadingAccent({
  children,
  block,
}: {
  children: React.ReactNode;
  block?: boolean;
}) {
  return (
    <em
      className={cn(
        'font-body text-primary-text font-medium tracking-normal normal-case italic',
        block && 'block',
      )}
    >
      {children}
    </em>
  );
}

export function GoldHeart({ className }: { className?: string }) {
  return (
    <Heart
      aria-hidden
      className={cn(
        'fill-gold text-gold ml-2 inline-block size-4 align-middle',
        className,
      )}
    />
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  accent,
  heart,
  align = 'start',
  description,
  link,
  className,
}: Props) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        centered
          ? 'items-center text-center'
          : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', centered && 'mx-auto')}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 id={id} className="font-display text-h2 mt-2 font-semibold">
          {title}
          {accent && (
            <>
              {' '}
              <HeadingAccent>{accent}</HeadingAccent>
            </>
          )}
          {heart && <GoldHeart />}
        </h2>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="text-small text-primary-text group inline-flex min-h-11 shrink-0 items-center gap-1.5 font-sans font-semibold underline underline-offset-4"
        >
          {link.label}
          <CtaArrow />
        </Link>
      )}
    </div>
  );
}
