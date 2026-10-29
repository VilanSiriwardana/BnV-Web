/* eslint-disable @typescript-eslint/no-explicit-any -- loose fake of the Prisma transaction client */
import { describe, expect, it } from 'vitest';

import { applyOrderStatus, OrderTransitionError } from './stock';
import { canTransition, stockEffect } from './transitions';

describe('order transitions', () => {
  it('allows the forward path and blocks skips and terminal moves', () => {
    expect(canTransition('preparing', 'shipped')).toBe(true);
    expect(canTransition('inquiry_received', 'shipped')).toBe(false);
    expect(canTransition('delivered', 'cancelled')).toBe(false);
    expect(canTransition('cancelled', 'confirmed')).toBe(false);
    expect(canTransition('nonsense', 'confirmed')).toBe(false);
  });

  it('decrements once at dispatch and restocks only after dispatch', () => {
    expect(stockEffect('shipped', null)).toBe('decrement');
    expect(stockEffect('shipped', new Date())).toBe('none');
    expect(stockEffect('cancelled', null)).toBe('none');
    expect(stockEffect('cancelled', new Date())).toBe('restock');
  });
});

// In-memory stand-in for the two Prisma delegates applyOrderStatus uses.
function fakeTx(status: string, stock: number, quantity = 1) {
  const order = {
    status,
    dispatchedAt: null as Date | null,
    items: [{ variantId: 'v1', quantity }],
  };
  const inventory = { quantity: stock };
  const tx = {
    order: {
      findUnique: async () => ({ ...order }),
      updateMany: async ({ where, data }: any) => {
        if (
          where.status !== order.status ||
          where.dispatchedAt !== order.dispatchedAt
        ) {
          return { count: 0 };
        }
        Object.assign(order, data);
        return { count: 1 };
      },
    },
    inventory: {
      updateMany: async ({ where, data }: any) => {
        if (inventory.quantity < where.quantity.gte) return { count: 0 };
        inventory.quantity -= data.quantity.decrement;
        return { count: 1 };
      },
      upsert: async ({ update }: any) => {
        inventory.quantity += update.quantity.increment;
        return {};
      },
    },
  };
  return { tx: tx as any, order, inventory };
}

describe('applyOrderStatus', () => {
  it('dispatch takes stock and cancel puts it back', async () => {
    const { tx, order, inventory } = fakeTx('preparing', 2);
    await applyOrderStatus(tx, 'o1', 'shipped');
    expect(inventory.quantity).toBe(1);
    expect(order.dispatchedAt).toBeInstanceOf(Date);

    await expect(applyOrderStatus(tx, 'o1', 'shipped')).rejects.toThrow(
      OrderTransitionError,
    );
    expect(inventory.quantity).toBe(1);

    await applyOrderStatus(tx, 'o1', 'cancelled');
    expect(inventory.quantity).toBe(2);
  });

  it('refuses to dispatch more than is in stock', async () => {
    const { tx, inventory } = fakeTx('preparing', 1, 3);
    await expect(applyOrderStatus(tx, 'o1', 'shipped')).rejects.toThrow(
      /Not enough stock/,
    );
    expect(inventory.quantity).toBe(1);
  });
});
