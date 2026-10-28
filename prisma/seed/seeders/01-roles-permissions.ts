import type { PrismaClient } from '@prisma/client';
import { PERMISSIONS, ROLES } from '../data/roles';

export async function seedRolesAndPermissions(prisma: PrismaClient) {
  const permissionIds = new Map<string, string>();
  for (const { name, description } of PERMISSIONS) {
    const permission = await prisma.permission.upsert({
      where: { name },
      update: { description, status: 'active' },
      create: {
        name,
        description,
        module: name.split('.')[0],
        status: 'active',
      },
    });
    permissionIds.set(name, permission.id);
  }

  const roleIds = new Map<string, string>();
  let links = 0;
  for (const { name, description, permissions } of ROLES) {
    const role = await prisma.role.upsert({
      where: { name },
      update: { description, isSystem: true, status: 'active' },
      create: { name, description, isSystem: true, status: 'active' },
    });
    roleIds.set(name, role.id);

    for (const permissionName of permissions) {
      const permissionId = permissionIds.get(permissionName)!;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId } },
        update: {},
        create: { roleId: role.id, permissionId },
      });
      links++;
    }
  }

  console.log(
    `roles: ${roleIds.size}, permissions: ${permissionIds.size}, role_permissions: ${links}`,
  );
  return roleIds;
}
