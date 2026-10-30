import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

import { cardShell, type CardStyle } from './variants';

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  variant = 'solid',
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  variant?: CardStyle;
  className?: string;
}) {
  return (
    <div
      data-spotlight
      className={cn(
        cardShell(variant),
        'gap-2 p-5 active:scale-100',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-caption text-muted-foreground font-sans font-semibold tracking-widest uppercase">
          {label}
        </span>
        {Icon && (
          <span className="bg-primary-soft text-primary-text grid size-9 place-items-center rounded-full">
            <Icon aria-hidden strokeWidth={1.5} className="size-4" />
          </span>
        )}
      </div>
      <span className="font-display text-h2 text-primary-text font-semibold tabular-nums">
        {value}
      </span>
      {hint && (
        <span className="text-small text-muted-foreground font-sans">
          {hint}
        </span>
      )}
    </div>
  );
}
