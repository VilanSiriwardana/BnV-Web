import * as React from 'react';
import { cn } from '@/lib/utils/cn';

// Native select styled like Input (matches the checkout district select).
function Select({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      data-slot="select"
      className={cn(
        'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive h-11 w-full rounded-md border px-3 font-sans text-base outline-none focus-visible:ring-[3px] md:text-sm',
        className,
      )}
      {...props}
    />
  );
}

export { Select };
