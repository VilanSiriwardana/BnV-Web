// Demo data only (seeded with --demo). LKR prices; no ratings or unverified material claims (D-10).
// One product per curated placeholder image in public/images/prototype/ (Visual-Asset-Inventory §2).
import { RETIRED_COLLECTION_SLUGS } from './collections';

export type ProductSeed = {
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  categorySlug: string;
  collectionSlugs: string[];
  isFeatured?: boolean;
  image: { url: string; alt: string };
  variants: { name: string; sku: string; price: string; quantity: number }[];
};

type Sizing = 'women' | 'men' | 'ring' | 'couple' | 'one';
type Row = [
  name: string,
  categorySlug: string,
  collectionSlug: string,
  priceLkr: number,
  description: string,
  featured?: boolean,
  sizing?: Sizing,
];

const SIZES: Record<Exclude<Sizing, 'one'>, string[]> = {
  women: ['S', 'M', 'L'],
  men: ['M', 'L', 'XL'],
  ring: ['6', '7', '8'],
  couple: ['S-M', 'M-L', 'L-XL'],
};

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Retired collections (D-21) fall back to the collection matching the product's pillar.
const PILLAR_COLLECTIONS: Record<string, string> = {
  women: 'fashion-edit',
  men: 'fashion-edit',
  jewelry: 'jewelry-highlight',
  gifts: 'gift-ready',
  couples: 'couple-collection',
};

const toCollectionSlugs = (categorySlug: string, collectionSlug: string) => {
  if (
    !(RETIRED_COLLECTION_SLUGS as readonly string[]).includes(collectionSlug)
  ) {
    return [collectionSlug];
  }
  const fallback = PILLAR_COLLECTIONS[categorySlug.split('-')[0]];
  return fallback ? [fallback] : [];
};

const build = (
  imageGroup: string,
  skuCode: string,
  sizing: Sizing,
  rows: Row[],
): ProductSeed[] =>
  rows.map(
    (
      [
        name,
        categorySlug,
        collectionSlug,
        priceLkr,
        description,
        featured,
        rowSizing,
      ],
      i,
    ) => {
      const size = rowSizing ?? sizing;
      const n = String(i + 1).padStart(2, '0');
      const sku = `BNV-${skuCode}-${String(i + 1).padStart(3, '0')}`;
      const price = `${priceLkr}.00`;
      const variants =
        size === 'one'
          ? [{ name: 'Default', sku: `${sku}-OS`, price, quantity: 10 }]
          : SIZES[size].map((size) => ({
              name: size,
              sku: `${sku}-${size}`,
              price,
              quantity: 5,
            }));
      return {
        name,
        slug: slugify(name),
        sku,
        shortDescription: description,
        categorySlug,
        collectionSlugs: toCollectionSlugs(categorySlug, collectionSlug),
        isFeatured: featured,
        image: {
          url: `/images/prototype/product-${imageGroup}-${n}.webp`,
          alt: name,
        },
        variants,
      };
    },
  );

