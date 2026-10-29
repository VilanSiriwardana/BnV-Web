import type { Prisma } from '@prisma/client';

import { commerce } from '@/config/commerce';
import { availableQuantity } from '@/features/catalog/variants';
import { prisma } from '@/lib/prisma';

import { cartCount, cartTotals, lineTotal, unitPriceOf } from './pricing';
import { getCartToken } from './session';
import { emptyCart, type CartView } from './types';

export const cartInclude = {
  items: {
    orderBy: { createdAt: 'asc' },
    include: {
      product: { select: { status: true } },
      variant: {
        select: {
          name: true,
          price: true,
          salePrice: true,
          status: true,
          inventory: { select: { quantity: true, reservedQuantity: true } },
        },
      },
    },
  },
} satisfies Prisma.CartInclude;

export type CartWithItems = Prisma.CartGetPayload<{
  include: typeof cartInclude;
}>;

export async function findActiveCart(token: string | null) {
  if (!token) return null;
  return prisma.cart.findFirst({
    where: { guestToken: token, status: 'active' },
    orderBy: { createdAt: 'desc' },
    include: cartInclude,
  });
}

export async function getActiveCart() {
  return findActiveCart(await getCartToken());
}

// Prices come from the live variant so the cart always shows what checkout will charge.
export function priceCartLines(cart: CartWithItems) {
  return cart.items.map((item) => {
    const stock = availableQuantity(item.variant);
    return {
      item,
      unitPrice: unitPriceOf(item.variant),
      stock,
      available: item.product.status === 'active' && stock >= item.quantity,
    };
  });
}

export function toCartView(cart: CartWithItems | null): CartView {
  if (!cart) return emptyCart;
  const priced = priceCartLines(cart);
  const lines = priced.map(({ item, unitPrice, stock, available }) => ({
    id: item.id,
    productName: item.productName,
    productSlug: item.productSlug,
    variantName: item.variant.name,
    imageUrl: item.imageUrl,
    options: Object.entries(
      (item.selectedOptions ?? {}) as Record<string, string>,
    ),
    unitPriceLkr: unitPrice.toNumber(),
    lineTotalLkr: lineTotal({ unitPrice, quantity: item.quantity }).toNumber(),
    quantity: item.quantity,
    maxQuantity: Math.max(1, Math.min(commerce.maxLineQuantity, stock)),
    available,
  }));
  return {
    lines,
    count: cartCount(lines),
    subtotalLkr: cartTotals(
      priced.map(({ item, unitPrice }) => ({
        unitPrice,
        quantity: item.quantity,
      })),
    ).subtotal.toNumber(),
    hasUnavailable: lines.some((l) => !l.available),
  };
}

export async function getCartView() {
  return toCartView(await getActiveCart());
}
