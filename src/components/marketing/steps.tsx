import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export type Step = { icon: LucideIcon; title: string; text: string };

export function Steps({
  steps,
  className,
}: {
  steps: readonly Step[];
  className?: string;
}) {
  return (
    <ol
      className={cn(
        'grid gap-8 md:auto-cols-fr md:grid-flow-col md:gap-4',
        className,
      )}
    >
      {steps.map(({ icon: Icon, title, text }, i) => (
        <li
          key={title}
          className="relative flex gap-4 md:flex-col md:items-center md:text-center"
        >
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="border-border absolute top-6 left-[calc(50%+2.5rem)] hidden w-[calc(100%-5rem+1rem)] border-t border-dashed md:block"
            />
          )}
          <span className="relative shrink-0">
            <span className="bg-primary/20 text-icon grid size-12 place-items-center rounded-full">
              <Icon aria-hidden strokeWidth={1.5} className="size-5" />
            </span>
            <span className="bg-gold text-gold-foreground text-caption absolute -top-1 -right-1 grid size-6 place-items-center rounded-full font-sans font-semibold">
              {i + 1}
            </span>
          </span>
          <span>
            <span className="font-display text-h4 block font-semibold">
              {title}
            </span>
            <span className="text-muted-foreground mt-1 block">{text}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
