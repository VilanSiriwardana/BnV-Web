import { z } from 'zod';

import { productStatuses } from '@/constants/statuses';
import { optional, requiredChoice, text } from '@/lib/forms/fields';
import type { FormState } from '@/lib/forms/types';

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(120, 'Please keep the slug under 120 characters.')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Use lowercase letters, numbers and dashes.',
  );

const checkbox = z.preprocess((v) => v === 'on', z.boolean());
const nameField = z
  .string()
  .trim()
  .min(2, 'Please enter a name.')
  .max(150, 'Please keep the name under 150 characters.');
const uuid = (message: string) => z.uuid({ error: message });
const money = (label: string) =>
  z.coerce
    .number({ error: `${label} must be a number.` })
    .min(0, `${label} cannot be negative.`)
    .max(10_000_000, `${label} is too large.`);

// One URL per line from the image uploader (first = primary).
export const imageListSchema = z
  .string()
  .transform((v) =>
    v
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.string().max(500)).max(12, 'Please add up to 12 images.'));

const statusField = requiredChoice(productStatuses, 'Please choose a status.');

export const categorySchema = z.object({
  name: nameField,
  slug: optional(slugSchema),
  description: optional(text(1000, 'Description')),
  parentId: optional(uuid('Please choose a valid parent.')),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  isFeatured: checkbox,
  status: statusField,
  imageUrl: optional(z.string().trim().max(500)),
});

export const collectionSchema = z
  .object({
    name: nameField,
    slug: optional(slugSchema),
    description: optional(text(2000, 'Description')),
    status: statusField,
    bannerImageUrl: optional(z.string().trim().max(500)),
    startDate: optional(z.iso.date('Please choose a valid date.')),
    endDate: optional(z.iso.date('Please choose a valid date.')),
    productIds: z
      .string()
      .default('')
      .transform((v) => v.split(',').filter(Boolean))
      .pipe(z.array(z.uuid()).max(500)),
  })
  .refine((v) => !v.startDate || !v.endDate || v.endDate >= v.startDate, {
    message: 'The end date must be after the start date.',
    path: ['endDate'],
  });

export const productSchema = z.object({
  name: nameField,
  slug: optional(slugSchema),
  sku: z
    .string()
    .trim()
    .min(2, 'Please enter a SKU.')
    .max(60, 'Please keep the SKU under 60 characters.'),
  shortDescription: optional(text(300, 'Short description')),
  description: optional(text(5000, 'Description')),
  categoryId: uuid('Please choose a category.'),
  brandId: uuid('Please choose a brand.'),
  status: statusField,
  isFeatured: checkbox,
  images: imageListSchema.default([]),
});

export const variantSchema = z
  .object({
    name: z.string().trim().min(1, 'Please name the variant.').max(100),
    sku: z.string().trim().min(2, 'Please enter a SKU.').max(60),
    price: money('Price'),
    salePrice: optional(money('Sale price')),
    quantity: z.coerce
      .number()
      .int('Stock must be a whole number.')
      .min(0)
      .max(100_000),
    status: statusField,
  })
  .refine((v) => v.salePrice == null || v.salePrice < v.price, {
    message: 'The sale price must be lower than the price.',
    path: ['salePrice'],
  });

export type CategoryState = FormState<keyof z.input<typeof categorySchema>>;
export type CollectionState = FormState<keyof z.input<typeof collectionSchema>>;
export type ProductState = FormState<keyof z.input<typeof productSchema>>;
export type VariantState = FormState<keyof z.input<typeof variantSchema>>;
