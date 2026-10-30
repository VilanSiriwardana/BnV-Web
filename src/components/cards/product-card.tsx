import { Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { ImageFrame } from '@/components/ui/image-frame';
import { routes } from '@/config/routes';
import { imageSizes } from '@/config/images';
import { formatLkr } from '@/lib/utils';

import { cardShell, type CardStyle } from './variants';

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

export function ProductCard({
  product,
  variant = 'solid',
}: {
  product: ProductCardData;
  variant?: CardStyle;
}) {
  return (
    <Link
      href={routes.product(product.slug)}
      data-spotlight
      className={cardShell(variant, 'block h-full p-2 pb-3')}
    >
      <div className="relative">
        {product.imageUrl ? (
          <ImageFrame
            src={product.imageUrl}
            alt={product.imageAlt}
            sizes={imageSizes.card}
            className="rounded-sm"
          />
        ) : (
          <div className="bg-primary-soft aspect-[4/5] rounded-sm" />
        )}
        {product.badge ? (
          <Badge variant="gold" className="absolute top-3 left-3">
            <Crown aria-hidden />
            {product.badge}
          </Badge>
        ) : (
          product.isNew && (
            <Badge className="absolute top-3 left-3">
              <Sparkles aria-hidden />
              New Arrival
            </Badge>
          )
        )}
      </div>
      <h3 className="text-small group-hover:text-primary-text mt-3 line-clamp-2 px-1 font-sans leading-normal font-medium [overflow-wrap:anywhere] transition-colors">
        {product.name}
      </h3>
      <p className="text-small text-muted-foreground mt-1 px-1 font-sans break-words tabular-nums">
        From {formatLkr(product.priceLkr)}
      </p>
    </Link>
  );
}
