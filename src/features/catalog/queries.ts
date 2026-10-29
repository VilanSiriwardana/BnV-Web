import type { Prisma } from '@prisma/client';

import type { ProductCardData } from '@/components/product/product-card';
import { pillars, type Pillar } from '@/config/routes';
import { prisma } from '@/lib/prisma';

import type { ShopParams, ShopSort } from './schema';
import { isVariantAvailable } from './variants';

export const cardSelect = {
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
    select: {
      price: true,
      salePrice: true,
      status: true,
      inventory: { select: { quantity: true, reservedQuantity: true } },
    },
  },
} satisfies Prisma.ProductSelect;

const NEW_ARRIVAL_MS = 30 * 24 * 60 * 60 * 1000;

type CardRow = {
  id: string;
  slug: string;
  name: string;
  createdAt: Date;
  images: { imageUrl: string; altText: string | null }[];
  variants: {
    price: unknown;
    salePrice: unknown;
    status: string;
    inventory: { quantity: number; reservedQuantity: number } | null;
  }[];
};

type CatalogCard = ProductCardData & { inStock: boolean; createdAt: Date };

function toCatalogCard(row: CardRow): CatalogCard | null {
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
    inStock: row.variants.some(isVariantAvailable),
    createdAt: row.createdAt,
  };
}

const toCatalogCards = (rows: CardRow[]) =>
  rows.map(toCatalogCard).filter((card): card is CatalogCard => card !== null);

const stripCard = (card: CatalogCard): ProductCardData => ({
  id: card.id,
  slug: card.slug,
  name: card.name,
  priceLkr: card.priceLkr,
  imageUrl: card.imageUrl,
  imageAlt: card.imageAlt,
  isNew: card.isNew,
});

export function toCard(row: CardRow): ProductCardData | null {
  const card = toCatalogCard(row);
  return card && stripCard(card);
}

export const toCards = (rows: CardRow[]) => toCatalogCards(rows).map(stripCard);

const sorters: Record<ShopSort, (a: CatalogCard, b: CatalogCard) => number> = {
  newest: (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  'price-asc': (a, b) => a.priceLkr - b.priceLkr,
  'price-desc': (a, b) => b.priceLkr - a.priceLkr,
};

function activeCollectionWhere(now = new Date()) {
  return {
    status: 'active',
    AND: [
      { OR: [{ startDate: null }, { startDate: { lte: now } }] },
      { OR: [{ endDate: null }, { endDate: { gte: now } }] },
    ],
  } satisfies Prisma.CollectionWhereInput;
}

const categoryTreeWhere = (slug: string) =>
  ({
    status: 'active',
    category: {
      status: 'active',
      OR: [{ slug }, { parent: { slug, status: 'active' } }],
    },
  }) satisfies Prisma.ProductWhereInput;

// Phase 1 catalog is small; price sort and stock filter run in memory on the mapped cards.
export async function getShopProducts(params: ShopParams) {
  const where: Prisma.ProductWhereInput = {
    status: 'active',
    ...(params.category && categoryTreeWhere(params.category)),
    ...(params.collection && {
      collections: {
        some: {
          collection: { slug: params.collection, ...activeCollectionWhere() },
        },
      },
    }),
  };
  const rows = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: cardSelect,
  });
  return toCatalogCards(rows)
    .filter(
      (card) =>
        (params.minPrice === undefined || card.priceLkr >= params.minPrice) &&
        (params.maxPrice === undefined || card.priceLkr <= params.maxPrice) &&
        (!params.inStock || card.inStock),
    )
    .sort(sorters[params.sort])
    .map(stripCard);
}

export async function getCategoryProducts(slug: string) {
  const rows = await prisma.product.findMany({
    where: categoryTreeWhere(slug),
    orderBy: { createdAt: 'desc' },
    select: cardSelect,
  });
  return toCards(rows);
}

