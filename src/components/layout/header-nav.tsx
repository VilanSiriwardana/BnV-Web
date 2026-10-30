'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NavPill, useHoverIndex } from '@/components/motion/nav-pill';
import { mainNav } from '@/config/navigation';
import { cn } from '@/lib/utils/cn';

// A gold underline glides to the hovered link and rests on the current section.
export function HeaderNav() {
  const pathname = usePathname();
  const { hovered, list, item } = useHoverIndex();
  const active = mainNav.findIndex((l) =>
    l.href === '/' ? pathname === '/' : pathname.startsWith(l.href),
  );
  const target = hovered ?? active;

  return (
    <nav aria-label="Main" className="mx-auto hidden lg:block">
      <ul className="flex items-center gap-1 font-sans" {...list}>
        {mainNav.map((link, i) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={i === active ? 'page' : undefined}
              className={cn(
                'text-small focus-ring relative isolate block rounded-sm px-2.5 py-2 font-medium transition-colors duration-150',
                i === target ? 'text-primary-text' : 'hover:text-primary-text',
              )}
              {...item(i)}
            >
              {hovered === i && (
                <NavPill
                  layoutId="header-nav-hover"
                  className="bg-primary-soft/60 inset-0 rounded-sm"
                />
              )}
              {i === target && (
                <NavPill
                  layoutId="header-nav-underline"
                  className="from-primary-text via-gold to-primary-text inset-x-2.5 bottom-1 z-0 h-0.5 rounded-full bg-linear-to-r"
                />
              )}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
