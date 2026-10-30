import { cn } from '@/lib/utils';

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'text-caption text-primary-text font-sans font-semibold tracking-widest uppercase',
        className,
      )}
    >
      {children}
    </p>
  );
}
