import { z } from 'zod';

import { commerce } from '@/config/commerce';

const quantity = z.number().int().min(1).max(commerce.maxLineQuantity);

export const addToCartSchema = z.object({
  variantId: z.uuid(),
  quantity,
  selectedOptions: z
    .record(z.string().max(50), z.string().max(100))
    .refine((o) => Object.keys(o).length <= 5),
});
export type AddToCartInput = z.infer<typeof addToCartSchema>;

export const updateQuantitySchema = z.object({
  itemId: z.uuid(),
  quantity,
});
