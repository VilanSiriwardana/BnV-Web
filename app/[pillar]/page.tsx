import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CatalogListing } from '@/components/catalog/catalog-listing';
import { CategoryLinks } from '@/components/catalog/category-links';
import { pillars, routes, type Pillar } from '@/config/routes';
import { getCategory, getCategoryProducts } from '@/features/catalog/queries';
import { pageMetadata } from '@/lib/seo/metadata';

export const revalidate = 300;
export const dynamicParams = false;

type Props = { params: Promise<{ pillar: string }> };

export function generateStaticParams() {
  return pillars.map((pillar) => ({ pillar }));
}

const isPillar = (value: string): value is Pillar =>
  (pillars as readonly string[]).includes(value);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pillar } = await params;
  const category = isPillar(pillar) ? await getCategory(pillar) : null;
  if (!category) return {};
  return pageMetadata({
    title: category.name,
    description: category.description,
    path: `/${pillar}`,
  });
}

export default async function PillarPage({ params }: Props) {
  const { pillar } = await params;
  if (!isPillar(pillar)) notFound();
  const [category, products] = await Promise.all([
    getCategory(pillar),
    getCategoryProducts(pillar),
  ]);
  if (!category) notFound();

  return (
    <CatalogListing
      title={category.name}
      description={category.description}
      path={`/${pillar}`}
      crumbs={[
        { name: 'Home', path: routes.home },
        { name: category.name, path: `/${pillar}` },
      ]}
      products={products}
      links={
        <CategoryLinks
          label={`${category.name} categories`}
          links={category.children.map((child) => ({
            name: child.name,
            href: routes.subcategory(
              pillar,
              child.slug.slice(pillar.length + 1),
            ),
          }))}
        />
      }
    />
  );
}