const WOMEN = build('women', 'W', 'women', [
  [
    'Lavender Knit Lounge Set',
    'women-loungewear',
    'fashion-edit',
    8900,
    'A soft knit sweater and jogger set in lavender.',
    true,
  ],
  [
    'Lilac Cosy Jogger Set',
    'women-loungewear',
    'core-range',
    8900,
    'A relaxed lilac lounge set for slow evenings.',
  ],
  [
    'Ivory Knit Lounge Set',
    'women-loungewear',
    'core-range',
    8900,
    'A V-neck knit and wide-leg trouser set in ivory.',
  ],
  [
    'Cream Relaxed Lounge Set',
    'women-loungewear',
    'core-range',
    8900,
    'A cream knit lounge set with a drawstring waist.',
  ],
  [
    'Blush Chiffon Midi Dress',
    'women-dresses',
    'fashion-edit',
    12900,
    'A flowing blush midi dress with sheer sleeves.',
    true,
  ],
  [
    'Rose Pleated Chiffon Dress',
    'women-dresses',
    'new-arrivals',
    12900,
    'A pleated rose dress that moves beautifully.',
  ],
  [
    'Champagne Slip Dress & Cardigan',
    'women-dresses',
    'fashion-edit',
    14900,
    'A champagne slip dress paired with a soft cardigan.',
  ],
  [
    'Plum Satin Slip Gown',
    'women-dresses',
    'limited-drop',
    18900,
    'A draped plum satin gown for evening plans.',
    true,
  ],
  [
    'Lavender Floral Maxi Dress',
    'women-dresses',
    'new-arrivals',
    13900,
    'A sheer floral maxi dress in soft lavender.',
  ],
  [
    'Champagne Blouse & Satin Skirt',
    'women-tops',
    'fashion-edit',
    13900,
    'A champagne blouse with a fluid satin midi skirt.',
  ],
  [
    'Blush Ribbed Cardigan',
    'women-knitwear',
    'core-range',
    7900,
    'A chunky ribbed cardigan in blush pink.',
  ],
  [
    'Dusty Rose Knit Co-ord',
    'women-knitwear',
    'new-arrivals',
    11900,
    'A knit cardigan and midi skirt in dusty rose.',
  ],
  [
    'Ivory Tailored Blazer Set',
    'women-tops',
    'fashion-edit',
    16900,
    'A tailored ivory blazer with matching trousers.',
  ],
  [
    'Plum Wrap Jumpsuit',
    'women-dresses',
    'limited-drop',
    14900,
    'A plum wrap jumpsuit with a defined waist.',
  ],
  [
    'Lavender Wrap Top & Ivory Trousers',
    'women-tops',
    'fashion-edit',
    11900,
    'A lavender wrap top with wide ivory trousers.',
  ],
  [
    'Blush Longline Coat',
    'women-outerwear',
    'new-arrivals',
    17900,
    'A longline coat in soft blush.',
  ],
  [
    'Ivory Blouse & Pleated Skirt',
    'women-tops',
    'core-range',
    12900,
    'A soft ivory blouse with a pleated midi skirt.',
  ],
  [
    'Mauve Tulle Evening Dress',
    'women-dresses',
    'limited-drop',
    19900,
    'A floor-length mauve tulle dress with sheer sleeves.',
  ],
  [
    'Lavender Long Cardigan Lounge Set',
    'women-loungewear',
    'core-range',
    10900,
    'A long lavender cardigan over a cream lounge set.',
  ],
]);

const MEN = build('men', 'M', 'men', [
  [
    'Oatmeal Crew Knit',
    'men-knitwear',
    'core-range',
    7900,
    'A textured crew-neck knit in oatmeal.',
  ],
  [
    'Sand Textured Sweater',
    'men-knitwear',
    'core-range',
    7900,
    'A soft sand sweater for everyday layering.',
  ],
  [
    'Ivory Crew Knit',
    'men-knitwear',
    'fashion-edit',
    7900,
    'A clean ivory crew-neck knit.',
    true,
  ],
  [
    'Cream Waffle Sweater',
    'men-knitwear',
    'core-range',
    7900,
    'A cream sweater with a gentle waffle texture.',
  ],
  [
    'Lavender Crew Knit',
    'men-knitwear',
    'new-arrivals',
    7900,
    'A crew-neck knit in a quiet lavender.',
  ],
  [
    'Taupe Knit Polo',
    'men-shirts',
    'fashion-edit',
    6900,
    'A short-sleeve knit polo in taupe.',
  ],
  [
    'Black Turtleneck',
    'men-knitwear',
    'core-range',
    8900,
    'A slim black turtleneck for evenings out.',
  ],
  [
    'Lilac Fuzzy Sweater',
    'men-knitwear',
    'new-arrivals',
    8900,
    'A soft brushed sweater in lilac.',
  ],
  [
    'Plum Satin Bomber Jacket',
    'men-outerwear',
    'limited-drop',
    15900,
    'A plum satin-finish bomber jacket.',
    true,
  ],
  [
    'Taupe Tailored Blazer',
    'men-outerwear',
    'fashion-edit',
    16900,
    'A relaxed tailored blazer in taupe.',
  ],
  [
    'Mocha Button Cardigan',
    'men-knitwear',
    'core-range',
    8900,
    'A button-front cardigan in mocha.',
  ],
  [
    'Ivory Overshirt',
    'men-shirts',
    'core-range',
    8900,
    'A structured ivory overshirt.',
  ],
  [
    'Plum Evening Blazer',
    'men-outerwear',
    'limited-drop',
    17900,
    'A deep plum blazer for date nights.',
  ],
  [
    'Sand Open Cardigan',
    'men-knitwear',
    'core-range',
    8900,
    'A long open cardigan in sand.',
  ],
  [
    'Camel Overcoat',
    'men-outerwear',
    'new-arrivals',
    21900,
    'A tailored camel overcoat.',
  ],
  [
    'Ivory Zip Jacket',
    'men-outerwear',
    'core-range',
    12900,
    'A clean ivory zip-front jacket.',
  ],
  [
    'Lavender Knit Cardigan',
    'men-knitwear',
    'new-arrivals',
    8900,
    'A zip knit cardigan in lavender.',
  ],
  [
    'Lilac Collared Cardigan',
    'men-knitwear',
    'fashion-edit',
    8900,
    'A collared cardigan in soft lilac.',
  ],
  [
    'Black Crew Knit',
    'men-knitwear',
    'core-range',
    7900,
    'A black crew-neck knit.',
  ],
  [
    'Ivory Hoodie',
    'men-knitwear',
    'core-range',
    7900,
    'A soft ivory hoodie for weekends.',
  ],
]);

