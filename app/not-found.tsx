import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { routes } from '@/config/routes';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="font-display text-h1 font-semibold">Page not found</h1>
      <p className="text-muted-foreground">
        This page may have moved or the piece is no longer available.
      </p>
      <Link href={routes.shop} className={buttonVariants({ size: 'lg' })}>
        Continue shopping
      </Link>
    </div>
  );
}
