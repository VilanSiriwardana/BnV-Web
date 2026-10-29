import type { Metadata } from 'next';

import { CatalogFilters } from '@/components/catalog/catalog-filters';
import { CatalogListing } from '@/components/catalog/catalog-listing';
import { routes } from '@/config/routes';
import { getFilterOptions, getShopProducts } from '@/features/catalog/queries';
import { hasShopFilters, parseShopParams } from '@/features/catalog/schema';

// Sort and filter parameters canonicalise to /shop (UX-Spec §10).
export const metadata: Metadata = {
  title: 'Shop All',
  description:
    'Discover every B&V piece: fashion, jewelry, gifts and matching sets for two.',
  alternates: { canonical: routes.shop },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseShopParams(await searchParams);
  const [products, [categories, collections]] = await Promise.all([
    getShopProducts(params),
    getFilterOptions(),
  ]);

  return (
    <CatalogListing
      title="Shop All"
      path={routes.shop}
      crumbs={[
        { name: 'Home', path: routes.home },
        { name: 'Shop', path: routes.shop },
      ]}
      products={products}
      emptyMessage={
        hasShopFilters(params) ? 'No pieces match these filters.' : undefined
      }
      clearHref={hasShopFilters(params) ? routes.shop : undefined}
      toolbar={
        <CatalogFilters
          params={params}
          categories={categories}
          collections={collections}
          total={products.length}
        />
      }
    />
  );
}