const JEWELRY = build('jewelry', 'J', 'one', [
  [
    'Engraved Heart Necklace',
    'jewelry-necklaces',
    'jewelry-highlight',
    6900,
    'A gold-tone heart pendant engraved with a message.',
    true,
  ],
  [
    'Classic Heart Pendant',
    'jewelry-necklaces',
    'jewelry-highlight',
    5900,
    'A simple gold-tone heart on a fine chain.',
  ],
  [
    'Promise Band Ring Pair',
    'jewelry-rings',
    'couple-collection',
    12900,
    'A pair of gold-tone bands with a single stone.',
    true,
    'ring',
  ],
  [
    'Classic Band Pair',
    'jewelry-rings',
    'couple-collection',
    11900,
    'Two polished gold-tone bands made to match.',
    undefined,
    'ring',
  ],
  [
    'Heart & Bar Bracelet Duo',
    'jewelry-bracelets',
    'couple-collection',
    8900,
    'A heart chain bracelet with a matching bar bracelet.',
  ],
  [
    'Curb Chain Bracelet Set',
    'jewelry-bracelets',
    'jewelry-highlight',
    8900,
    'A curb chain and heart bracelet set.',
  ],
  [
    'Heart Huggie Earrings',
    'jewelry-earrings',
    'jewelry-highlight',
    4900,
    'Small huggie hoops with heart drops.',
  ],
  [
    'Initial Heart Necklace',
    'jewelry-necklaces',
    'gift-ready',
    7900,
    'A heart pendant engraved with your initial.',
  ],
  [
    'Initial Disc Charm Necklace',
    'jewelry-necklaces',
    'gift-ready',
    7900,
    'An initial disc with tiny heart charms.',
  ],
  [
    'Heart Drop Huggies',
    'jewelry-earrings',
    'jewelry-highlight',
    4900,
    'Gold-tone huggies with heart drops.',
  ],
  [
    'Heart Locket in Gift Box',
    'jewelry-necklaces',
    'gift-ready',
    9900,
    'A heart locket presented in a gift box.',
    true,
  ],
  [
    'Heart Chain Bracelet',
    'jewelry-bracelets',
    'jewelry-highlight',
    5900,
    'A fine chain bracelet with a heart charm.',
  ],
  [
    'Pearl Heart Bracelet',
    'jewelry-bracelets',
    'new-arrivals',
    6900,
    'A pearl bead bracelet with a heart charm.',
  ],
  [
    'Stacked Band Trio',
    'jewelry-rings',
    'jewelry-highlight',
    9900,
    'Three stacking gold-tone bands.',
    undefined,
    'ring',
  ],
  [
    'Birthstone Stacking Rings',
    'jewelry-rings',
    'gift-ready',
    10900,
    'Fine stacking rings with coloured stones.',
    undefined,
    'ring',
  ],
  [
    'Heart Necklace in Velvet Box',
    'jewelry-necklaces',
    'gift-ready',
    7900,
    'A heart pendant presented in a velvet box.',
  ],
  [
    'Heart Necklace & Stud Set',
    'jewelry-necklaces',
    'gift-ready',
    9900,
    'A heart necklace with matching studs.',
  ],
  [
    'Heart Necklace & Bracelet Set',
    'jewelry-necklaces',
    'gift-ready',
    10900,
    'A matching heart necklace and bracelet.',
  ],
  [
    'Engraved Couple Bands',
    'jewelry-rings',
    'couple-collection',
    13900,
    'Two bands engraved with your words.',
    true,
    'ring',
  ],
  [
    'Crescent Heart Pendant',
    'jewelry-necklaces',
    'new-arrivals',
    6900,
    'A crescent moon pendant holding a small heart.',
  ],
]);

