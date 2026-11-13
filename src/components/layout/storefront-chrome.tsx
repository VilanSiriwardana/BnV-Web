'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export const isLovePath = (pathname: string) =>
  pathname === '/love' || pathname.startsWith('/love/');

// Hides the storefront header, footer, cart drawer, consent and analytics inside /admin and the private /love pages.
export function StorefrontChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname.startsWith('/admin') || isLovePath(pathname)
    ? null
    : children;
}
