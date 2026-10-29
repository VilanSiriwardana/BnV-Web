import { redirect } from 'next/navigation';
import { cache } from 'react';

import { auth } from '@/auth';
import { routes } from '@/config/routes';
import type { PermissionName } from '@/constants/permissions';
import { prisma } from '@/lib/prisma';

export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  permissions: Set<PermissionName>;
};

// Re-reads status and permissions on every request so disabling a user takes effect at once (D-12).
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      userRoles: {
        where: { role: { status: 'active' } },
        select: {
          role: {
            select: {
              rolePermissions: {
                where: { permission: { status: 'active' } },
                select: { permission: { select: { name: true } } },
              },
            },
          },
        },
      },
    },
  });
  if (!user || user.status !== 'active') return null;

  const permissions = new Set(
    user.userRoles.flatMap(({ role }) =>
      role.rolePermissions.map(
        ({ permission }) => permission.name as PermissionName,
      ),
    ),
  );
  if (permissions.size === 0) return null;

  return { id: user.id, name: user.name, email: user.email, permissions };
});

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect(routes.admin.login);
  return admin;
}

export class ForbiddenError extends Error {
  constructor() {
    super('You do not have permission to do that.');
  }
}

// First line of every admin page, Server Action and Route Handler.
export async function requirePermission(permission: PermissionName) {
  const admin = await requireAdmin();
  if (!admin.permissions.has(permission)) throw new ForbiddenError();
  return admin;
}

export function can(admin: AdminUser, permission: PermissionName) {
  return admin.permissions.has(permission);
}
