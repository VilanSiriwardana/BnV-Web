'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

// Hides the storefront header, footer and cart drawer inside /admin.
export function StorefrontChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname.startsWith('/admin') ? null : children;
}
