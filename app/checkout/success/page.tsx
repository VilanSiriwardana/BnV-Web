import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ClearCart } from '@/components/cart/clear-cart';
import { buttonVariants } from '@/components/ui/button';
import { whatsappUrl } from '@/config/brand';
import { routes } from '@/config/routes';
import { CopyOrderNumber } from '@/features/checkout/copy-order-number';
import { prisma } from '@/lib/prisma';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Order received',
  path: routes.checkoutSuccess,
  noindex: true,
});

const nextSteps = {
  cod: 'We will call or WhatsApp you to confirm before dispatch.',
  bank_transfer:
    'We will send our bank details on WhatsApp. Your order is prepared once the transfer is confirmed.',
} as const;

type Props = { searchParams: Promise<{ order?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;
  if (!order) notFound();

  const found = await prisma.order.findUnique({
    where: { orderNumber: order },
    select: { orderNumber: true, paymentMethod: true },
  });
  if (!found) notFound();

  const whatsappHref = whatsappUrl(
    `Hi B&V, I just placed order ${found.orderNumber}. Could you confirm it for me?`,
  );
  const step =
    nextSteps[found.paymentMethod as keyof typeof nextSteps] ?? nextSteps.cod;

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-16 text-center md:py-24">
      <p className="text-small text-muted-foreground tracking-wide uppercase">
        Thank you
      </p>
      <h1 className="font-display text-h2">We have your order</h1>
      <ClearCart />
      <CopyOrderNumber orderNumber={found.orderNumber} />
      <div>
        <h2 className="font-display text-h4 mb-2">What happens next</h2>
        <p className="text-muted-foreground">{step}</p>
      </div>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'whatsapp', size: 'lg' })}
          >
            Confirm on WhatsApp
          </a>
        )}
        <Link
          href={routes.shop}
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
