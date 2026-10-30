import { cardVariants } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

export type CardStyle = 'solid' | 'glass' | 'gradient-border';

// Shared shell for the card family: lift, glow, spotlight and the focus ring.
export function cardShell(variant: CardStyle = 'solid', className?: string) {
  return cn(
    cardVariants({
      variant: variant === 'glass' ? 'glass' : 'interactive',
    }),
    variant === 'glass' &&
      'ease-standard transition-[transform,box-shadow] duration-250 hover:-translate-y-0.5 hover:shadow-glow motion-reduce:hover:translate-y-0',
    variant === 'gradient-border' && 'border-gradient-hover',
    'group spotlight focus-ring gap-0 py-0 active:scale-[0.98]',
    className,
  );
}
