import { type Pillar, routes } from './routes';

export type NavItem = { label: string; href: string };

export const mainNav: (NavItem & { megaMenu?: true })[] = [
  { label: 'Shop', href: routes.shop, megaMenu: true },
  { label: 'Women', href: routes.women },
  { label: 'Men', href: routes.men },
  { label: 'Jewelry', href: routes.jewelry },
  { label: 'Gifts', href: routes.gifts },
  { label: 'Couples', href: routes.couples },
  { label: 'Custom', href: routes.custom },
  { label: 'Portfolio', href: routes.portfolio },
];

// Pillar columns list their child categories from the database (UX-Spec §2).
export const shopMenu = {
  featured: [
    { label: 'New In', href: routes.newIn },
    { label: 'Limited Drop', href: routes.collection('limited-drop') },
  ] satisfies NavItem[],
  pillars: [
    { pillar: 'women', label: 'Women', href: routes.women },
    { pillar: 'men', label: 'Men', href: routes.men },
    { pillar: 'jewelry', label: 'Jewelry', href: routes.jewelry },
    { pillar: 'gifts', label: 'Gifts', href: routes.gifts },
  ] satisfies (NavItem & { pillar: Pillar })[],
  collections: { label: 'Couples', href: routes.couples } satisfies NavItem,
};

export const utilityNav = ['theme', 'cart'] as const;

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Shop',
    items: [
      { label: 'New In', href: routes.newIn },
      { label: 'Women', href: routes.women },
      { label: 'Men', href: routes.men },
      { label: 'Jewelry', href: routes.jewelry },
      { label: 'Gifts', href: routes.gifts },
      { label: 'Couples', href: routes.couples },
      { label: 'Custom', href: routes.custom },
    ],
  },
  {
    title: 'Explore',
    items: [
      { label: 'Our Story', href: routes.ourStory },
      { label: 'Love Websites', href: routes.loveWebsites },
      { label: 'Visual Portfolio', href: routes.portfolio },
      { label: 'Collaborate', href: routes.collaborate },
    ],
  },
  {
    title: 'Help',
    items: [
      { label: 'Contact', href: routes.contact },
      { label: 'FAQ', href: routes.faq },
      { label: 'Delivery', href: routes.policy('delivery') },
      { label: 'Returns', href: routes.policy('returns') },
      { label: 'Privacy', href: routes.policy('privacy') },
      { label: 'Terms', href: routes.policy('terms') },
    ],
  },
];

export const adminNav: NavItem[] = [
  { label: 'Dashboard', href: routes.admin.dashboard },
  { label: 'Products', href: routes.admin.products },
  { label: 'Categories', href: routes.admin.categories },
  { label: 'Collections', href: routes.admin.collections },
  { label: 'Orders', href: routes.admin.orders },
  { label: 'Custom Requests', href: routes.admin.customRequests },
  {
    label: 'Collaboration Inquiries',
    href: routes.admin.collaborationInquiries,
  },
  { label: 'Contact Messages', href: routes.admin.contactMessages },
  { label: 'Newsletter', href: routes.admin.newsletter },
  { label: 'Media', href: routes.admin.media },
  { label: 'Settings', href: routes.admin.settings },
];
