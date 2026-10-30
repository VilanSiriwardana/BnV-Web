import { routes } from '@/config/routes';

import { getCollectionProducts, getNewestProducts } from '../queries';
import { FeaturedCarousel } from './featured-carousel';

export async function NewArrivals() {
  const [newest, limitedDrop] = await Promise.all([
    getNewestProducts(12),
    getCollectionProducts('limited-drop', 4),
  ]);

  const seen = new Set<string>();
  const products = [
    ...limitedDrop.map((p) => ({ ...p, badge: 'Limited Drop' })),
    ...newest,
  ]
    .filter((p) => !seen.has(p.id) && seen.add(p.id))
    .slice(0, 12);

  if (products.length === 0) return null;

  return (
    <FeaturedCarousel
      title="Featured Favorites"
      href={routes.newIn}
      products={products}
    />
  );
}
