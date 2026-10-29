import { cardSelect, toCards } from '@/features/catalog/queries';
import { prisma } from '@/lib/prisma';

export async function getNewestProducts(limit = 8) {
  const rows = await prisma.product.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: cardSelect,
  });
  return toCards(rows);
}

export async function getCollectionProducts(slug: string, limit = 8) {
  const rows = await prisma.collectionProduct.findMany({
    where: {
      collection: { slug, status: 'active' },
      product: { status: 'active' },
    },
    orderBy: { sortOrder: 'asc' },
    take: limit,
    select: { product: { select: cardSelect } },
  });
  return toCards(rows.map((row) => row.product));
}
