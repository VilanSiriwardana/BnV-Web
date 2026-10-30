import { icons } from '@/config/icons';
import { cn } from '@/lib/utils/cn';

// Trailing arrow for text CTAs; nudges right when the link (a `group`) is hovered.
export function CtaArrow({ className }: { className?: string }) {
  const Arrow = icons.arrow;
  return (
    <Arrow
      aria-hidden
      strokeWidth={1.5}
      className={cn(
        'ease-standard size-4 shrink-0 transition-transform duration-150 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none',
        className,
      )}
    />
  );
}
