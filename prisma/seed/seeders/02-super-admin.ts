import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

function requireEnv(key: string) {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`${key} is not set. Add it to .env (see .env.example).`);
  }
  return value;
}

export async function seedSuperAdmin(
  prisma: PrismaClient,
  roleIds: Map<string, string>,
) {
  const email = requireEnv('SEED_ADMIN_EMAIL').toLowerCase();
  const password = requireEnv('SEED_ADMIN_PASSWORD');
  const name = requireEnv('SEED_ADMIN_NAME');

  if (password.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 12 characters.');
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, status: 'active' },
    create: {
      email,
      name,
      passwordHash: await bcrypt.hash(password, 12),
      status: 'active',
      emailVerifiedAt: new Date(),
    },
  });

  const roleId = roleIds.get('super_admin')!;
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId } },
    update: {},
    create: { userId: user.id, roleId, assignedBy: user.id },
  });

  console.log(`super_admin: ${email}`);
}
