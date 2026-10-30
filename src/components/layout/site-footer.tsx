import {
  Banknote,
  Compass,
  LifeBuoy,
  Mail,
  MessageCircle,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import Link from 'next/link';

import { CookieSettingsButton } from '@/components/consent/cookie-consent';
import { Reveal } from '@/components/motion/reveal';
import { GoldHeart } from '@/components/marketing/section-heading';
import { brand } from '@/config/brand';
import { footerNav } from '@/config/navigation';
import { routes } from '@/config/routes';
import { trust } from '@/data/home';
import { NewsletterForm } from '@/features/newsletter/newsletter-form';

// Simple brand marks (lucide v1 ships no brand icons).
const socialIcons = {
  instagram: {
    label: 'Instagram',
    path: 'M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.9-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.7a2.8 2.8 0 0 0-2.8 2.8v9a2.8 2.8 0 0 0 2.8 2.8h9a2.8 2.8 0 0 0 2.8-2.8v-9a2.8 2.8 0 0 0-2.8-2.8h-9Z',
  },
  tiktok: {
    label: 'TikTok',
    path: 'M16.6 3c.3 2.1 1.6 3.6 3.9 3.8v2.5a6.6 6.6 0 0 1-3.8-1.2v6.3a5.9 5.9 0 1 1-5.9-5.9h.6v2.6a3.3 3.3 0 1 0 2.7 3.3V3h2.5Z',
  },
  facebook: {
    label: 'Facebook',
    path: 'M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3a21 21 0 0 0-2.4-.1c-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6V21h3.2Z',
  },
} as const;

const groupIcons: Record<string, typeof Compass> = {
  Shop: ShoppingBag,
  Explore: Compass,
  Help: LifeBuoy,
};

function GroupIcon({ title }: { title: string }) {
  const Icon = groupIcons[title];
  return Icon ? (
    <Icon
      aria-hidden
      strokeWidth={1.5}
      className="text-chrome-foreground/90 size-4"
    />
  ) : null;
}

const trustIcons = {
  banknote: Banknote,
  'message-circle': MessageCircle,
  truck: Truck,
};

export function SiteFooter() {
  const socials = (
    Object.keys(socialIcons) as (keyof typeof socialIcons)[]
  ).flatMap((key) => {
    const href: string | null = brand.social[key];
    return href ? [{ ...socialIcons[key], href }] : [];
  });

  return (
    <footer className="bg-chrome text-chrome-foreground mt-12 md:mt-16">
      <Reveal className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 md:grid-cols-2 md:px-8 lg:grid-cols-[1.3fr_repeat(3,1fr)_1.7fr]">
        <div>
          <p className="font-display text-h3 font-semibold">{brand.name}</p>
          <p className="text-small text-chrome-foreground/85 mt-2 max-w-xs">
            {brand.tagline}
          </p>
          {socials.length > 0 && (
            <ul className="mt-5 flex gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="border-chrome-foreground/20 hover:bg-chrome-foreground/10 hover:text-primary focus-visible:ring-primary grid size-10 place-items-center rounded-full border transition-colors duration-150 outline-none focus-visible:ring-[3px]"
                  >
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="size-4 fill-current"
                    >
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-caption flex items-center gap-2 font-sans font-semibold tracking-widest uppercase">
              <GroupIcon title={group.title} />
              {group.title}
            </h2>
            <ul className="mt-4 flex flex-col gap-2 font-sans">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-small text-chrome-foreground/85 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div className="flex flex-col gap-6 md:col-span-2 lg:col-span-1">
          <div>
            <h2 className="font-display text-h4 font-semibold">
              <Mail
                aria-hidden
                strokeWidth={1.5}
                className="text-chrome-foreground/90 mr-2 inline size-4 align-[-0.1em]"
              />
              Join our love letters
              <GoldHeart className="size-3.5" />
            </h2>
            <p className="text-small text-chrome-foreground/85 mt-1 mb-4">
              New pieces, gift ideas and the occasional offer.
            </p>
            <div className="[&_.text-icon]:text-chrome-foreground/85 [&_.text-muted-foreground]:text-chrome-foreground/85 [&_.text-primary-text]:text-primary [&_input]:border-chrome-foreground/30 [&_input]:placeholder:text-chrome-foreground/50">
              <NewsletterForm />
            </div>
          </div>
          <ul className="border-chrome-foreground/15 bg-chrome-foreground/5 flex flex-col gap-3 rounded-md border p-4 font-sans">
            {trust.map(({ icon, title }) => {
              const Icon = trustIcons[icon];
              return (
                <li key={title} className="flex items-center gap-3">
                  <Icon
                    aria-hidden
                    strokeWidth={1.5}
                    className="text-primary size-5 shrink-0"
                  />
                  <span className="text-small">{title}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </Reveal>
      <div className="border-chrome-foreground/15 text-caption text-chrome-foreground/85 border-t">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-4 py-6 font-sans sm:flex-row md:px-8">
          <p>
            © {new Date().getFullYear()} {brand.name}
          </p>
          <p className="flex flex-wrap items-center gap-4">
            <Link
              href={routes.policy('privacy')}
              className="hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link href={routes.policy('terms')} className="hover:text-primary">
              Terms of Service
            </Link>
            <CookieSettingsButton />
          </p>
        </div>
      </div>
    </footer>
  );
}
