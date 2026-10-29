'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils/cn';

export type AdminNavItem = { href: string; label: string };

export function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex flex-wrap gap-1 md:flex-col">
      {items.map((item) => {
        const active =
          item.href === '/admin'
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'text-small rounded-sm px-3 py-2 font-medium transition-colors',
              active
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent/60',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
