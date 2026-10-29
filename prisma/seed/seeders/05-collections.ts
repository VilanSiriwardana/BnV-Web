import type { PrismaClient } from '@prisma/client';
import { COLLECTIONS, RETIRED_COLLECTION_SLUGS } from '../data/collections';

export async function seedCollections(prisma: PrismaClient) {
  const collectionIds = new Map<string, string>();

  for (const { name, slug, description } of COLLECTIONS) {
    const collection = await prisma.collection.upsert({
      where: { slug },
      update: { name, description, status: 'active' },
      create: { name, slug, description, status: 'active' },
    });
    collectionIds.set(slug, collection.id);
  }

  const retired = { slug: { in: [...RETIRED_COLLECTION_SLUGS] } };
  await prisma.collectionProduct.deleteMany({ where: { collection: retired } });
  const { count: archived } = await prisma.collection.updateMany({
    where: { ...retired, status: { not: 'archived' } },
    data: { status: 'archived' },
  });

  console.log(`collections: ${collectionIds.size}, archived: ${archived}`);
  return collectionIds;
}
