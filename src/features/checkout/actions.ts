'use server';

import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { routes } from '@/config/routes';
import {
  buildOrderItemSnapshot,
  cartTotals,
  generateOrderNumber,
} from '@/features/cart/pricing';
import { getActiveCart, priceCartLines } from '@/features/cart/queries';
import { clearCartToken } from '@/features/cart/session';
import { provinceForDistrict } from '@/data/sri-lanka-districts';
import { prisma } from '@/lib/prisma';

import {
  buildOrderNotes,
  checkoutSchema,
  type CheckoutField,
  type CheckoutInput,
  type CheckoutState,
} from './schema';

const FIELDS = Object.keys(checkoutSchema.shape) as CheckoutField[];
const ORDER_NUMBER_ATTEMPTS = 3;

const uniqueTarget = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2002'
    ? String(error.meta?.target ?? '')
    : null;

async function subscribeFromCheckout(email: string) {
  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
    select: { status: true },
  });
  if (existing?.status === 'active') return;
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: { status: 'active', unsubscribedAt: null },
    create: { email, source: 'checkout', status: 'active' },
  });
}

async function createOrder(input: CheckoutInput) {
  const cart = await getActiveCart();
  if (!cart || cart.items.length === 0) return { error: 'empty' as const };

  const priced = priceCartLines(cart);
  if (priced.some((line) => !line.available)) {
    return { error: 'unavailable' as const };
  }

  const lines = priced.map(({ item, unitPrice }) => ({ ...item, unitPrice }));
  const { subtotal, shipping, total } = cartTotals(lines);

  for (let attempt = 1; ; attempt++) {
    const orderNumber = generateOrderNumber();
    try {
      await prisma.$transaction(async (tx) => {
        await tx.order.create({
          data: {
            orderNumber,
            cartId: cart.id,
            customerName: input.name,
            customerEmail: input.email,
            customerPhone: input.phone,
            addressLine1: input.addressLine1,
            addressLine2: input.addressLine2 || null,
            city: input.city,
            district: input.district,
            province: provinceForDistrict(input.district),
            postalCode: input.postalCode || null,
            subtotal,
            shippingAmount: shipping,
            grandTotal: total,
            paymentMethod: input.paymentMethod,
            paymentStatus: 'pending',
            status: 'inquiry_received',
            notes: buildOrderNotes(input),
            items: { create: lines.map(buildOrderItemSnapshot) },
            payments: {
              create: {
                provider: 'manual',
                method: input.paymentMethod,
                amount: total,
                status: 'pending',
              },
            },
          },
        });
        await tx.cart.update({
          where: { id: cart.id },
          data: { status: 'converted' },
        });
      });
      return { orderNumber };
    } catch (error) {
      const target = uniqueTarget(error);
      if (target?.includes('cart_id')) {
        const existing = await prisma.order.findUnique({
          where: { cartId: cart.id },
          select: { orderNumber: true },
        });
        if (existing) return { orderNumber: existing.orderNumber };
      }
      if (target?.includes('order_number') && attempt < ORDER_NUMBER_ATTEMPTS) {
        continue;
      }
      throw error;
    }
  }
}

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const raw = Object.fromEntries(
    FIELDS.map((field) => [field, formData.get(field) ?? undefined]),
  );
  const values = Object.fromEntries(
    Object.entries(raw).filter(([, v]) => typeof v === 'string'),
  ) as CheckoutState['values'];

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      status: 'error',
      values,
      message: 'Please check the highlighted fields.',
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]]),
      ),
    };
  }

  let orderNumber: string;
  try {
    const result = await createOrder(parsed.data);
    if ('error' in result) {
      return {
        status: 'error',
        values,
        message:
          result.error === 'empty'
            ? 'Your bag is empty. Add a piece before checking out.'
            : 'Some items in your bag are no longer available. Please review your bag.',
      };
    }
    orderNumber = result.orderNumber;
  } catch (error) {
    console.error('[placeOrder]', error);
    return {
      status: 'error',
      values,
      message: 'Something went wrong on our side. Please try again shortly.',
    };
  }

  await clearCartToken();
  if (parsed.data.marketing) {
    await subscribeFromCheckout(parsed.data.email).catch((error) =>
      console.error('[placeOrder:newsletter]', error),
    );
  }
  redirect(
    `${routes.checkoutSuccess}?order=${encodeURIComponent(orderNumber)}`,
  );
}
