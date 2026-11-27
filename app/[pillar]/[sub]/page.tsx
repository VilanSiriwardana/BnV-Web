import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CatalogListing } from '@/components/catalog/catalog-listing';
import { pillars, routes, type Pillar } from '@/config/routes';
import {
  getCategory,
  getCategoryProducts,
  subcategorySlug,
} from '@/features/catalog/queries';
import { pageMetadata } from '@/lib/seo/metadata';

// Rendered per request: no database is reachable at build time.
// Restore `revalidate` + generateStaticParams once a hosted DB exists.
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ pillar: string; sub: string }> };

// D-21: /<pillar>/<sub> resolves to category slug <pillar>-<sub> under that pillar.
async function load(pillar: string, sub: string) {
  if (!(pillars as readonly string[]).includes(pillar)) return null;
  const category = await getCategory(subcategorySlug(pillar as Pillar, sub));
  return category?.parent?.slug === pillar ? category : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pillar, sub } = await params;
  const category = await load(pillar, sub);
  if (!category?.parent) return {};
  const products = await getCategoryProducts(category.slug);
  return pageMetadata({
    title: `${category.name} — ${category.parent.name}`,
    description: category.description,
    path: routes.subcategory(pillar as Pillar, sub),
    noindex: products.length === 0,
  });
}

export default async function SubcategoryPage({ params }: Props) {
  const { pillar, sub } = await params;
  const category = await load(pillar, sub);
  if (!category?.parent) notFound();
  const products = await getCategoryProducts(category.slug);
  const path = routes.subcategory(pillar as Pillar, sub);

  return (
    <CatalogListing
      title={category.name}
      description={category.description}
      path={path}
      crumbs={[
        { name: 'Home', path: routes.home },
        { name: category.parent.name, path: `/${pillar}` },
        { name: category.name, path },
      ]}
      products={products}
    />
  );
}
