import type { PrismaClient } from '@prisma/client';
import { PRODUCTS } from '../data/products';

export async function seedProducts(
  prisma: PrismaClient,
  refs: {
    brandId: string;
    categoryIds: Map<string, string>;
    collectionIds: Map<string, string>;
  },
) {
  let variantCount = 0;

  for (const [index, product] of PRODUCTS.entries()) {
    const categoryId = refs.categoryIds.get(product.categorySlug);
    const collectionIds = product.collectionSlugs.map((slug) =>
      refs.collectionIds.get(slug),
    );
    if (!categoryId || collectionIds.some((id) => !id)) {
      throw new Error(
        `Unknown category or collection for product ${product.slug}`,
      );
    }

    const data = {
      name: product.name,
      shortDescription: product.shortDescription,
      sku: product.sku,
      isFeatured: product.isFeatured ?? false,
      status: 'active',
      categoryId,
      brandId: refs.brandId,
    };
    const { id: productId } = await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: { slug: product.slug, ...data },
    });

    await prisma.collectionProduct.deleteMany({ where: { productId } });
    await prisma.collectionProduct.createMany({
      data: collectionIds.map((collectionId) => ({
        collectionId: collectionId!,
        productId,
        sortOrder: index,
      })),
    });

    for (const { name, sku, price, quantity } of product.variants) {
      const variant = await prisma.productVariant.upsert({
        where: { sku },
        update: { productId, name, price, status: 'active' },
        create: { productId, name, sku, price, status: 'active' },
      });
      await prisma.inventory.upsert({
        where: { variantId: variant.id },
        update: { quantity },
        create: { variantId: variant.id, quantity, lowStockThreshold: 2 },
      });
      variantCount++;
    }

    await prisma.productImage.deleteMany({ where: { productId } });
    await prisma.productImage.create({
      data: {
        productId,
        imageUrl: product.image.url,
        altText: product.image.alt,
        isPrimary: true,
        sortOrder: 0,
      },
    });
  }

  // Demo products dropped from the data file are archived, never deleted (they may have order history).
  const { count: archived } = await prisma.product.updateMany({
    where: {
      sku: { startsWith: 'BNV-' },
      slug: { notIn: PRODUCTS.map((p) => p.slug) },
      status: { not: 'archived' },
    },
    data: { status: 'archived' },
  });

  console.log(
    `products: ${PRODUCTS.length}, variants: ${variantCount}, archived: ${archived} (demo)`,
  );
}
