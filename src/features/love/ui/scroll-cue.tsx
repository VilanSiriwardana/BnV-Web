import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

// Blueprint 060: one quiet "keep scrolling" pill (hero, gallery door). The wheel dot drifts
// down under [data-love-motion]; Calm shows it still.
export function ScrollCue({
  label,
  className,
  ...rest
}: { label: string } & HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...rest}
      className={cn(
        'glass border-gold/40 text-foreground/90 text-small flex items-center gap-2.5 rounded-full border py-2 pr-4 pl-3 font-sans tracking-wide shadow-[0_0_28px_-12px_var(--gold)]',
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 14 22"
        className="text-gold h-5 w-3.5 shrink-0"
        fill="none"
      >
        <rect
          x="1"
          y="1"
          width="12"
          height="20"
          rx="6"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle
          className="love-scroll-dot"
          cx="7"
          cy="6.5"
          r="1.6"
          fill="currentColor"
        />
      </svg>
      {label}
    </p>
  );
}
