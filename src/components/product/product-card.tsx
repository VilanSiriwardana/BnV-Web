import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { routes } from '@/config/routes';
import { imageSizes } from '@/config/images';
import { formatLkr } from '@/lib/utils';
import { blurFor } from '@/lib/utils/image';

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
            sizes={imageSizes.card}
            {...blurFor(product.imageUrl)}
            className="ease-standard object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
          />
        )}
        {product.isNew && (
          <Badge className="absolute top-3 left-3">New Arrival</Badge>
        )}
      </div>
      <h3 className="text-small mt-3 font-semibold">{product.name}</h3>
      <p className="text-small text-muted-foreground mt-1 font-sans tabular-nums">
        From {formatLkr(product.priceLkr)}
      </p>
    </Link>
  );
}
