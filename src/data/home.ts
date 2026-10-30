// Static homepage copy and placeholder imagery (public/images/prototype/). No unconfirmed business claims (D-10).
import { routes } from '@/config/routes';

export type ArtDirectedImage = {
  alt: string;
  light: { desktop: string; mobile: string };
  dark: { desktop: string; mobile: string };
  objectPosition?: string;
};

const banner = (
  name: string,
  alt: string,
  objectPosition = 'right center',
): ArtDirectedImage => {
  const src = (theme: string, size: string) =>
    `/images/prototype/banner-${name}-${theme}-${size}.webp`;
  return {
    alt,
    objectPosition,
    light: { desktop: src('light', 'desktop'), mobile: src('light', 'mobile') },
    dark: { desktop: src('dark', 'desktop'), mobile: src('dark', 'mobile') },
  };
};

export const announcement = {
  text: 'Cash on delivery or bank transfer · Every order confirmed on WhatsApp · Delivered across Sri Lanka',
};

export const trust = [
  {
    icon: 'banknote',
    title: 'Cash on delivery or bank transfer',
    text: 'Pay the way that suits you, in LKR.',
  },
  {
    icon: 'message-circle',
    title: 'Every order confirmed on WhatsApp',
    text: 'We check the details with you before we dispatch.',
  },
  {
    icon: 'truck',
    title: 'Delivered across Sri Lanka',
    text: 'Wrapped with care and sent to your door.',
  },
] as const;

// Placeholder image (AI-generated) until the real Buwi and Vila shoot (D-10).
export const story = {
  eyebrow: 'Our story',
  title: 'Made by two,',
  accent: 'for every kind of love',
  body: 'B&V began with Buwi and Vila, a couple who wanted the pieces they gave each other to feel personal. Today we make fashion, jewelry and gifts for anyone marking a moment, whether it is for yourself, for someone you love, or for the two of you.',
  cta: { label: 'Read Our Story', href: routes.ourStory },
  image: banner('our-story', 'Buwi and Vila of B&V'),
};

export const hero = {
  eyebrow: 'Made for moments that last',
  title: 'Style for you, gifts for them.',
  accent: 'Moments for two.',
  subtitle:
    'Modern romantic pieces for you, thoughtful gifts for the people you love, and keepsakes for the moments you share.',
  primaryCta: { label: 'Shop New In', href: routes.newIn },
  secondaryCta: { label: 'Find a Gift', href: routes.gifts },
  image: banner('home', 'B&V fashion, jewelry and gifts'),
};

export const featuredCategories = [
  {
    label: 'For Women',
    subtitle: 'Timeless & elegant',
    href: routes.women,
    banner: 'women',
    icon: 'women' as const,
  },
  {
    label: 'For Men',
    subtitle: 'Understated & refined',
    href: routes.men,
    banner: 'men',
    icon: 'men' as const,
  },
  {
    label: 'Jewelry',
    subtitle: 'Crafted with meaning',
    href: routes.jewelry,
    banner: 'jewelry',
    icon: 'jewelry' as const,
  },
  {
    label: 'Gifts',
    subtitle: 'Beautifully wrapped',
    href: routes.gifts,
    banner: 'gifts',
    icon: 'gifts' as const,
  },
  {
    label: 'For Couples',
    subtitle: 'Celebrate your bond',
    href: routes.couples,
    banner: 'couples',
    icon: 'couples' as const,
  },
  {
    label: 'Custom & Personal',
    subtitle: 'Made uniquely yours',
    href: routes.custom,
    banner: 'custom',
    icon: 'custom' as const,
  },
].map(({ label, subtitle, href, banner: name, icon }) => ({
  label,
  subtitle,
  href,
  icon,
  image: {
    light: `/images/prototype/banner-${name}-light-mobile.webp`,
    dark: `/images/prototype/banner-${name}-dark-mobile.webp`,
    alt: `${label} at B&V`,
  },
}));

export const showcases = [
  {
    slug: 'fashion-edit',
    title: 'The Fashion Edit',
    description: 'Easy, romantic pieces for women and men.',
    href: routes.collection('fashion-edit'),
  },
  {
    slug: 'jewelry-highlight',
    title: 'Jewelry Highlight',
    description: 'Delicate pieces made to be worn every day.',
    href: routes.collection('jewelry-highlight'),
  },
  {
    slug: 'couple-collection',
    title: 'The Couple Collection',
    description: 'Matching pieces for two, made to feel like you.',
    href: routes.collection('couple-collection'),
  },
] as const;

export const teasers = {
  giftBox: {
    eyebrow: 'Gift boxes',
    title: 'Ready-to-give gift boxes',
    description:
      'Pieces, wrapping and a handwritten note, put together for you.',
    cta: { label: 'Shop Gifts', href: routes.gifts },
    image: banner('gift-box', ''),
  },
  custom: {
    eyebrow: 'Made for you',
    title: 'Custom Orders',
    description:
      'Embroidery, engraving, custom jewelry and personalised gift boxes, made to order for the people and moments that matter.',
    cta: { label: 'Request a Custom Piece', href: routes.custom },
    secondary: { label: 'Read Our Story', href: routes.ourStory },
    image: banner('custom', ''),
  },
  loveWebsites: {
    eyebrow: 'Digital keepsakes',
    title: 'Love Websites',
    description:
      'A private little website for an anniversary, a proposal or a birthday, filled with your photos and words.',
    cta: { label: 'Explore Love Websites', href: routes.loveWebsites },
    image: banner('love-websites', ''),
  },
};

export const comingSoon = [
  { label: 'Gift Box Builder', href: routes.gifts },
  { label: 'Visual Portfolio', href: routes.collaborate },
] as const;

export const giftBanner = {
  eyebrow: 'Make it unforgettable',
  title: 'Ready-to-give',
  accent: 'gift boxes',
  description:
    'Pieces, wrapping and a handwritten note, put together for you, ready to surprise someone you love.',
  cta: { label: 'Shop Gifts', href: routes.gifts },
  features: [
    'Handpicked with love',
    'Luxury gift packaging',
    'Add a personal touch',
  ],
  image: banner('gift-box', 'A B&V gift box with jewelry, a card and a mug'),
};
