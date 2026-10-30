import { CollectionCard } from '@/components/cards/collection-card';
import type { IconRole } from '@/config/icons';

type Props = {
  label: string;
  subtitle?: string;
  href: string;
  image: { light: string; dark: string };
  icon?: IconRole;
};

export function CategoryCard(props: Props) {
  return <CollectionCard {...props} />;
}
