export type CategorySeed = {
  name: string;
  slug: string;
  description?: string;
  parentSlug?: string;
  isFeatured?: boolean;
};

export const PARENT_CATEGORIES: CategorySeed[] = [
  {
    name: 'Women',
    slug: 'women',
    description: 'Romantic everyday fashion for her',
    isFeatured: true,
  },
  {
    name: 'Men',
    slug: 'men',
    description: 'Clean, modern pieces for him',
    isFeatured: true,
  },
  {
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'Delicate jewelry for every day and every occasion',
    isFeatured: true,
  },
  {
    name: 'Gifts',
    slug: 'gifts',
    description: 'Thoughtful gifts and gift boxes',
    isFeatured: true,
  },
  {
    name: 'Couples',
    slug: 'couples',
    description: 'Matching pieces for two',
    isFeatured: true,
  },
  {
    name: 'Custom',
    slug: 'custom',
    description: 'Personalised and made-to-order pieces',
    isFeatured: true,
  },
];

export const CHILD_CATEGORIES: CategorySeed[] = [
  { name: 'Dresses', slug: 'women-dresses', parentSlug: 'women' },
  { name: 'Tops', slug: 'women-tops', parentSlug: 'women' },
  { name: 'Loungewear', slug: 'women-loungewear', parentSlug: 'women' },
  { name: 'Knitwear', slug: 'women-knitwear', parentSlug: 'women' },
  { name: 'Outerwear', slug: 'women-outerwear', parentSlug: 'women' },
  { name: 'Shirts', slug: 'men-shirts', parentSlug: 'men' },
  { name: 'Trousers', slug: 'men-trousers', parentSlug: 'men' },
  { name: 'Knitwear', slug: 'men-knitwear', parentSlug: 'men' },
  { name: 'Outerwear', slug: 'men-outerwear', parentSlug: 'men' },
  { name: 'Necklaces', slug: 'jewelry-necklaces', parentSlug: 'jewelry' },
  { name: 'Rings', slug: 'jewelry-rings', parentSlug: 'jewelry' },
  { name: 'Earrings', slug: 'jewelry-earrings', parentSlug: 'jewelry' },
  { name: 'Bracelets', slug: 'jewelry-bracelets', parentSlug: 'jewelry' },
  { name: 'Gift Boxes', slug: 'gifts-gift-boxes', parentSlug: 'gifts' },
  { name: 'Candles & Home', slug: 'gifts-candles-home', parentSlug: 'gifts' },
  { name: 'Accessories', slug: 'gifts-accessories', parentSlug: 'gifts' },
];
