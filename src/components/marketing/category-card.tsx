import { CollectionCard } from '@/components/cards/collection-card';

type Props = {
  label: string;
  subtitle?: string;
  href: string;
  image: { light: string; dark: string };
};

export function CategoryCard(props: Props) {
  return <CollectionCard {...props} />;
}
