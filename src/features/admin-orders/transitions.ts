import type { OrderStatus } from '@/constants/statuses';

// Allowed admin moves (D-04). Stock leaves at dispatch (shipped) and returns on a later cancel (ADR-0020, ADR-0021).
export const orderTransitions: Record<OrderStatus, readonly OrderStatus[]> = {
  inquiry_received: ['pending_confirmation', 'confirmed', 'cancelled'],
  pending_confirmation: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

export function canTransition(from: string, to: string) {
  return (
    from in orderTransitions &&
    orderTransitions[from as OrderStatus].includes(to as OrderStatus)
  );
}

export type StockEffect = 'decrement' | 'restock' | 'none';

export function stockEffect(
  to: OrderStatus,
  dispatchedAt: Date | null,
): StockEffect {
  if (to === 'shipped' && !dispatchedAt) return 'decrement';
  if (to === 'cancelled' && dispatchedAt) return 'restock';
  return 'none';
}

export function statusTimestamps(to: OrderStatus, now: Date) {
  switch (to) {
    case 'confirmed':
      return { confirmedAt: now };
    case 'shipped':
      return { dispatchedAt: now };
    case 'delivered':
      return { completedAt: now };
    case 'cancelled':
      return { cancelledAt: now };
    default:
      return {};
  }
}

// Sums quantities per variant so one order line per variant is decremented once.
export function quantitiesByVariant(
  items: { variantId: string; quantity: number }[],
) {
  const totals = new Map<string, number>();
  for (const item of items) {
    totals.set(
      item.variantId,
      (totals.get(item.variantId) ?? 0) + item.quantity,
    );
  }
  return totals;
}
