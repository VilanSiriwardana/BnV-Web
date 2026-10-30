'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { CtaArrow } from '@/components/marketing/cta-arrow';
import { useId, useRef, useState } from 'react';

import {
  ProductCard,
  type ProductCardData,
} from '@/components/product/product-card';
import { duration, ease } from '@/config/motion';
import { cn } from '@/lib/utils';

type Tab = {
  slug: string;
  title: string;
  description: string;
  href: string;
  products: ProductCardData[];
};

export function ShowcaseTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const baseId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = tabs[active];

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = tabs.length - 1;
    const next = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    const button = buttons.current[next];
    button?.focus();
    button?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  return (
    <div className="mt-8">
      <div
        role="tablist"
        aria-label="Collections"
        onKeyDown={onKeyDown}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 font-sans md:mx-0 md:px-0"
      >
        {tabs.map((t, i) => (
          <button
            key={t.slug}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            id={`${baseId}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === active ? 0 : -1}
            title={t.title}
            onClick={() => setActive(i)}
            className={cn(
              'focus-visible:ring-ring ease-standard min-h-11 max-w-[16rem] shrink-0 truncate rounded-md border px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-150 outline-none focus-visible:ring-[3px] active:scale-[0.98]',
              i === active
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-input hover:bg-accent',
            )}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="mt-6"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={tab.slug}
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.1, ease: ease.exit },
            }}
            transition={{ duration: duration.base, ease: ease.standard }}
          >
            <p className="text-muted-foreground max-w-2xl">{tab.description}</p>
            <ul className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
              {tab.products.map((product) => (
                <li
                  key={product.id}
                  className="w-[72%] shrink-0 snap-start sm:w-[40%] md:w-auto"
                >
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
            <Link
              href={tab.href}
              className="text-primary-text group mt-6 inline-flex min-h-11 items-center gap-1.5 font-sans text-sm font-semibold break-words underline underline-offset-4"
            >
              Shop {tab.title}
              <CtaArrow />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
