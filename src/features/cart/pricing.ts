import { Prisma } from '@prisma/client';

type PricedVariant = {
  price: Prisma.Decimal;
  salePrice: Prisma.Decimal | null;
};

type Line = { unitPrice: Prisma.Decimal; quantity: number };

export const unitPriceOf = (v: PricedVariant) => v.salePrice ?? v.price;

export const lineTotal = (line: Line) => line.unitPrice.mul(line.quantity);

// Delivery fee is confirmed on WhatsApp until the owner's fee table is CONFIRMED (UX-Spec §1.3).
export function cartTotals(lines: Line[]) {
  const subtotal = lines.reduce(
    (sum, line) => sum.add(lineTotal(line)),
    new Prisma.Decimal(0),
  );
  const shipping = new Prisma.Decimal(0);
  return { subtotal, shipping, total: subtotal.add(shipping) };
}

export const cartCount = (lines: { quantity: number }[]) =>
  lines.reduce((sum, line) => sum + line.quantity, 0);

export const sameOptions = (a: unknown, b: Record<string, string>) => {
  const left = (a ?? {}) as Record<string, string>;
  const keys = Object.keys(b);
  return (
    Object.keys(left).length === keys.length &&
    keys.every((k) => left[k] === b[k])
  );
};

type CartLine = Line & {
  productId: string;
  variantId: string;
  productName: string;
  productSlug: string;
  sku: string;
  imageUrl: string | null;
  selectedOptions: Prisma.JsonValue;
  personalization: Prisma.JsonValue;
};

export function buildOrderItemSnapshot(line: CartLine) {
  return {
    productId: line.productId,
    variantId: line.variantId,
    productName: line.productName,
    productSlug: line.productSlug,
    sku: line.sku,
    imageUrl: line.imageUrl,
    unitPrice: line.unitPrice,
    quantity: line.quantity,
    lineTotal: lineTotal(line),
    selectedOptions: line.selectedOptions ?? Prisma.JsonNull,
    personalization: line.personalization ?? Prisma.JsonNull,
  };
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateOrderNumber(date = new Date(), random = Math.random) {
  const ymd = date.toISOString().slice(2, 10).replaceAll('-', '');
  const suffix = Array.from(
    { length: 4 },
    () => ALPHABET[Math.floor(random() * ALPHABET.length)],
  ).join('');
  return `BNV-${ymd}-${suffix}`;
}
