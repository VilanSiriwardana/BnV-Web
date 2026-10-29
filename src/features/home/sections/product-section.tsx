import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';
import { ProductGrid } from '@/components/product/product-grid';
import type { ProductCardData } from '@/components/product/product-card';

type Props = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  href: string;
  products: ProductCardData[];
  className?: string;
};

export function ProductSection({
  id,
  eyebrow,
  title,
  description,
  href,
  products,
  className,
}: Props) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby={id} className={className}>
      <Reveal className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16">
        <SectionHeading
          id={id}
          eyebrow={eyebrow}
          title={title}
          description={description}
          link={{ label: 'View all', href }}
        />
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      </Reveal>
    </section>
  );
}
