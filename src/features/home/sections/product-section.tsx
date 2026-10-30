import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';
import { cn } from '@/lib/utils';
import { Stagger, StaggerItem } from '@/components/motion/stagger';
import {
  ProductCard,
  type ProductCardData,
} from '@/components/product/product-card';

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
    <section
      aria-labelledby={id}
      className={cn('section-y mx-auto max-w-[1440px] px-4 md:px-8', className)}
    >
      <Reveal>
        <SectionHeading
          id={id}
          eyebrow={eyebrow}
          title={title}
          description={description}
          link={{ label: 'View all', href }}
        />
      </Reveal>
      <Stagger className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
