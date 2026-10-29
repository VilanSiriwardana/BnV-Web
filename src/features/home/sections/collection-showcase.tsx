import { getCollectionProducts } from '../queries';
import { ProductSection } from './product-section';

type Props = {
  slug: string;
  title: string;
  description: string;
  href: string;
  className?: string;
};

export async function CollectionShowcase({ slug, ...props }: Props) {
  const products = await getCollectionProducts(slug, 4);
  return <ProductSection id={`${slug}-title`} products={products} {...props} />;
}
