// Business values come only from docs/references/Business-Facts.md; null until the owner confirms them.
type Brand = {
  name: string;
  legalName: string | null;
  tagline: string;
  currency: 'LKR';
  country: 'LK';
  locale: 'en-LK';
  logo: { light: string | null; dark: string | null };
  contact: { whatsapp: string | null; email: string | null };
  social: {
    instagram: string | null;
    tiktok: string | null;
    facebook: string | null;
  };
  delivery: { freeThresholdLkr: number | null };
  returnsWindowDays: number | null;
};

export const brand = {
  name: 'B&V',
  legalName: null,
  tagline: 'Style for you. Gifts for them. Moments for two.',
  currency: 'LKR',
  country: 'LK',
  locale: 'en-LK',
  logo: { light: null, dark: null },
  contact: { whatsapp: null, email: null },
  social: { instagram: null, tiktok: null, facebook: null },
  delivery: { freeThresholdLkr: null },
  returnsWindowDays: null,
} as const satisfies Brand;
