'use client';

import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { SectionHeading } from '@/components/marketing/section-heading';
import {
  ProductCard,
  type ProductCardData,
} from '@/components/product/product-card';
import { Button } from '@/components/ui/button';

type Props = {
  title: string;
  href: string;
  products: ProductCardData[];
};

export function FeaturedCarousel({ title, href, products }: Props) {
  const rail = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const scroll = (direction: 1 | -1) => {
    const el = rail.current;
    const card = el?.querySelector('li');
    if (!el || !card) return;
    el.scrollBy({
      left: direction * (card.clientWidth + 16),
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  return (
    <section
      aria-labelledby="featured-title"
      className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16"
    >
      <div className="flex items-end justify-between gap-4">
        <SectionHeading
          id="featured-title"
          title={title}
          heart
          link={{ label: 'View all', href }}
          className="flex-1"
        />
        <div className="hidden gap-2 md:flex">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="Previous products"
            disabled={edges.start}
            onClick={() => scroll(-1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="Next products"
            disabled={edges.end}
            onClick={() => scroll(1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <ul
        ref={rail}
        className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0"
      >
        {products.map((product) => (
          <li
            key={product.id}
            className="w-[72%] shrink-0 snap-start sm:w-[40%] md:w-[calc((100%-3rem)/4)] lg:w-[calc((100%-5rem)/6)]"
          >
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
