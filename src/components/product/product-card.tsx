import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { routes } from '@/config/routes';
import { formatLkr } from '@/lib/utils';

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  priceLkr: number;
  imageUrl: string | null;
  imageAlt: string;
  isNew: boolean;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={routes.product(product.slug)}
      className="group focus-visible:ring-ring block rounded-md outline-none focus-visible:ring-[3px]"
    >
      <div className="bg-muted relative aspect-[4/5] overflow-hidden rounded-md">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.imageAlt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="ease-standard object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
          />
        )}
        {product.isNew && (
          <Badge className="absolute top-3 left-3">New Arrival</Badge>
        )}
      </div>
      <h3 className="text-small mt-3 font-semibold">{product.name}</h3>
      <p className="text-small text-muted-foreground mt-1">
        From {formatLkr(product.priceLkr)}
      </p>
    </Link>
  );
}
