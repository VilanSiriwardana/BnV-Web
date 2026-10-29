'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { routes } from '@/config/routes';
import type { PermissionName } from '@/constants/permissions';
import { ForbiddenError, requirePermission } from '@/lib/auth/guards';
import { isOwnUploadUrl, uploadFolders } from '@/lib/cloudinary';
import { parseForm, SERVER_ERROR } from '@/lib/forms/parse';
import type { FormState } from '@/lib/forms/types';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils/slug';

import {
  categorySchema,
  collectionSchema,
  productSchema,
  variantSchema,
  type CategoryState,
  type CollectionState,
  type ProductState,
  type VariantState,
} from './schema';

type State = FormState<string>;

async function guard(permission: PermissionName): Promise<State | null> {
  try {
    await requirePermission(permission);
    return null;
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return { status: 'error', message: error.message };
    }
    throw error;
  }
}

// Seeded products use local /images paths; anything new must come from our Cloudinary folder.
const allowedImage = (url: string) =>
  url.startsWith('/images/') || isOwnUploadUrl(url, uploadFolders.catalog);

const imageError = (field: string, values: Record<string, string>): State => ({
  status: 'error',
  message: 'Please upload images with the uploader.',
  fieldErrors: { [field]: 'Please upload images with the uploader.' },
  values,
});

// Maps unique-constraint failures (slug, sku) to the field that caused them.
function uniqueError(
  error: unknown,
  values: Record<string, string>,
): State | null {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    const target = String(error.meta?.target ?? '');
    const field = target.includes('sku') ? 'sku' : 'slug';
    return {
      status: 'error',
      message: `That ${field} is already used. Please choose another.`,
      fieldErrors: { [field]: `That ${field} is already used.` },
      values,
    };
  }
  return null;
}

const rawValues = (formData: FormData) =>
  Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === 'string'),
  ) as Record<string, string>;

const isId = (id: string | null) =>
  id === null || z.uuid().safeParse(id).success;

function revalidateCatalog(adminPath: string) {
  revalidatePath(adminPath, 'layout');
  revalidatePath('/', 'layout');
}

const SAVED = { status: 'success', message: 'Saved.' } as const;

export async function saveCategory(
  id: string | null,
  _prev: CategoryState,
  formData: FormData,
): Promise<CategoryState> {
  const denied = await guard('catalog.manage');
  if (denied) return denied;
  if (!isId(id)) return SERVER_ERROR;

  const parsed = parseForm(categorySchema, formData);
  if (!parsed.success) return parsed.state;
  const { slug, ...data } = parsed.data;
  const values = rawValues(formData);
  if (data.imageUrl && !allowedImage(data.imageUrl)) {
    return imageError('imageUrl', values);
  }
  if (id && data.parentId === id) {
    return {
      status: 'error',
      message: 'A category cannot be its own parent.',
      fieldErrors: { parentId: 'Choose a different parent.' },
      values,
    };
  }

  const record = {
    ...data,
    slug: slug ?? slugify(data.name),
    parentId: data.parentId ?? null,
    imageUrl: data.imageUrl ?? null,
    description: data.description ?? null,
  };
  let savedId = id;
  try {
    if (id) {
      await prisma.category.update({ where: { id }, data: record });
    } else {
      savedId = (await prisma.category.create({ data: record })).id;
    }
  } catch (error) {
    const unique = uniqueError(error, values);
    if (unique) return unique;
    console.error('[saveCategory]', error);
    return SERVER_ERROR;
  }

  revalidateCatalog(routes.admin.categories);
  if (!id) redirect(`${routes.admin.categories}/${savedId}`);
  return SAVED;
}

