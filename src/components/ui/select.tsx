import * as React from 'react';
import { cn } from '@/lib/utils/cn';

// Native select styled like Input (matches the checkout district select).
function Select({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      data-slot="select"
      className={cn(
        'select-chevron border-input bg-background dark:bg-muted hover:border-primary focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:shadow-glow aria-invalid:border-destructive h-11 w-full cursor-pointer rounded-md border px-3 font-sans text-base shadow-sm transition-[border-color,box-shadow] duration-150 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  );
}

export { Select };
