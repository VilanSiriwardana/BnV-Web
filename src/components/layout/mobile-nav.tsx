'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NavPill, useHoverIndex } from '@/components/motion/nav-pill';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { navItem } from '@/components/ui/styles';
import { brand } from '@/config/brand';
import { mainNav, shopMenu } from '@/config/navigation';
import { cn } from '@/lib/utils/cn';

type NavLink = { href: string; label: string };

function NavList({
  links,
  id,
  bold,
}: {
  links: readonly NavLink[];
  id: string;
  bold?: boolean;
}) {
  const pathname = usePathname();
  const { hovered, list, item } = useHoverIndex();
  return (
    <ul className="flex flex-col gap-0.5" {...list}>
      {links.map((link, i) => {
        const active =
          link.href === '/' ? pathname === '/' : pathname === link.href;
        return (
          <li key={link.href}>
            <SheetClose asChild>
              <Link
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  navItem,
                  'text-body py-3',
                  !bold && 'font-normal',
                )}
                {...item(i)}
              >
                {(hovered === i || (hovered === null && active)) && (
                  <NavPill
                    layoutId={`${id}-pill`}
                    className="bg-primary-soft inset-0 rounded-md"
                  />
                )}
                {link.label}
              </Link>
            </SheetClose>
          </li>
        );
      })}
    </ul>
  );
}

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          className="lg:hidden"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-h3">{brand.name}</SheetTitle>
        </SheetHeader>
        <nav
          aria-label="Mobile"
          className="flex flex-col gap-6 px-4 pb-8 font-sans"
        >
          <NavList links={mainNav} id="mobile-main" bold />
          <div>
            <p className="text-caption text-muted-foreground px-3 font-semibold tracking-widest uppercase">
              Featured
            </p>
            <div className="mt-2">
              <NavList links={shopMenu.featured} id="mobile-featured" />
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
