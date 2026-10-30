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
  badge?: string;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={routes.product(product.slug)}
      className="group focus-visible:ring-ring ease-standard block rounded-md transition-transform duration-150 outline-none focus-visible:ring-[3px] active:scale-[0.98]"
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
        {product.badge ? (
          <Badge variant="gold" className="absolute top-3 left-3">
            {product.badge}
          </Badge>
        ) : (
          product.isNew && (
            <Badge className="absolute top-3 left-3">New Arrival</Badge>
          )
        )}
      </div>
      <h3 className="text-small mt-3 line-clamp-2 font-sans leading-normal font-medium [overflow-wrap:anywhere]">
        {product.name}
      </h3>
      <p className="text-small text-muted-foreground mt-1 font-sans break-words tabular-nums">
        From {formatLkr(product.priceLkr)}
      </p>
    </Link>
  );
}
