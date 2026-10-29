import { brand } from './brand';

export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  defaultTitle: `${brand.name} — ${brand.tagline}`,
  titleTemplate: `%s | ${brand.name}`,
  description:
    'A modern romantic lifestyle brand creating fashion, jewelry, gifts, custom pieces, meaningful digital experiences, and romantic visual content for individuals, couples, brands, and people celebrating beautiful moments.',
  locale: 'en_LK',
} as const;
