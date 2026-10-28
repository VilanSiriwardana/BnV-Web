export const PERMISSIONS = [
  { name: 'products.manage', description: 'Create, edit and archive products' },
  { name: 'catalog.manage', description: 'Manage categories and collections' },
  { name: 'orders.manage', description: 'View and update orders and payments' },
  {
    name: 'inquiries.manage',
    description: 'Handle custom, contact and collaboration inquiries',
  },
  { name: 'content.manage', description: 'Edit site content and media' },
  { name: 'users.manage', description: 'Manage admin users and their roles' },
  { name: 'settings.manage', description: 'Change site settings' },
] as const;

export type PermissionName = (typeof PERMISSIONS)[number]['name'];

const ALL_PERMISSIONS = PERMISSIONS.map((permission) => permission.name);

export const ROLES: {
  name: string;
  description: string;
  permissions: readonly PermissionName[];
}[] = [
  {
    name: 'super_admin',
    description: 'Full access, including users and settings',
    permissions: ALL_PERMISSIONS,
  },
  {
    name: 'admin',
    description: 'Runs the store day to day',
    permissions: ALL_PERMISSIONS.filter(
      (name) => name !== 'users.manage' && name !== 'settings.manage',
    ),
  },
  {
    name: 'editor',
    description: 'Manages products, catalog and content',
    permissions: ['products.manage', 'catalog.manage', 'content.manage'],
  },
  {
    name: 'customer',
    description: 'Storefront customer (Phase 2 accounts)',
    permissions: [],
  },
];
