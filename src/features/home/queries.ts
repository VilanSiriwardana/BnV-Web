import type { Prisma } from '@prisma/client';

import type { ProductCardData } from '@/components/product/product-card';
import { prisma } from '@/lib/prisma';

const cardSelect = {
  id: true,
  slug: true,
  name: true,
  createdAt: true,
  images: {
    orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
    take: 1,
    select: { imageUrl: true, altText: true },
  },
  variants: {
    where: { status: 'active' },
    select: { price: true, salePrice: true },
  },
} satisfies Prisma.ProductSelect;

const NEW_ARRIVAL_MS = 30 * 24 * 60 * 60 * 1000;

type CardRow = {
  id: string;
  slug: string;
  name: string;
  createdAt: Date;
  images: { imageUrl: string; altText: string | null }[];
  variants: { price: unknown; salePrice: unknown }[];
};

function toCard(row: CardRow): ProductCardData | null {
  const prices = row.variants.map((v) => Number(v.salePrice ?? v.price));
  if (prices.length === 0) return null;
  const image = row.images[0];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    priceLkr: Math.min(...prices),
    imageUrl: image?.imageUrl ?? null,
    imageAlt: image?.altText ?? row.name,
    isNew: Date.now() - row.createdAt.getTime() < NEW_ARRIVAL_MS,
  };
}

const toCards = (rows: CardRow[]) =>
  rows.map(toCard).filter((card): card is ProductCardData => card !== null);

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
