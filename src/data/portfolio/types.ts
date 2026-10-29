// Shoot data shape: Phase-1-UX-Spec §3.3 (D-05).
export const featuredTypes = ['couple', 'buwi', 'vila'] as const;
export type FeaturedType = (typeof featuredTypes)[number];

export const shootCategories = [
  'fashion',
  'jewelry',
  'promotional',
  'bridal',
  'restaurant',
  'birthday',
  'cinematic',
  'lifestyle',
  'product',
  'event',
  'custom_concept',
] as const;
export type ShootCategory = (typeof shootCategories)[number];

export type VideoLabel =
  | 'campaign_reel'
  | 'behind_the_scenes'
  | 'product_promo'
  | 'cinematic_clip'
  | 'outfit_reel'
  | 'couple_reel';

export type ShootPhoto = {
  kind: 'photo';
  cloudinaryId: string;
  alt: string;
  width: number;
  height: number;
};

export type ShootVideo = {
  kind: 'video';
  cloudinaryId: string;
  posterId: string;
  alt: string;
  durationSec: number;
  label: VideoLabel;
};

export type ShootMedia = ShootPhoto | ShootVideo;

export type Shoot = {
  slug: string;
  title: string;
  featured: FeaturedType;
  categories: ShootCategory[];
  summary: string; // one sentence
  context?: string; // longer text; the page is indexable only when this exists (D-07)
  cover: ShootPhoto;
  media: ShootMedia[];
  shotOn?: string; // ISO date
};

export const featuredLabels: Record<FeaturedType, string> = {
  couple: 'Buwi & Vila',
  buwi: 'Buwi',
  vila: 'Vila',
};

export const categoryLabels: Record<ShootCategory, string> = {
  fashion: 'Fashion',
  jewelry: 'Jewelry',
  promotional: 'Promotional',
  bridal: 'Bridal',
  restaurant: 'Restaurant',
  birthday: 'Birthday',
  cinematic: 'Cinematic',
  lifestyle: 'Lifestyle',
  product: 'Product',
  event: 'Event',
  custom_concept: 'Custom concept',
};

export const videoLabels: Record<VideoLabel, string> = {
  campaign_reel: 'Campaign reel',
  behind_the_scenes: 'Behind the scenes',
  product_promo: 'Product promo',
  cinematic_clip: 'Cinematic clip',
  outfit_reel: 'Outfit reel',
  couple_reel: 'Couple reel',
};
