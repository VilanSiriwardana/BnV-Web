import type { Metadata } from 'next';

import { CartContents } from '@/components/cart/cart-contents';
import { routes } from '@/config/routes';
import { getCartView } from '@/features/cart/queries';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Cart',
  description: 'Review the pieces in your bag before checkout.',
  path: routes.cart,
  noindex: true,
});

export default async function CartPage() {
  const cart = await getCartView();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-16">
      <h1 className="font-display text-h2 mb-6">Your bag</h1>
      <CartContents initial={cart} />
    </div>
  );
}
