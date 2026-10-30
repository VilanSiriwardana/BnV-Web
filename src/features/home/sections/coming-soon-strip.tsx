import Link from 'next/link';

import { comingSoon } from '@/data/home';

export function ComingSoonStrip() {
  return (
    <section aria-label="Coming soon" className="border-border border-y">
      <p className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-4 text-center font-sans text-sm md:px-8">
        <span className="text-muted-foreground">Coming soon</span>
        {comingSoon.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="hover:text-primary-text inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline"
          >
            {item.label}
          </Link>
        ))}
      </p>
    </section>
  );
}
