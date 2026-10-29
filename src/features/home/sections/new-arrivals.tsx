import { routes } from '@/config/routes';

import { getCollectionProducts, getNewestProducts } from '../queries';
import { ProductSection } from './product-section';

export async function NewArrivals() {
  const [newest, limitedDrop] = await Promise.all([
    getNewestProducts(8),
    getCollectionProducts('limited-drop', 4),
  ]);

  return (
    <>
      <ProductSection
        id="new-in-title"
        eyebrow="Just arrived"
        title="New In"
        href={routes.newIn}
        products={newest}
      />
      <ProductSection
        id="limited-drop-title"
        eyebrow="While they last"
        title="Limited Drop"
        href={routes.collection('limited-drop')}
        products={limitedDrop}
        className="bg-surface"
      />
    </>
  );
}
