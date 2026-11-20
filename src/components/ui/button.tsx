import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2Icon } from 'lucide-react';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils/cn';

const lift =
  'hover:-translate-y-px active:translate-y-0 motion-reduce:hover:translate-y-0';
const luxury = 'bg-gold text-gold-foreground shadow-sm hover:bg-gold/90';

const buttonVariants = cva(
  "font-sans relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-semibold whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-standard active:scale-[0.98] focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: cn(
          'bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-glow shimmer spotlight',
          lift,
        ),
        secondary: cn(
          'border border-input bg-transparent text-foreground hover:border-primary hover:bg-primary-soft hover:text-primary-text',
          lift,
        ),
        outline: cn(
          'border border-border bg-background hover:border-primary hover:bg-primary-soft hover:text-primary-text',
          lift,
        ),
        ghost: 'hover:bg-primary-soft hover:text-primary-text',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        link: 'text-primary-text underline-offset-4 hover:underline',
        luxury: cn(luxury, lift),
        gold: cn(luxury, lift),
        whatsapp: cn(
          'bg-success text-success-foreground hover:bg-success/90',
          lift,
        ),
        gradient: cn(
          'bg-gradient-brand text-primary-foreground shadow-sm hover:shadow-glow shimmer spotlight',
          lift,
        ),
        soft: 'bg-primary-soft text-primary-text hover:bg-primary/40',
        // Love Site (Romance Additions §9.6): premium night buttons.
        'love-primary':
          'border-gold/60 bg-background text-gold-text hover:border-gold font-display border tracking-[0.18em] uppercase hover:shadow-[0_0_6px_color-mix(in_oklab,var(--gold)_35%,transparent)] max-sm:w-full',
        'love-ghost':
          'border-primary/40 text-primary-text hover:border-primary border bg-transparent',
        'love-link':
          'text-gold-text decoration-gold/60 font-medium underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 py-2 has-[>svg]:px-4',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-12 px-7 text-base has-[>svg]:px-5',
        icon: 'size-10',
        'icon-sm': 'size-8',
        inline: 'h-auto gap-1.5 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const spotlightVariants = new Set(['default', 'gradient']);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-spotlight={spotlightVariants.has(variant ?? '') || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading && <Loader2Icon className="animate-spin" aria-hidden />}
          {children}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
