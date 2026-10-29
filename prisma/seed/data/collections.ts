// Retired by D-21: "New In" is the newest products, not a collection. Archived, never deleted.
export const RETIRED_COLLECTION_SLUGS = [
  'core-range',
  'new-arrivals',
  'custom',
] as const;

export const COLLECTIONS = [
  {
    name: 'Limited Drop',
    slug: 'limited-drop',
    description: 'Small-batch releases',
  },
  {
    name: 'Fashion Edit',
    slug: 'fashion-edit',
    description: 'Styled looks for the season',
  },
  {
    name: 'Jewelry Highlight',
    slug: 'jewelry-highlight',
    description: 'Featured jewelry pieces',
  },
  {
    name: 'Couple Collection',
    slug: 'couple-collection',
    description: 'Pieces made to match',
  },
  {
    name: 'Gift Ready',
    slug: 'gift-ready',
    description: 'Wrapped and ready to give',
  },
] as const;
