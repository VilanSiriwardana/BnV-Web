// Policy texts come from the owner (Business-Facts.md "Policies"); body stays null until confirmed.
export type Policy = {
  title: string;
  summary: string;
  body: string[] | null;
  updatedAt: string | null;
};

export const policies = {
  terms: {
    title: 'Terms and Conditions',
    summary: 'The terms that apply when you order from or work with B&V.',
    body: null,
    updatedAt: null,
  },
  privacy: {
    title: 'Privacy Policy',
    summary:
      'How B&V collects, uses and protects your personal data under the Personal Data Protection Act No. 9 of 2022.',
    body: null,
    updatedAt: null,
  },
  delivery: {
    title: 'Delivery Policy',
    summary: 'Delivery areas, charges and timing for B&V orders.',
    body: null,
    updatedAt: null,
  },
  returns: {
    title: 'Returns and Exchanges',
    summary: 'How returns, exchanges and custom-order changes work at B&V.',
    body: null,
    updatedAt: null,
  },
} as const satisfies Record<string, Policy>;

export type PolicySlug = keyof typeof policies;

export function getPolicy(slug: string): Policy | null {
  return Object.hasOwn(policies, slug) ? policies[slug as PolicySlug] : null;
}
