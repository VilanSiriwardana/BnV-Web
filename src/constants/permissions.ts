// Seeded by prisma/seed/data/roles.ts (ADR-0012). Add new names there too.
export const permissionNames = [
  'products.manage',
  'catalog.manage',
  'orders.manage',
  'inquiries.manage',
  'content.manage',
  'users.manage',
  'settings.manage',
] as const;

export type PermissionName = (typeof permissionNames)[number];
