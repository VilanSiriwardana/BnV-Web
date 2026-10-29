'use client';

import Link from 'next/link';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { routes } from '@/config/routes';

import { CartContents } from './cart-contents';
import { useCart } from './cart-provider';

export function CartDrawer() {
  const { cart, open, setOpen } = useCart();
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            Your bag{cart.count > 0 && ` (${cart.count})`}
          </SheetTitle>
          <Link
            href={routes.cart}
            onClick={close}
            className="text-small text-muted-foreground w-fit hover:underline"
          >
            View full bag
          </Link>
        </SheetHeader>
        <CartContents
          onNavigate={close}
          className="overflow-y-auto px-4 pb-6"
        />
      </SheetContent>
    </Sheet>
  );
}
