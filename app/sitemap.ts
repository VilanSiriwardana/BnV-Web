import type { MetadataRoute } from 'next';

import { pillars, routes } from '@/config/routes';
import {
  getCollectionSlugs,
  getProductSlugs,
  getSubcategorySlugs,
} from '@/features/catalog/queries';
import { shoots } from '@/data/portfolio';
import { absoluteUrl } from '@/lib/seo/canonical';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, subcategories] = await Promise.all([
    getProductSlugs(),
    getCollectionSlugs(),
    getSubcategorySlugs(),
  ]);

  return [
    { url: absoluteUrl(routes.home) },
    { url: absoluteUrl(routes.shop) },
    ...[
      routes.custom,
      routes.loveWebsites,
      routes.portfolio,
      routes.collaborate,
      routes.contact,
    ].map((path) => ({ url: absoluteUrl(path) })),
    ...shoots
      .filter((s) => s.context)
      .map((s) => ({ url: absoluteUrl(routes.shoot(s.slug)) })),
    ...pillars.map((pillar) => ({ url: absoluteUrl(`/${pillar}`) })),
    ...subcategories.flatMap(({ slug, updatedAt, parent }) =>
      parent
        ? [
            {
              url: absoluteUrl(
                `/${parent.slug}/${slug.slice(parent.slug.length + 1)}`,
              ),
              lastModified: updatedAt,
            },
          ]
        : [],
    ),
    ...collections.map(({ slug, updatedAt }) => ({
      url: absoluteUrl(routes.collection(slug)),
      lastModified: updatedAt,
    })),
    ...products.map(({ slug, updatedAt }) => ({
      url: absoluteUrl(routes.product(slug)),
      lastModified: updatedAt,
    })),
  ];
}
