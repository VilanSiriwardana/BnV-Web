// Business values come only from docs/references/Business-Facts.md; null until the owner confirms them.
type Brand = {
  name: string;
  legalName: string | null;
  tagline: string;
  currency: 'LKR';
  country: 'LK';
  locale: 'en-LK';
  logo: { light: string | null; dark: string | null };
  contact: {
    whatsapp: string | null;
    email: string | null;
    phone: string | null;
  };
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
  contact: { whatsapp: '+94703802284', email: null, phone: null },
  social: { instagram: null, tiktok: null, facebook: null },
  delivery: { freeThresholdLkr: null },
  returnsWindowDays: null,
} as const satisfies Brand;

export function whatsappUrlTo(number: string | null | undefined, text: string) {
  const digits = number?.replace(/\D/g, '');
  return digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
    : null;
}

export function whatsappUrl(text: string) {
  return whatsappUrlTo(brand.contact.whatsapp as string | null, text);
}

// Neutral copy until the owner confirms delivery and returns values (Business-Facts.md).
export const policyCopy = {
  delivery:
    'Delivery charges and timing are confirmed with you when we confirm your order.',
  returns:
    'Questions about an order? Contact us and we will help. Full returns terms will be published soon.',
  payment:
    'Cash on delivery or bank transfer, confirmed with you after you place your order.',
  giftPackaging: 'Ask us about gift packaging options when you order.',
} as const;
