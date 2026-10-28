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

  for (const product of PRODUCTS) {
    const categoryId = refs.categoryIds.get(product.categorySlug);
    const collectionId = refs.collectionIds.get(product.collectionSlug);
    if (!categoryId || !collectionId) {
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
      collectionId,
      brandId: refs.brandId,
    };
    const { id: productId } = await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: { slug: product.slug, ...data },
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

  console.log(`products: ${PRODUCTS.length}, variants: ${variantCount} (demo)`);
}
