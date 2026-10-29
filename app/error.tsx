'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { routes } from '@/config/routes';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="font-display text-h1 font-semibold">
        Something went wrong
      </h1>
      <p className="text-muted-foreground">
        We couldn&apos;t load this page. Please try again in a moment.
      </p>
      <div className="flex gap-3">
        <Button size="lg" onClick={() => unstable_retry()}>
          Try again
        </Button>
        <Link
          href={routes.home}
          className={buttonVariants({ size: 'lg', variant: 'secondary' })}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
