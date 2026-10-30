import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export type IconRowItem = { icon: LucideIcon; title: string; text?: string };

export function IconRow({
  items,
  layout = 'stacked',
  className,
}: {
  items: readonly IconRowItem[];
  layout?: 'inline' | 'stacked';
  className?: string;
}) {
  const inline = layout === 'inline';

  return (
    <ul
      className={cn(
        'font-sans',
        inline
          ? 'flex flex-wrap gap-x-6 gap-y-3'
          : 'grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]',
        className,
      )}
    >
      {items.map(({ icon: Icon, title, text }) => (
        <li
          key={title}
          className={cn(
            'flex gap-3',
            inline ? 'items-center' : 'flex-col items-center text-center',
          )}
        >
          <span
            className={cn(
              'bg-primary/20 text-primary-text grid shrink-0 place-items-center rounded-full',
              inline ? 'size-9' : 'size-12',
            )}
          >
            <Icon
              aria-hidden
              strokeWidth={1.5}
              className={inline ? 'size-4' : 'size-5'}
            />
          </span>
          <span>
            <span className="text-small block font-semibold">{title}</span>
            {text && (
              <span className="text-small text-muted-foreground mt-0.5 block">
                {text}
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
