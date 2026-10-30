'use client';

import { Minus, Plus, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { FormMessage } from '@/components/ui/field-error';
import { imageSizes } from '@/config/images';
import { routes } from '@/config/routes';
import {
  removeCartItem,
  updateCartItemQuantity,
  type CartActionResult,
} from '@/features/cart/actions';
import type { CartView } from '@/features/cart/types';
import { cn, formatLkr } from '@/lib/utils';
import { blurFor } from '@/lib/utils/image';

import { useCart } from './cart-provider';

type Props = {
  initial?: CartView;
  onNavigate?: () => void;
  className?: string;
};

export function CartContents({ initial, onNavigate, className }: Props) {
  const { cart, setCart } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (initial) setCart(initial);
  }, [initial, setCart]);

  const run = (action: () => Promise<CartActionResult>) =>
    startTransition(async () => {
      const result = await action();
      if (result.cart) setCart(result.cart);
      setError(result.ok ? undefined : result.message);
    });

  if (cart.lines.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center gap-4 py-12 text-center',
          className,
        )}
      >
        <p className="font-display text-h4">Your bag is empty.</p>
        <Link
          href={routes.shop}
          onClick={onNavigate}
          className={buttonVariants({ variant: 'outline' })}
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} aria-busy={pending}>
      <ul className="divide-border divide-y">
        {cart.lines.map((line) => (
          <li key={line.id} className="flex gap-4 py-4">
            <Link
              href={routes.product(line.productSlug)}
              onClick={onNavigate}
              className="bg-muted relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-md"
            >
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
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={routes.product(line.productSlug)}
                  onClick={onNavigate}
                  className="text-small font-semibold hover:underline"
                >
                  {line.productName}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${line.productName}`}
                  disabled={pending}
                  onClick={() => run(() => removeCartItem(line.id))}
                  className="-mt-2 -mr-2 size-8"
                >
                  <X />
                </Button>
              </div>
              {line.options.length > 0 && (
                <p className="text-caption text-muted-foreground">
                  {line.options.map(([k, v]) => `${k}: ${v}`).join(' · ')}
                </p>
              )}
              {!line.available && (
                <p className="text-caption text-destructive">
                  No longer available in this quantity.
                </p>
              )}
              <div className="mt-auto flex items-center justify-between gap-2">
                <div className="border-border flex items-center rounded-md border">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Decrease quantity"
                    disabled={pending || line.quantity <= 1}
                    onClick={() =>
                      run(() =>
                        updateCartItemQuantity(line.id, line.quantity - 1),
                      )
                    }
                    className="size-8"
                  >
                    <Minus />
                  </Button>
                  <span className="text-small w-8 text-center tabular-nums">
                    {line.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Increase quantity"
                    disabled={pending || line.quantity >= line.maxQuantity}
                    onClick={() =>
                      run(() =>
                        updateCartItemQuantity(line.id, line.quantity + 1),
                      )
                    }
                    className="size-8"
                  >
                    <Plus />
                  </Button>
                </div>
                <p className="text-small font-sans font-semibold tabular-nums">
                  {formatLkr(line.lineTotalLkr)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <dl className="text-small flex flex-col gap-2 font-sans">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="font-semibold tabular-nums">
            {formatLkr(cart.subtotalLkr)}
          </dd>
        </div>
        <div className="text-muted-foreground flex justify-between gap-4">
          <dt>Delivery</dt>
          <dd className="text-right">Delivery fee confirmed on WhatsApp</dd>
        </div>
      </dl>

      {error && <FormMessage status="error" message={error} />}

      <div className="flex flex-col gap-2">
        {cart.hasUnavailable ? (
          <p className="text-small text-destructive">
            Please remove unavailable items before checkout.
          </p>
        ) : (
          <Link
            href={routes.checkout}
            onClick={onNavigate}
            className={buttonVariants({ size: 'lg' })}
          >
            Checkout
          </Link>
        )}
        <Link
          href={routes.shop}
          onClick={onNavigate}
          className={buttonVariants({ variant: 'link' })}
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
