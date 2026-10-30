import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'font-sans inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-xs border border-transparent px-1.5 py-px text-micro font-semibold tracking-wide whitespace-nowrap focus-visible:ring-[3px] focus-visible:ring-ring [&>svg]:pointer-events-none [&>svg]:size-2.5',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        rose: 'bg-secondary text-secondary-foreground',
        gold: 'bg-gold text-gold-foreground',
        outline: 'border-border text-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        danger: 'bg-destructive-soft text-destructive-text',
        success: 'bg-success-soft text-success-text',
        warning: 'bg-warning-soft text-warning-text',
        info: 'bg-info-soft text-info-text',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
