import type { ReactNode } from 'react';

import { ProductGrid } from '@/components/product/product-grid';
import type { ProductCardData } from '@/components/product/product-card';
import {
  JsonLd,
  breadcrumbJsonLd,
  collectionPageJsonLd,
  type Crumb,
} from '@/lib/seo/jsonld';

import { Breadcrumbs } from './breadcrumbs';
import { EmptyState } from './empty-state';

type Props = {
  title: string;
  description?: string | null;
  path: string;
  crumbs: Crumb[];
  products: ProductCardData[];
  emptyMessage?: string;
  clearHref?: string;
  toolbar?: ReactNode;
  links?: ReactNode;
};

export function CatalogListing({
  title,
  description,
  path,
  crumbs,
  products,
  emptyMessage = 'New pieces are on their way. Check back soon.',
  clearHref,
  toolbar,
  links,
}: Props) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8 md:py-14">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={collectionPageJsonLd(title, path, description)} />
      <Breadcrumbs crumbs={crumbs} />
      <header className="mt-6 max-w-2xl">
        <h1 className="font-display text-h1 font-semibold">{title}</h1>
        {description && (
          <p className="text-body-lg text-muted-foreground mt-3">
            {description}
          </p>
        )}
      </header>
      {links}
      {toolbar}
      <div className="mt-8">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState message={emptyMessage} clearHref={clearHref} />
        )}
      </div>
    </div>
  );
}
