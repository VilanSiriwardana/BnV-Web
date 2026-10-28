import type { PrismaClient } from '@prisma/client';

export async function seedBrands(prisma: PrismaClient) {
  const brand = await prisma.brand.upsert({
    where: { slug: 'bnv' },
    update: { name: 'B&V', status: 'active' },
    create: {
      name: 'B&V',
      slug: 'bnv',
      description: 'B&V house brand',
      status: 'active',
    },
  });

  console.log('brands: 1');
  return brand.id;
}
