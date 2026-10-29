import { z } from 'zod';

export const shopSorts = ['newest', 'price-asc', 'price-desc'] as const;
export type ShopSort = (typeof shopSorts)[number];

const optionalText = z
  .string()
  .regex(/^[a-z0-9-]+$/)
  .optional()
  .catch(undefined);
const optionalPrice = z.coerce
  .number()
  .int()
  .min(0)
  .optional()
  .catch(undefined);

export const shopParamsSchema = z.object({
  category: optionalText,
  collection: optionalText,
  minPrice: optionalPrice,
  maxPrice: optionalPrice,
  inStock: z
    .literal('1')
    .transform(() => true)
    .optional()
    .catch(undefined),
  sort: z.enum(shopSorts).catch('newest'),
});

export type ShopParams = z.infer<typeof shopParamsSchema>;

type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseShopParams(raw: RawSearchParams): ShopParams {
  const first = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [
      k,
      Array.isArray(v) ? v[0] : v || undefined,
    ]),
  );
  return shopParamsSchema.parse(first);
}

export const hasShopFilters = (p: ShopParams) =>
  Boolean(
    p.category ||
    p.collection ||
    p.minPrice !== undefined ||
    p.maxPrice !== undefined ||
    p.inStock,
  );
