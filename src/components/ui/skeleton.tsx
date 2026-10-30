import * as React from 'react';

import { cn } from '@/lib/utils/cn';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn('bg-primary-soft skeleton-shimmer rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
