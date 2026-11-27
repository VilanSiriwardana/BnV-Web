import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CatalogListing } from '@/components/catalog/catalog-listing';
import { routes } from '@/config/routes';
import {
  getActiveCollection,
  getCollectionListing,
} from '@/features/catalog/queries';
import { pageMetadata } from '@/lib/seo/metadata';

// Rendered per request: no database is reachable at build time.
// Restore `revalidate` + generateStaticParams once a hosted DB exists.
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getActiveCollection(slug);
  if (!collection) return {};
  return pageMetadata({
    title: collection.name,
    description: collection.description,
    path: routes.collection(slug),
  });
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const [collection, products] = await Promise.all([
    getActiveCollection(slug),
    getCollectionListing(slug),
  ]);
  if (!collection) notFound();

  return (
    <CatalogListing
      title={collection.name}
      description={collection.description}
      path={routes.collection(slug)}
      crumbs={[
        { name: 'Home', path: routes.home },
        { name: 'Shop', path: routes.shop },
        { name: collection.name, path: routes.collection(slug) },
      ]}
      products={products}
    />
  );
}