const ACCESSORIES = build('accessories', 'A', 'one', [
  [
    'Ivory Structured Tote',
    'gifts-accessories',
    'fashion-edit',
    14900,
    'A structured ivory tote with a lavender tag.',
    true,
  ],
  [
    'Bracelet Watch',
    'gifts-accessories',
    'gift-ready',
    16900,
    'A slim bracelet watch in a gold-tone finish.',
  ],
  [
    'Plum Top-Handle Bag',
    'gifts-accessories',
    'limited-drop',
    15900,
    'A deep plum top-handle bag.',
  ],
  [
    'His & Hers Watch Pair',
    'gifts-accessories',
    'couple-collection',
    29900,
    'A matching pair of dark-dial watches.',
    true,
  ],
  [
    'Lavender Floral Canvas Tote',
    'gifts-accessories',
    'core-range',
    4900,
    'A canvas tote printed with lavender florals.',
  ],
  [
    'Floral Phone Case',
    'gifts-accessories',
    'core-range',
    2900,
    'A soft-touch phone case with floral details.',
  ],
  [
    'Espresso Tote Bag',
    'gifts-accessories',
    'core-range',
    13900,
    'A roomy everyday tote in espresso.',
  ],
  [
    'Plum Phone Case',
    'gifts-accessories',
    'new-arrivals',
    2900,
    'A plum phone case with a gold-tone line detail.',
  ],
  [
    'Ivory Compact Wallet',
    'gifts-accessories',
    'gift-ready',
    6900,
    'A compact fold wallet in ivory.',
  ],
  [
    'Heart Keyring Set',
    'gifts-accessories',
    'gift-ready',
    2900,
    'A set of heart keyrings in soft colours.',
  ],
  [
    'Plum Zip Wallet',
    'gifts-accessories',
    'gift-ready',
    7900,
    'A zip-around wallet in plum.',
  ],
  [
    'Heart Keychain Trio',
    'gifts-accessories',
    'couple-collection',
    3900,
    'Three heart keychains to share.',
  ],
  [
    'Rose-Tint Oversized Sunglasses',
    'gifts-accessories',
    'new-arrivals',
    5900,
    'Oversized frames with rose-tinted lenses.',
  ],
  [
    'Lavender Floral Scarf',
    'gifts-accessories',
    'fashion-edit',
    4900,
    'A satin-finish scarf with lavender florals.',
  ],
  [
    'Black Cat-Eye Sunglasses',
    'gifts-accessories',
    'core-range',
    5900,
    'Classic black cat-eye frames.',
  ],
  [
    'Plum Floral Scarf',
    'gifts-accessories',
    'limited-drop',
    4900,
    'A satin-finish scarf with plum florals.',
  ],
  [
    'Lavender Hair Accessory Set',
    'gifts-accessories',
    'gift-ready',
    3900,
    'Bows, clips and a scrunchie in lavender tones.',
  ],
  [
    'Blush Belt Collection',
    'gifts-accessories',
    'core-range',
    4900,
    'Slim belts in blush and caramel tones.',
  ],
  [
    'Velvet Hair Bow Set',
    'gifts-accessories',
    'new-arrivals',
    3900,
    'Velvet bows and pearl-style clips.',
  ],
  [
    'Classic Black Belt',
    'gifts-accessories',
    'core-range',
    4900,
    'A classic black belt with a gold-tone buckle.',
  ],
]);