export async function saveCollection(
  id: string | null,
  _prev: CollectionState,
  formData: FormData,
): Promise<CollectionState> {
  const denied = await guard('catalog.manage');
  if (denied) return denied;
  if (!isId(id)) return SERVER_ERROR;

  // Checkboxes share one name, so gather them before parseForm keeps only the last.
  const form = new FormData();
  for (const [k, v] of formData.entries())
    if (k !== 'productIds') form.append(k, v);
  form.set('productIds', formData.getAll('productIds').join(','));

  const parsed = parseForm(collectionSchema, form);
  if (!parsed.success) return parsed.state;
  const { slug, productIds, startDate, endDate, ...data } = parsed.data;
  const values = rawValues(form);
  if (data.bannerImageUrl && !allowedImage(data.bannerImageUrl)) {
    return imageError('bannerImageUrl', values);
  }

  const record = {
    ...data,
    slug: slug ?? slugify(data.name),
    description: data.description ?? null,
    bannerImageUrl: data.bannerImageUrl ?? null,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
  };
  let savedId = id;
  try {
    savedId = await prisma.$transaction(async (tx) => {
      const collection = id
        ? await tx.collection.update({ where: { id }, data: record })
        : await tx.collection.create({ data: record });
      await tx.collectionProduct.deleteMany({
        where: { collectionId: collection.id },
      });
      if (productIds.length > 0) {
        await tx.collectionProduct.createMany({
          data: productIds.map((productId, sortOrder) => ({
            collectionId: collection.id,
            productId,
            sortOrder,
          })),
        });
      }
      return collection.id;
    });
  } catch (error) {
    const unique = uniqueError(error, values);
    if (unique) return unique;
    console.error('[saveCollection]', error);
    return SERVER_ERROR;
  }

  revalidateCatalog(routes.admin.collections);
  if (!id) redirect(`${routes.admin.collections}/${savedId}`);
  return SAVED;
}

export async function saveProduct(
  id: string | null,
  _prev: ProductState,
  formData: FormData,
): Promise<ProductState> {
  const denied = await guard('products.manage');
  if (denied) return denied;
  if (!isId(id)) return SERVER_ERROR;

  const parsed = parseForm(productSchema, formData);
  if (!parsed.success) return parsed.state;
  const { slug, images, ...data } = parsed.data;
  const values = rawValues(formData);
  if (!images.every(allowedImage)) return imageError('images', values);

  const record = {
    ...data,
    slug: slug ?? slugify(data.name),
    shortDescription: data.shortDescription ?? null,
    description: data.description ?? null,
  };
  let savedId = id;
  try {
    savedId = await prisma.$transaction(async (tx) => {
      const product = id
        ? await tx.product.update({ where: { id }, data: record })
        : await tx.product.create({ data: record });
      await tx.productImage.deleteMany({ where: { productId: product.id } });
      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((imageUrl, sortOrder) => ({
            productId: product.id,
            imageUrl,
            altText: data.name,
            sortOrder,
            isPrimary: sortOrder === 0,
          })),
        });
      }
      return product.id;
    });
  } catch (error) {
    const unique = uniqueError(error, values);
    if (unique) return unique;
    console.error('[saveProduct]', error);
    return SERVER_ERROR;
  }

  revalidateCatalog(routes.admin.products);
  if (!id) redirect(`${routes.admin.products}/${savedId}`);
  return SAVED;
}

export async function saveVariant(
  productId: string,
  variantId: string | null,
  _prev: VariantState,
  formData: FormData,
): Promise<VariantState> {
  const denied = await guard('products.manage');
  if (denied) return denied;
  if (!isId(productId) || !isId(variantId)) return SERVER_ERROR;

  const parsed = parseForm(variantSchema, formData);
  if (!parsed.success) return parsed.state;
  const { quantity, salePrice, ...data } = parsed.data;
  const record = { ...data, salePrice: salePrice ?? null };

  try {
    await prisma.$transaction(async (tx) => {
      const variant = variantId
        ? await tx.productVariant.update({
            where: { id: variantId, productId },
            data: record,
          })
        : await tx.productVariant.create({ data: { ...record, productId } });
      await tx.inventory.upsert({
        where: { variantId: variant.id },
        update: { quantity },
        create: { variantId: variant.id, quantity },
      });
    });
  } catch (error) {
    const unique = uniqueError(error, rawValues(formData));
    if (unique) return unique;
    console.error('[saveVariant]', error);
    return SERVER_ERROR;
  }

  revalidateCatalog(routes.admin.products);
  return variantId ? SAVED : { status: 'success', message: 'Variant added.' };
}
