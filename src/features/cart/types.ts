export type CartLineView = {
  id: string;
  productName: string;
  productSlug: string;
  variantName: string;
  imageUrl: string | null;
  options: [string, string][];
  unitPriceLkr: number;
  lineTotalLkr: number;
  quantity: number;
  maxQuantity: number;
  available: boolean;
};

export type CartView = {
  lines: CartLineView[];
  count: number;
  subtotalLkr: number;
  hasUnavailable: boolean;
};

export const emptyCart: CartView = {
  lines: [],
  count: 0,
  subtotalLkr: 0,
  hasUnavailable: false,
};
