import { cn } from '@/lib/utils/cn';

import { GoldHeart } from './section-heading';

// Gold hairline with a small heart; at most one or two per page.
export function Divider({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      className={cn(
        'divider-ornament mx-auto max-w-[1440px] px-4 md:px-8',
        className,
      )}
    >
      <GoldHeart className="size-3" />
    </div>
  );
}
