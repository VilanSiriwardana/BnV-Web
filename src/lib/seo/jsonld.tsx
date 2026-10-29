import { brand } from '@/config/brand';

import { absoluteUrl } from './canonical';

export type Crumb = { name: string; path: string };

export const breadcrumbJsonLd = (crumbs: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.path),
  })),
});

export const collectionPageJsonLd = (
  name: string,
  path: string,
  description?: string | null,
) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  url: absoluteUrl(path),
  ...(description && { description }),
});

type ProductLd = {
  name: string;
  path: string;
  sku: string;
  description?: string | null;
  images: string[];
  brandName: string;
  priceLkr: number;
  inStock: boolean;
};

// Step-by-Step §10.3: no rating or review schema.
export const productJsonLd = (p: ProductLd) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: p.name,
  sku: p.sku,
  ...(p.description && { description: p.description }),
  image: p.images.map(absoluteUrl),
  brand: { '@type': 'Brand', name: p.brandName },
  offers: {
    '@type': 'Offer',
    url: absoluteUrl(p.path),
    priceCurrency: brand.currency,
    price: p.priceLkr.toFixed(2),
    availability: p.inStock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
  },
});

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\u003c'),
      }}
    />
  );
}
