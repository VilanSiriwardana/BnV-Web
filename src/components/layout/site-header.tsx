import { Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

import { MobileNav } from '@/components/layout/mobile-nav';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { brand } from '@/config/brand';
import { mainNav, utilityNav } from '@/config/navigation';
import { routes } from '@/config/routes';

const utilities: Record<(typeof utilityNav)[number], React.ReactNode> = {
  search: (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Search (coming soon)"
      disabled
    >
      <Search />
    </Button>
  ),
  theme: <ThemeToggle />,
  cart: (
    <Button variant="ghost" size="icon" asChild>
      <Link href={routes.cart} aria-label="Cart">
        <ShoppingBag />
      </Link>
    </Button>
  ),
};

export function SiteHeader() {
  return (
    <header className="border-border bg-surface/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 md:px-8">
        <MobileNav />
        <Link href={routes.home} className="font-display text-h3 font-semibold">
          {brand.name}
        </Link>
        <nav aria-label="Main" className="mx-auto hidden lg:block">
          <ul className="flex items-center gap-6">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-small hover:text-primary-text font-medium transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          {utilityNav.map((key) => (
            <span key={key}>{utilities[key]}</span>
          ))}
        </div>
      </div>
    </header>
  );
}
