'use client';

import { ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useCart } from './cart-provider';

export function CartButton() {
  const { cart, setOpen } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={cart.count > 0 ? `Open bag, ${cart.count} items` : 'Open bag'}
      onClick={() => setOpen(true)}
      className="relative"
    >
      <ShoppingBag />
      {cart.count > 0 && (
        <span
          aria-hidden
          className="bg-primary text-primary-foreground text-caption absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full font-semibold tabular-nums"
        >
          {cart.count > 9 ? '9+' : cart.count}
        </span>
      )}
    </Button>
  );
}