const CANDLES_HOME = build('candles-home', 'H', 'one', [
  [
    'Ribbed Glass Candle Trio',
    'gifts-candles-home',
    'gift-ready',
    6900,
    'Three ribbed glass candles in ivory, blush and lavender.',
    true,
  ],
  [
    'Lavender & Rose Arrangement',
    'gifts-candles-home',
    'new-arrivals',
    7900,
    'A lavender, rose and gypsophila arrangement.',
  ],
  [
    'Midnight Candle Collection',
    'gifts-candles-home',
    'limited-drop',
    7900,
    'Four deep-toned glass candles for evening light.',
  ],
  [
    'Plum Rose Arrangement',
    'gifts-candles-home',
    'limited-drop',
    8900,
    'A moody arrangement of plum roses and lavender.',
  ],
  [
    'Embossed Heart Mug Set',
    'gifts-candles-home',
    'gift-ready',
    4900,
    'A set of embossed mugs in soft pastels.',
  ],
  [
    'Lavender Journal & Pen',
    'gifts-candles-home',
    'gift-ready',
    3900,
    'A lavender journal with a gold-tone pen.',
  ],
  [
    'Midnight Marble Mug Set',
    'gifts-candles-home',
    'core-range',
    5900,
    'Dark marbled mugs with gold-tone rims.',
  ],
  [
    'Amber Glass Candle Holder',
    'gifts-candles-home',
    'core-range',
    2900,
    'A ribbed amber glass tealight holder.',
  ],
  [
    'Lavender Cushion Set',
    'gifts-candles-home',
    'core-range',
    6900,
    'Velvet-touch cushions in lavender and ivory.',
  ],
  [
    'Lilac Throw Blanket',
    'gifts-candles-home',
    'core-range',
    7900,
    'A soft lilac throw for slow mornings.',
  ],
  [
    'Plum Velvet Cushion Set',
    'gifts-candles-home',
    'limited-drop',
    6900,
    'Plum and charcoal velvet cushions.',
  ],
  [
    'Plum Bedding Set',
    'gifts-candles-home',
    'limited-drop',
    18900,
    'A deep plum bedding set with a quilted throw.',
  ],
  [
    'Pleated Lamp with Lilac Base',
    'gifts-candles-home',
    'new-arrivals',
    9900,
    'A pleated shade lamp on a lilac glass base.',
  ],
  [
    'Self-Care Vanity Set',
    'gifts-candles-home',
    'gift-ready',
    8900,
    'A vanity tray set with a scrunchie and candle.',
  ],
  [
    'Plum Glass Table Lamp',
    'gifts-candles-home',
    'limited-drop',
    11900,
    'A plum glass lamp with a pleated shade.',
  ],
  [
    'Velvet Robe & Sleep Mask Set',
    'gifts-candles-home',
    'gift-ready',
    12900,
    'A plum velvet robe with a matching sleep mask.',
  ],
  [
    'Ribbed Ceramic Vase Trio',
    'gifts-candles-home',
    'core-range',
    5900,
    'Three ribbed ceramic vases in soft tones.',
  ],
  [
    'Lavender Self-Care Basket',
    'gifts-candles-home',
    'gift-ready',
    11900,
    'A lavender gift box with a mug, candle and cushion.',
    true,
  ],
  [
    'Smoked Glass Vase Set',
    'gifts-candles-home',
    'core-range',
    6900,
    'Smoked glass vases with gold-tone details.',
  ],
  [
    'Midnight Candle & Mug Box',
    'gifts-candles-home',
    'gift-ready',
    9900,
    'A plum gift box with a candle and mug.',
  ],
]);