export function getCategory(slug: string) {
  return prisma.category.findFirst({
    where: { slug, status: 'active' },
    select: {
      name: true,
      slug: true,
      description: true,
      parent: { select: { name: true, slug: true } },
      children: {
        where: { status: 'active' },
        orderBy: { sortOrder: 'asc' },
        select: { name: true, slug: true },
      },
    },
  });
}

export function getActiveCollection(slug: string) {
  return prisma.collection.findFirst({
    where: { slug, ...activeCollectionWhere() },
    select: { name: true, slug: true, description: true },
  });
}

export async function getCollectionListing(slug: string) {
  const rows = await prisma.collectionProduct.findMany({
    where: {
      collection: { slug, ...activeCollectionWhere() },
      product: { status: 'active' },
    },
    orderBy: { sortOrder: 'asc' },
    select: { product: { select: cardSelect } },
  });
  return toCards(rows.map((row) => row.product));
}

export function getFilterOptions() {
  return Promise.all([
    prisma.category.findMany({
      where: { status: 'active', parentId: null, slug: { in: [...pillars] } },
      orderBy: { sortOrder: 'asc' },
      select: { name: true, slug: true },
    }),
    prisma.collection.findMany({
      where: activeCollectionWhere(),
      orderBy: { name: 'asc' },
      select: { name: true, slug: true },
    }),
  ]);
}

export function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: 'active' },
    select: {
      id: true,
      slug: true,
      name: true,
      sku: true,
      shortDescription: true,
      description: true,
      categoryId: true,
      brand: { select: { name: true } },
      category: {
        select: {
          name: true,
          slug: true,
          parent: { select: { name: true, slug: true } },
        },
      },
      images: {
        orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
        select: { id: true, imageUrl: true, altText: true },
      },
      variants: {
        where: { status: 'active' },
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          salePrice: true,
          status: true,
          inventory: {
            select: {
              quantity: true,
              reservedQuantity: true,
              lowStockThreshold: true,
            },
          },
        },
      },
      collections: {
        where: { collection: activeCollectionWhere() },
        select: { collectionId: true },
      },
    },
  });
}

export type ProductDetail = NonNullable<
  Awaited<ReturnType<typeof getProductBySlug>>
>;

// UX-Spec §9.3: same collection(s) first, then same category; in-stock only, newest first.
export async function getRelatedProducts(product: ProductDetail, limit = 4) {
  const base = { status: 'active', id: { not: product.id } };
  const collectionIds = product.collections.map((c) => c.collectionId);
  const [byCollection, byCategory] = await Promise.all([
    collectionIds.length
      ? prisma.product.findMany({
          where: {
            ...base,
            collections: { some: { collectionId: { in: collectionIds } } },
          },
          orderBy: { createdAt: 'desc' },
          take: limit * 2,
          select: cardSelect,
        })
      : [],
    prisma.product.findMany({
      where: { ...base, categoryId: product.categoryId },
      orderBy: { createdAt: 'desc' },
      take: limit * 2,
      select: cardSelect,
    }),
  ]);
  const seen = new Set<string>();
  return toCatalogCards([...byCollection, ...byCategory])
    .filter((card) => card.inStock && !seen.has(card.id) && seen.add(card.id))
    .slice(0, limit)
    .map(stripCard);
}

export async function getProductSlugs() {
  const rows = await prisma.product.findMany({
    where: { status: 'active' },
    select: { slug: true, updatedAt: true },
  });
  return rows;
}

export function getCollectionSlugs() {
  return prisma.collection.findMany({
    where: activeCollectionWhere(),
    select: { slug: true, updatedAt: true },
  });
}

export function getSubcategorySlugs() {
  return prisma.category.findMany({
    where: {
      status: 'active',
      parent: { slug: { in: [...pillars] }, status: 'active' },
      products: { some: { status: 'active' } },
    },
    select: { slug: true, updatedAt: true, parent: { select: { slug: true } } },
  });
}

export const subcategorySlug = (pillar: Pillar, sub: string) =>
  `${pillar}-${sub}`;
