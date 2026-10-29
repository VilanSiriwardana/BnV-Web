'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { commerce } from '@/config/commerce';
import { routes } from '@/config/routes';
import { availableQuantity } from '@/features/catalog/variants';
import { prisma } from '@/lib/prisma';

import { cartTotals, sameOptions, unitPriceOf } from './pricing';
import {
  cartInclude,
  findActiveCart,
  getActiveCart,
  getCartView,
  priceCartLines,
  toCartView,
} from './queries';
import { addToCartSchema, updateQuantitySchema } from './schema';
import { ensureCartToken } from './session';
import type { CartView } from './types';

export type CartActionResult =
  | { ok: true; cart: CartView }
  | { ok: false; message: string; cart?: CartView };

const GENERIC_ERROR = 'Something went wrong on our side. Please try again.';

async function syncCartTotals(cartId: string) {
  const cart = await prisma.cart.findUniqueOrThrow({
    where: { id: cartId },
    include: cartInclude,
  });
  const { subtotal, shipping, total } = cartTotals(
    priceCartLines(cart).map(({ item, unitPrice }) => ({
      unitPrice,
      quantity: item.quantity,
    })),
  );
  await prisma.cart.update({
    where: { id: cartId },
    data: { subtotal, shippingAmount: shipping, totalAmount: total },
  });
}

export async function getCartSnapshot(): Promise<CartView> {
  return getCartView();
}

export async function addToCart(input: unknown): Promise<CartActionResult> {
  const parsed = addToCartSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'Please choose your options and quantity.' };
  }
  const { variantId, quantity, selectedOptions } = parsed.data;

  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: {
        id: true,
        sku: true,
        price: true,
        salePrice: true,
        status: true,
        inventory: { select: { quantity: true, reservedQuantity: true } },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            images: {
              orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
              take: 1,
              select: { imageUrl: true },
            },
          },
        },
      },
    });

    if (!variant || variant.product.status !== 'active') {
      return { ok: false, message: 'This piece is no longer available.' };
    }
    const stock = availableQuantity(variant);
    if (stock === 0) {
      return { ok: false, message: 'This option has just sold out.' };
    }

    const token = await ensureCartToken();
    const cart =
      (await findActiveCart(token)) ??
      (await prisma.cart.create({
        data: { guestToken: token },
        include: { items: true },
      }));

    const existing = cart.items.find(
      (i) =>
        i.variantId === variantId &&
        sameOptions(i.selectedOptions, selectedOptions),
    );
    const nextQuantity = (existing?.quantity ?? 0) + quantity;
    const limit = Math.min(commerce.maxLineQuantity, stock);
    if (nextQuantity > limit) {
      return {
        ok: false,
        message: `Only ${limit} of this option can be added to your bag.`,
      };
    }

    const unitPrice = unitPriceOf(variant);
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: nextQuantity,
          unitPrice,
          lineTotal: unitPrice.mul(nextQuantity),
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: variant.product.id,
          variantId,
          productName: variant.product.name,
          productSlug: variant.product.slug,
          sku: variant.sku,
          imageUrl: variant.product.images[0]?.imageUrl ?? null,
          unitPrice,
          quantity,
          lineTotal: unitPrice.mul(quantity),
          selectedOptions: selectedOptions as Prisma.InputJsonObject,
        },
      });
    }

    await syncCartTotals(cart.id);
    revalidatePath(routes.cart);
    return { ok: true, cart: toCartView(await findActiveCart(token)) };
  } catch (error) {
    console.error('[addToCart]', error);
    return { ok: false, message: GENERIC_ERROR };
  }
}

async function ownedItem(itemId: string) {
  const cart = await getActiveCart();
  return cart?.items.find((i) => i.id === itemId) ? cart : null;
}

export async function updateCartItemQuantity(
  itemId: string,
  quantity: number,
): Promise<CartActionResult> {
  const parsed = updateQuantitySchema.safeParse({ itemId, quantity });
  if (!parsed.success) return { ok: false, message: 'Invalid quantity.' };

  try {
    const cart = await ownedItem(itemId);
    if (!cart)
      return { ok: false, message: 'That item is no longer in your bag.' };
    const item = cart.items.find((i) => i.id === itemId)!;
    if (parsed.data.quantity > availableQuantity(item.variant)) {
      return {
        ok: false,
        message: 'Not enough stock for that quantity.',
        cart: toCartView(cart),
      };
    }
    await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity: parsed.data.quantity,
        lineTotal: item.unitPrice.mul(parsed.data.quantity),
      },
    });
    await syncCartTotals(cart.id);
    revalidatePath(routes.cart);
    return { ok: true, cart: await getCartView() };
  } catch (error) {
    console.error('[updateCartItemQuantity]', error);
    return { ok: false, message: GENERIC_ERROR };
  }
}

export async function removeCartItem(
  itemId: string,
): Promise<CartActionResult> {
  try {
    const cart = await ownedItem(itemId);
    if (!cart) return { ok: true, cart: await getCartView() };
    await prisma.cartItem.delete({ where: { id: itemId } });
    await syncCartTotals(cart.id);
    revalidatePath(routes.cart);
    return { ok: true, cart: await getCartView() };
  } catch (error) {
    console.error('[removeCartItem]', error);
    return { ok: false, message: GENERIC_ERROR };
  }
}
