import { prisma } from './client';
import { seedRolesAndPermissions } from './seeders/01-roles-permissions';
import { seedSuperAdmin } from './seeders/02-super-admin';
import { seedBrands } from './seeders/03-brands';
import { seedCategories } from './seeders/04-categories';
import { seedCollections } from './seeders/05-collections';
import { seedProducts } from './seeders/06-products';

const demo = process.argv.includes('--demo');

async function main() {
  const roleIds = await seedRolesAndPermissions(prisma);
  await seedSuperAdmin(prisma, roleIds);
  const brandId = await seedBrands(prisma);
  const categoryIds = await seedCategories(prisma);
  const collectionIds = await seedCollections(prisma);

  if (demo) {
    await seedProducts(prisma, { brandId, categoryIds, collectionIds });
  }

  console.log(`Seed complete${demo ? ' (with demo data)' : ''}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
