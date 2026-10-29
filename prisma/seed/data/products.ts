// Demo data only (seeded with --demo). LKR prices; no ratings or claims (D-10).
export type ProductSeed = {
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  categorySlug: string;
  collectionSlug: string;
  isFeatured?: boolean;
  image: { url: string; alt: string };
  variants: { name: string; sku: string; price: string; quantity: number }[];
};

const sized = (sku: string, price: string, sizes: string[]) =>
  sizes.map((size) => ({
    name: size,
    sku: `${sku}-${size}`,
    price,
    quantity: 5,
  }));

const single = (sku: string, price: string, quantity = 10) => [
  { name: 'Default', sku: `${sku}-OS`, price, quantity },
];

export const PRODUCTS: ProductSeed[] = [
  {
    name: 'Lavender Wrap Dress',
    slug: 'lavender-wrap-dress',
    sku: 'BNV-WDR-001',
    shortDescription: 'A soft wrap dress in muted lavender.',
    categorySlug: 'women-dresses',
    collectionSlug: 'new-arrivals',
    isFeatured: true,
    image: {
      url: '/images/prototype/product-women-01.webp',
      alt: 'Lavender wrap dress',
    },
    variants: sized('BNV-WDR-001', '12900.00', ['S', 'M', 'L']),
  },
  {
    name: 'Blush Satin Top',
    slug: 'blush-satin-top',
    sku: 'BNV-WTP-001',
    shortDescription: 'A light satin top in blush.',
    categorySlug: 'women-tops',
    collectionSlug: 'fashion-edit',
    image: {
      url: '/images/prototype/product-women-02.webp',
      alt: 'Blush satin top',
    },
    variants: sized('BNV-WTP-001', '6900.00', ['S', 'M', 'L']),
  },
  {
    name: 'Ivory Lounge Set',
    slug: 'ivory-lounge-set',
    sku: 'BNV-WLG-001',
    shortDescription: 'A relaxed two-piece lounge set.',
    categorySlug: 'women-loungewear',
    collectionSlug: 'core-range',
    image: {
      url: '/images/prototype/product-women-03.webp',
      alt: 'Ivory lounge set',
    },
    variants: sized('BNV-WLG-001', '9800.00', ['S', 'M', 'L']),
  },
  {
    name: 'Linen Resort Shirt',
    slug: 'linen-resort-shirt',
    sku: 'BNV-MSH-001',
    shortDescription: 'A breathable linen shirt for warm days.',
    categorySlug: 'men-shirts',
    collectionSlug: 'new-arrivals',
    isFeatured: true,
    image: {
      url: '/images/prototype/product-men-01.webp',
      alt: 'Linen resort shirt',
    },
    variants: sized('BNV-MSH-001', '8500.00', ['M', 'L', 'XL']),
  },
  {
    name: 'Tailored Chino Trousers',
    slug: 'tailored-chino-trousers',
    sku: 'BNV-MTR-001',
    shortDescription: 'Clean-cut chinos in sand.',
    categorySlug: 'men-trousers',
    collectionSlug: 'core-range',
    image: {
      url: '/images/prototype/product-men-02.webp',
      alt: 'Tailored chino trousers',
    },
    variants: sized('BNV-MTR-001', '9200.00', ['30', '32', '34']),
  },
  {
    name: 'Heart Pendant Necklace',
    slug: 'heart-pendant-necklace',
    sku: 'BNV-JNK-001',
    shortDescription: 'A fine chain with a small heart pendant.',
    categorySlug: 'jewelry-necklaces',
    collectionSlug: 'jewelry-highlight',
    isFeatured: true,
    image: {
      url: '/images/prototype/product-jewelry-01.webp',
      alt: 'Heart pendant necklace',
    },
    variants: single('BNV-JNK-001', '7500.00'),
  },
  {
    name: 'Promise Band Ring',
    slug: 'promise-band-ring',
    sku: 'BNV-JRG-001',
    shortDescription: 'A slim band, made to be worn every day.',
    categorySlug: 'jewelry-rings',
    collectionSlug: 'jewelry-highlight',
    image: {
      url: '/images/prototype/product-jewelry-02.webp',
      alt: 'Promise band ring',
    },
    variants: sized('BNV-JRG-001', '5900.00', ['6', '7', '8']),
  },
  {
    name: 'Pearl Drop Earrings',
    slug: 'pearl-drop-earrings',
    sku: 'BNV-JER-001',
    shortDescription: 'Simple drop earrings with a pearl accent.',
    categorySlug: 'jewelry-earrings',
    collectionSlug: 'core-range',
    image: {
      url: '/images/prototype/product-jewelry-03.webp',
      alt: 'Pearl drop earrings',
    },
    variants: single('BNV-JER-001', '4800.00'),
  },
  {
    name: 'Initial Charm Bracelet',
    slug: 'initial-charm-bracelet',
    sku: 'BNV-JBR-001',
    shortDescription: 'A delicate bracelet with an initial charm.',
    categorySlug: 'jewelry-bracelets',
    collectionSlug: 'gift-ready',
    image: {
      url: '/images/prototype/product-jewelry-04.webp',
      alt: 'Initial charm bracelet',
    },
    variants: single('BNV-JBR-001', '5400.00'),
  },
  {
    name: 'Self-Love Gift Box',
    slug: 'self-love-gift-box',
    sku: 'BNV-GBX-001',
    shortDescription: 'A curated box with a candle, a note and a small treat.',
    categorySlug: 'gifts-gift-boxes',
    collectionSlug: 'gift-ready',
    isFeatured: true,
    image: {
      url: '/images/prototype/product-gift-box-01.webp',
      alt: 'Self-love gift box',
    },
    variants: single('BNV-GBX-001', '11500.00', 6),
  },
  {
    name: 'Vanilla Rose Candle',
    slug: 'vanilla-rose-candle',
    sku: 'BNV-GCH-001',
    shortDescription: 'A hand-poured candle with vanilla and rose notes.',
    categorySlug: 'gifts-candles-home',
    collectionSlug: 'core-range',
    image: {
      url: '/images/prototype/product-candles-home-01.webp',
      alt: 'Vanilla rose candle',
    },
    variants: single('BNV-GCH-001', '3200.00', 20),
  },
  {
    name: 'Matching Couple Tee Set',
    slug: 'matching-couple-tee-set',
    sku: 'BNV-CPL-001',
    shortDescription: 'Two soft cotton tees made to match.',
    categorySlug: 'couples',
    collectionSlug: 'couple-collection',
    isFeatured: true,
    image: {
      url: '/images/prototype/product-couple-outfit-01.webp',
      alt: 'Matching couple tee set',
    },
    variants: sized('BNV-CPL-001', '10900.00', ['S-M', 'M-L', 'L-XL']),
  },
];
