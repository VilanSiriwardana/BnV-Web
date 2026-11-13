'use client';

import { usePathname } from 'next/navigation';
import { createContext, use, useEffect, useRef, useState } from 'react';

import { isLovePath } from '@/components/layout/storefront-chrome';
import { getCartSnapshot } from '@/features/cart/actions';
import { emptyCart, type CartView } from '@/features/cart/types';

type CartContextValue = {
  cart: CartView;
  setCart: (cart: CartView) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

// Loaded after mount so cached pages stay static; the cart itself lives in the database.
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartView>(emptyCart);
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const loaded = useRef(false);

  // Skipped on the private /love pages: no shop work there.
  useEffect(() => {
    if (loaded.current || isLovePath(pathname)) return;
    loaded.current = true;
    getCartSnapshot().then(setCart, () => {});
  }, [pathname]);

  return (
    <CartContext value={{ cart, setCart, open, setOpen }}>
      {children}
    </CartContext>
  );
}

export function useCart() {
  const context = use(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
