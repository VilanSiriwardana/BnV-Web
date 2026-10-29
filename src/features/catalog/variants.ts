type StockRow = {
  status: string;
  inventory: {
    quantity: number;
    reservedQuantity: number;
    lowStockThreshold?: number;
  } | null;
};

export const availableQuantity = (v: StockRow) =>
  v.status === 'active' && v.inventory
    ? Math.max(0, v.inventory.quantity - v.inventory.reservedQuantity)
    : 0;

export const isVariantAvailable = (v: StockRow) => availableQuantity(v) > 0;

export const isLowStock = (v: StockRow) => {
  const qty = availableQuantity(v);
  return qty > 0 && qty <= (v.inventory?.lowStockThreshold ?? 0);
};

// UX-Spec §9.1: Phase 1 variants carry their options in the name, e.g. "M / Lavender".
export const parseVariantOptions = (name: string) =>
  name.split(' / ').map((part) => part.trim());

const AXES: Record<string, string[]> = {
  women: ['Size', 'Color'],
  men: ['Size', 'Color'],
  'jewelry-rings': ['Ring size', 'Metal finish'],
  couples: ['Set size', 'Color'],
};

export function optionAxisLabels(
  categorySlug: string,
  pillarSlug: string | null,
  count: number,
) {
  const labels = AXES[categorySlug] ?? AXES[pillarSlug ?? ''] ?? [];
  return Array.from({ length: count }, (_, i) => labels[i] ?? 'Option');
}
