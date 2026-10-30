import { Heart } from 'lucide-react';

import { cn } from '@/lib/utils';

export function Eyebrow({
  children,
  heart,
  className,
}: {
  children: React.ReactNode;
  heart?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'text-caption text-primary-text inline-flex items-center gap-2 font-sans font-semibold tracking-widest uppercase',
        className,
      )}
    >
      {children}
      {heart && <Heart aria-hidden className="fill-gold text-gold size-3" />}
    </p>
  );
}
