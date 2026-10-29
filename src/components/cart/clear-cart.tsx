'use client';

import { useEffect } from 'react';

import { emptyCart } from '@/features/cart/types';

import { useCart } from './cart-provider';

export function ClearCart() {
  const { setCart } = useCart();
  useEffect(() => setCart(emptyCart), [setCart]);
  return null;
}
