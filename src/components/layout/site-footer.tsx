import Link from 'next/link';

import { brand } from '@/config/brand';
import { footerNav } from '@/config/navigation';

const socialLabels = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
} as const;

export function SiteFooter() {
  const socials = (
    Object.keys(socialLabels) as (keyof typeof socialLabels)[]
  ).flatMap((key) => {
    const href: string | null = brand.social[key];
    return href ? [{ label: socialLabels[key], href }] : [];
  });

  return (
    <footer className="border-border bg-surface mt-16 border-t md:mt-24">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 md:grid-cols-4 md:px-8">
        <div>
          <p className="font-display text-h3 font-semibold">{brand.name}</p>
          <p className="text-small text-muted-foreground mt-2">
            {brand.tagline}
          </p>
          {socials.length > 0 && (
            <ul className="mt-4 flex gap-4">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="text-small hover:text-primary-text"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-caption font-sans font-semibold tracking-widest uppercase">
              {group.title}
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-small text-muted-foreground hover:text-primary-text"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-border text-caption text-muted-foreground border-t px-4 py-6 text-center">
        © {new Date().getFullYear()} {brand.name}
      </div>
    </footer>
  );
}
