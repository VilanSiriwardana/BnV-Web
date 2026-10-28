import type { PrismaClient } from '@prisma/client';
import { COLLECTIONS } from '../data/collections';

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

  console.log(`collections: ${collectionIds.size}`);
  return collectionIds;
}
