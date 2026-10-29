import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

type Props = { message: string; clearHref?: string };

export function EmptyState({ message, clearHref }: Props) {
  return (
    <div className="border-border flex flex-col items-center gap-4 rounded-md border border-dashed px-6 py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
      {clearHref && (
        <Link
          href={clearHref}
          className={buttonVariants({ variant: 'secondary' })}
        >
          Clear filters
        </Link>
      )}
    </div>
  );
}
