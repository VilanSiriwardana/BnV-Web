import Link from 'next/link';

import { CartButton } from '@/components/cart/cart-button';
import { HeaderShell } from '@/components/layout/header-shell';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { brand } from '@/config/brand';
import { mainNav, utilityNav } from '@/config/navigation';
import { routes } from '@/config/routes';

const utilities: Record<(typeof utilityNav)[number], React.ReactNode> = {
  theme: <ThemeToggle />,
  cart: <CartButton />,
};

export function SiteHeader() {
  return (
    <HeaderShell className="border-primary/40 bg-background/80 supports-[backdrop-filter]:bg-primary-soft/70 group/header after:bg-gradient-brand sticky top-0 z-40 border-b backdrop-blur-md transition-shadow duration-250 after:absolute after:inset-x-0 after:-bottom-px after:h-px data-[scrolled]:shadow-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 md:px-8">
        <MobileNav />
        <Link href={routes.home} className="font-display text-h3 font-semibold">
          {brand.name}
        </Link>
        <nav aria-label="Main" className="mx-auto hidden lg:block">
          <ul className="flex items-center gap-6 font-sans">
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
    </HeaderShell>
  );
}
