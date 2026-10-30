import { GoldHeart } from '@/components/marketing/section-heading';
import { cn } from '@/lib/utils/cn';

import { cardShell, type CardStyle } from './variants';

export function TestimonialCard({
  quote,
  name,
  detail,
  variant = 'solid',
  className,
}: {
  quote: string;
  name: string;
  detail?: string;
  variant?: CardStyle;
  className?: string;
}) {
  return (
    <figure
      data-spotlight
      className={cn(
        cardShell(variant),
        'gap-4 p-6 active:scale-100',
        className,
      )}
    >
      <span
        aria-hidden
        className="font-display text-primary text-h1 leading-none"
      >
        “
      </span>
      <blockquote className="text-body-lg -mt-6 italic">{quote}</blockquote>
      <figcaption className="mt-auto flex items-center gap-2 font-sans text-sm">
        <GoldHeart className="size-3" />
        <span className="font-semibold">{name}</span>
        {detail && <span className="text-muted-foreground">· {detail}</span>}
      </figcaption>
    </figure>
  );
}
