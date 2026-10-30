'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NavPill, useHoverIndex } from '@/components/motion/nav-pill';
import { navItem } from '@/components/ui/styles';
import { cn } from '@/lib/utils/cn';

export type AdminNavItem = { href: string; label: string };

export function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();
  const { hovered, list, item } = useHoverIndex();
  return (
    <nav
      aria-label="Admin"
      className="flex flex-wrap gap-1 md:flex-col"
      {...list}
    >
      {items.map((navLink, i) => {
        const active =
          navLink.href === '/admin'
            ? pathname === navLink.href
            : pathname.startsWith(navLink.href);
        return (
          <Link
            key={navLink.href}
            href={navLink.href}
            aria-current={active ? 'page' : undefined}
            className={cn(navItem, 'text-small')}
            {...item(i)}
          >
            {active && (
              <NavPill
                layoutId="admin-nav-active"
                className="bg-primary-soft inset-0 rounded-md"
              />
            )}
            {hovered === i && !active && (
              <NavPill
                layoutId="admin-nav-hover"
                className="bg-primary-soft/50 inset-0 rounded-md"
              />
            )}
            {navLink.label}
          </Link>
        );
      })}
    </nav>
  );
}
