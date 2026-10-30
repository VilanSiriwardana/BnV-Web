import { Reveal } from '@/components/motion/reveal';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

import { comingSoon } from '@/data/home';

export function ComingSoonStrip() {
  return (
    <section aria-label="Coming soon" className="px-4 md:px-8">
      <Reveal className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-3 py-2 font-sans text-sm">
        <span className="text-caption text-muted-foreground font-semibold tracking-widest uppercase">
          Coming soon
        </span>
        {comingSoon.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="focus-ring border-primary/40 bg-primary-soft text-primary-text hover:border-primary hover:shadow-glow inline-flex min-h-11 items-center gap-2 rounded-full border px-4 font-semibold transition-[border-color,box-shadow] duration-150"
          >
            <Sparkles aria-hidden strokeWidth={1.5} className="size-4" />
            {item.label}
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
