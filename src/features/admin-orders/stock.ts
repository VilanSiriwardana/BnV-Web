import type { Prisma } from '@prisma/client';

import { orderStatusSchema, type OrderStatus } from '@/constants/statuses';

import {
  canTransition,
  quantitiesByVariant,
  statusTimestamps,
  stockEffect,
} from './transitions';

export class OrderTransitionError extends Error {}

type Tx = Pick<Prisma.TransactionClient, 'order' | 'inventory'>;

// Runs inside prisma.$transaction. The conditional updates make a double submit or an oversell abort cleanly.
export async function applyOrderStatus(
  tx: Tx,
  orderId: string,
  to: OrderStatus,
  now = new Date(),
) {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    select: {
      status: true,
      dispatchedAt: true,
      items: { select: { variantId: true, quantity: true } },
    },
  });
  if (!order) throw new OrderTransitionError('Order not found.');

  const from = orderStatusSchema.safeParse(order.status);
  if (!from.success || !canTransition(from.data, to)) {
    throw new OrderTransitionError(
      `An order cannot move from ${order.status} to ${to}.`,
    );
  }

  const moved = await tx.order.updateMany({
    where: { id: orderId, status: from.data, dispatchedAt: order.dispatchedAt },
    data: { status: to, ...statusTimestamps(to, now) },
  });
  if (moved.count !== 1) {
    throw new OrderTransitionError(
      'This order was changed by someone else. Refresh and try again.',
    );
  }

  const effect = stockEffect(to, order.dispatchedAt);
  if (effect === 'none') return effect;

  for (const [variantId, quantity] of quantitiesByVariant(order.items)) {
    if (effect === 'decrement') {
      const taken = await tx.inventory.updateMany({
        where: { variantId, quantity: { gte: quantity } },
        data: { quantity: { decrement: quantity } },
      });
      if (taken.count !== 1) {
        throw new OrderTransitionError(
          'Not enough stock to dispatch this order. Update the inventory first.',
        );
      }
    } else {
      await tx.inventory.upsert({
        where: { variantId },
        update: { quantity: { increment: quantity } },
        create: { variantId, quantity },
      });
    }
  }
  return effect;
}
