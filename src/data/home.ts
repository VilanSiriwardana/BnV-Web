// Static homepage copy and placeholder imagery (public/images/prototype/). No unconfirmed business claims (D-10).
import { brand } from '@/config/brand';
import { routes } from '@/config/routes';

export type ArtDirectedImage = {
  alt: string;
  light: { desktop: string; mobile: string };
  dark: { desktop: string; mobile: string };
};

const banner = (name: string, alt: string): ArtDirectedImage => {
  const src = (theme: string, size: string) =>
    `/images/prototype/banner-${name}-${theme}-${size}.webp`;
  return {
    alt,
    light: { desktop: src('light', 'desktop'), mobile: src('light', 'mobile') },
    dark: { desktop: src('dark', 'desktop'), mobile: src('dark', 'mobile') },
  };
};

export const announcement = {
  text: 'New pieces arrive regularly. Custom orders are always welcome.',
  link: { label: 'Start a custom order', href: routes.custom },
};

export const hero = {
  eyebrow: 'Fashion · Jewelry · Gifts',
  title: brand.tagline,
  subtitle:
    'Modern romantic pieces for you, thoughtful gifts for the people you love, and keepsakes for the moments you share.',
  primaryCta: { label: 'Shop New In', href: routes.newIn },
  secondaryCta: { label: 'Find a Gift', href: routes.gifts },
  image: banner('home', 'B&V fashion, jewelry and gifts'),
};

export const featuredCategories = [
  { label: 'Women', href: routes.women, banner: 'women' },
  { label: 'Men', href: routes.men, banner: 'men' },
  { label: 'Jewelry', href: routes.jewelry, banner: 'jewelry' },
  { label: 'Gifts', href: routes.gifts, banner: 'gifts' },
  { label: 'Couples', href: routes.couples, banner: 'couples' },
  { label: 'Custom', href: routes.custom, banner: 'custom' },
  { label: 'Portfolio', href: routes.portfolio, banner: 'portfolio' },
].map(({ label, href, banner: name }) => ({
  label,
  href,
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
    eyebrow: 'Coming soon',
    title: 'Build Your Gift Box',
    description:
      'Choose the pieces, the wrapping and the note. Until the builder opens, our ready-made gift boxes are waiting.',
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
  portfolio: {
    eyebrow: 'Visual Portfolio',
    title: 'Our first shoots are coming soon',
    description:
      'Fashion, jewelry and romantic visual stories by Buwi and Vila. Brands and event organisers can already work with us.',
    cta: { label: 'Work With Us', href: routes.collaborate },
    image: banner('portfolio', ''),
  },
};
