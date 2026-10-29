import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { imageSizes } from '@/config/images';
import { routes } from '@/config/routes';
import { getCartView } from '@/features/cart/queries';
import { CheckoutForm } from '@/features/checkout/checkout-form';
import { pageMetadata } from '@/lib/seo/metadata';
import { formatLkr } from '@/lib/utils';
import { blurFor } from '@/lib/utils/image';

export const metadata: Metadata = pageMetadata({
  title: 'Checkout',
  description: 'Place your B&V order inquiry.',
  path: routes.checkout,
  noindex: true,
});

export default async function CheckoutPage() {
  const cart = await getCartView();
  if (cart.lines.length === 0 || cart.hasUnavailable) redirect(routes.cart);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:px-8 md:py-16 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="font-display text-h2 mb-2">Checkout</h1>
        <p className="text-small text-muted-foreground mb-8">
          No payment is taken now. We confirm every order with you on WhatsApp
          or by phone.
        </p>
        <CheckoutForm />
      </div>

      <aside className="bg-muted/40 h-fit rounded-md p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-h4 mb-4">Order summary</h2>
        <ul className="divide-border divide-y">
          {cart.lines.map((line) => (
            <li key={line.id} className="flex gap-3 py-3">
              <div className="bg-muted relative aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-md">
                {line.imageUrl && (
                  <Image
                    src={line.imageUrl}
                    alt={line.productName}
                    fill
                    sizes={imageSizes.cartThumb}
                    {...blurFor(line.imageUrl)}
                    className="object-cover"
                  />
                )}
              </div>
              <div className="text-small flex min-w-0 flex-1 flex-col">
                <span className="font-semibold">{line.productName}</span>
                {line.options.length > 0 && (
                  <span className="text-caption text-muted-foreground">
                    {line.options.map(([k, v]) => `${k}: ${v}`).join(' · ')}
                  </span>
                )}
                <span className="text-caption text-muted-foreground">
                  Qty {line.quantity}
                </span>
              </div>
              <span className="text-small font-semibold tabular-nums">
                {formatLkr(line.lineTotalLkr)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="text-small border-border mt-4 flex flex-col gap-2 border-t pt-4">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatLkr(cart.subtotalLkr)}</dd>
          </div>
          <div className="text-muted-foreground flex justify-between gap-4">
            <dt>Delivery</dt>
            <dd className="text-right">Delivery fee confirmed on WhatsApp</dd>
          </div>
          <div className="flex justify-between font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatLkr(cart.subtotalLkr)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
