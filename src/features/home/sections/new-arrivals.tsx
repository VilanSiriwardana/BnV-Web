import { routes } from '@/config/routes';

import { getCollectionProducts, getNewestProducts } from '../queries';
import { ProductSection } from './product-section';

export async function NewArrivals() {
  const [newest, limitedDrop] = await Promise.all([
    getNewestProducts(8),
    getCollectionProducts('limited-drop', 4),
  ]);

  const seen = new Set<string>();
  const products = [
    ...limitedDrop.map((p) => ({ ...p, badge: 'Limited Drop' })),
    ...newest,
  ]
    .filter((p) => !seen.has(p.id) && seen.add(p.id))
    .slice(0, 8);

  return (
    <ProductSection
      id="new-in-title"
      eyebrow="Just arrived"
      title="New In"
      href={routes.newIn}
      products={products}
    />
  );
}
