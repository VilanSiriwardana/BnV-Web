import type { PrismaClient } from '@prisma/client';
import {
  CHILD_CATEGORIES,
  PARENT_CATEGORIES,
  type CategorySeed,
} from '../data/categories';

export async function seedCategories(prisma: PrismaClient) {
  const categoryIds = new Map<string, string>();

  const upsert = async (
    { name, slug, description, parentSlug, isFeatured = false }: CategorySeed,
    sortOrder: number,
  ) => {
    const parentId = parentSlug ? categoryIds.get(parentSlug)! : null;
    const data = {
      name,
      description,
      parentId,
      sortOrder,
      isFeatured,
      status: 'active',
    };
    const category = await prisma.category.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });
    categoryIds.set(slug, category.id);
  };

  for (const [index, category] of PARENT_CATEGORIES.entries()) {
    await upsert(category, index + 1);
  }
  for (const [index, category] of CHILD_CATEGORIES.entries()) {
    await upsert(category, index + 1);
  }

  console.log(`categories: ${categoryIds.size}`);
  return categoryIds;
}
