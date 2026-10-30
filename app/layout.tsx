import type { Metadata } from 'next';
import {
  Cinzel,
  Cormorant_Garamond,
  Inter,
  Noto_Serif_Sinhala,
} from 'next/font/google';

import { CartDrawer } from '@/components/cart/cart-drawer';
import { CartProvider } from '@/components/cart/cart-provider';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { StorefrontChrome } from '@/components/layout/storefront-chrome';
import { AnnouncementBar } from '@/components/marketing/announcement-bar';
import { Analytics } from '@/components/consent/analytics';
import { CookieConsent } from '@/components/consent/cookie-consent';
import { SpotlightProvider } from '@/components/motion/spotlight-provider';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { brand } from '@/config/brand';
import { siteConfig } from '@/config/seo';
import { announcement } from '@/data/home';
import { JsonLd, organizationJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';

import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant-garamond',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const sinhala = Noto_Serif_Sinhala({
  variable: '--font-sinhala',
  subsets: ['sinhala'],
  weight: ['400', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    siteName: brand.name,
    locale: siteConfig.locale,
  },
  twitter: { card: 'summary_large_image' },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${cinzel.variable} ${cormorant.variable} ${sinhala.variable} h-full`}
    >
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <ThemeProvider>
          <SpotlightProvider />
          <Toaster />
          <CartProvider>
            <StorefrontChrome>
              <AnnouncementBar {...announcement} />
              <SiteHeader />
            </StorefrontChrome>
            <main className="flex-1">{children}</main>
            <StorefrontChrome>
              <SiteFooter />
              <CartDrawer />
              <CookieConsent />
              <Analytics />
            </StorefrontChrome>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
