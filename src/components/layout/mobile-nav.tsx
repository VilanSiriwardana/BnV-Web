'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { brand } from '@/config/brand';
import { mainNav, shopMenu } from '@/config/navigation';

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
          <ul className="flex flex-col">
            {mainNav.map((item) => (
              <li key={item.href}>
                <SheetClose asChild>
                  <Link
                    href={item.href}
                    className="text-body hover:bg-accent block rounded-sm px-2 py-3 font-medium"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
          <div>
            <p className="text-caption text-muted-foreground px-2 font-semibold tracking-widest uppercase">
              Featured
            </p>
            <ul className="mt-2 flex flex-col">
              {shopMenu.featured.map((item) => (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      className="text-body hover:bg-accent block rounded-sm px-2 py-3"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
