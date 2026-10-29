import { Prisma } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import {
  buildOrderItemSnapshot,
  cartTotals,
  generateOrderNumber,
  sameOptions,
  unitPriceOf,
} from './pricing';

const d = (n: number | string) => new Prisma.Decimal(n);

describe('pricing', () => {
  it('prefers the sale price', () => {
    expect(unitPriceOf({ price: d(5000), salePrice: d(4200) }).toNumber()).toBe(
      4200,
    );
    expect(unitPriceOf({ price: d(5000), salePrice: null }).toNumber()).toBe(
      5000,
    );
  });

  it('totals lines without float drift and with zero delivery', () => {
    const totals = cartTotals([
      { unitPrice: d('1999.99'), quantity: 3 },
      { unitPrice: d('0.01'), quantity: 1 },
    ]);
    expect(totals.subtotal.toFixed(2)).toBe('5999.98');
    expect(totals.shipping.toNumber()).toBe(0);
    expect(totals.total.toFixed(2)).toBe('5999.98');
  });

  it('matches selected options regardless of key order', () => {
    expect(
      sameOptions({ Size: 'M', Colour: 'Red' }, { Colour: 'Red', Size: 'M' }),
    ).toBe(true);
    expect(sameOptions({ Size: 'M' }, { Size: 'L' })).toBe(false);
    expect(sameOptions(null, {})).toBe(true);
  });

  it('builds an order item snapshot', () => {
    const snapshot = buildOrderItemSnapshot({
      productId: 'p',
      variantId: 'v',
      productName: 'Silk Dress',
      productSlug: 'silk-dress',
      sku: 'SD-M',
      imageUrl: null,
      unitPrice: d(4500),
      quantity: 2,
      selectedOptions: { Size: 'M' },
      personalization: null,
    });
    expect(snapshot.lineTotal.toNumber()).toBe(9000);
    expect(snapshot.selectedOptions).toEqual({ Size: 'M' });
    expect(snapshot.personalization).toBe(Prisma.JsonNull);
  });

  it('formats order numbers', () => {
    const n = generateOrderNumber(new Date('2026-10-29T10:00:00Z'), () => 0);
    expect(n).toBe('BNV-261029-AAAA');
    expect(generateOrderNumber()).toMatch(/^BNV-\d{6}-[A-Z2-9]{4}$/);
  });
});