const GIFT_BOXES = build('gift-box', 'G', 'one', [
  [
    'For You Fragrance Box',
    'gifts-gift-boxes',
    'gift-ready',
    12900,
    'A lavender box with a fragrance and a pouch.',
    true,
  ],
  [
    'Amber & Vanilla Cosy Box',
    'gifts-gift-boxes',
    'gift-ready',
    10900,
    'A candle, mug and keepsake in a gift box.',
  ],
  [
    'Heart Necklace Gift Box',
    'gifts-gift-boxes',
    'gift-ready',
    11900,
    'A heart necklace presented with a love note.',
    true,
  ],
  [
    'Lavender Spa Box',
    'gifts-gift-boxes',
    'gift-ready',
    11900,
    'A lavender candle, lotion and bath set.',
  ],
  [
    'Forever Candle & Necklace Box',
    'gifts-gift-boxes',
    'gift-ready',
    13900,
    'A candle and necklace with a "Forever" card.',
  ],
  [
    'Midnight Fragrance Box',
    'gifts-gift-boxes',
    'limited-drop',
    12900,
    'The fragrance box in a midnight plum edition.',
  ],
  [
    'Midnight Cosy Box',
    'gifts-gift-boxes',
    'limited-drop',
    10900,
    'The cosy box in a midnight plum edition.',
  ],
  [
    'Midnight Heart Necklace Box',
    'gifts-gift-boxes',
    'limited-drop',
    11900,
    'The necklace gift box in midnight plum.',
  ],
  [
    'Midnight Spa Box',
    'gifts-gift-boxes',
    'limited-drop',
    11900,
    'The spa box in a midnight plum edition.',
  ],
  [
    'Midnight Forever Box',
    'gifts-gift-boxes',
    'limited-drop',
    13900,
    'The Forever box in midnight plum.',
  ],
]);

const COUPLES = build('couple-outfit', 'C', 'couple', [
  [
    'Lavender Wrap Dress & Knit Polo Pair',
    'couples',
    'couple-collection',
    21900,
    'A lavender wrap dress with a cream knit polo.',
    true,
  ],
  [
    'Evening Wrap Dress & Polo Pair',
    'couples',
    'couple-collection',
    21900,
    'The wrap dress and polo pair in evening tones.',
  ],
  [
    'Lavender Cardigan & Ivory Polo Pair',
    'couples',
    'couple-collection',
    19900,
    'A lavender cardigan dress with an ivory polo.',
  ],
  [
    'Plum Cardigan & Black Polo Pair',
    'couples',
    'couple-collection',
    19900,
    'A plum cardigan dress with a black polo.',
  ],
  [
    'Ivory & Lavender Hoodie Set',
    'couples',
    'couple-collection',
    15900,
    'Matching hoodie sets in ivory and lavender.',
    true,
  ],
  [
    'Plum & Violet Hoodie Set',
    'couples',
    'couple-collection',
    15900,
    'Matching hoodie sets in plum and violet.',
  ],
  [
    'Travel Lounge Pair',
    'couples',
    'couple-collection',
    17900,
    'Coordinated ivory and lavender travel lounge sets.',
  ],
  [
    'Midnight Travel Lounge Pair',
    'couples',
    'couple-collection',
    17900,
    'Coordinated black and lavender travel lounge sets.',
  ],
  [
    'Blush Dress & Beige Suit Pair',
    'couples',
    'limited-drop',
    34900,
    'A blush wrap dress with a beige tailored suit.',
  ],
  [
    'Midnight Dress & Plum Suit Pair',
    'couples',
    'limited-drop',
    34900,
    'A plum evening dress with a dark tailored suit.',
  ],
]);

export const PRODUCTS: ProductSeed[] = [
  ...WOMEN,
  ...MEN,
  ...JEWELRY,
  ...ACCESSORIES,
  ...CANDLES_HOME,
  ...GIFT_BOXES,
  ...COUPLES,
];
