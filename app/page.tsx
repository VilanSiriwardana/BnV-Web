import type { Metadata } from 'next';

import { AnnouncementBar } from '@/components/marketing/announcement-bar';
import { siteConfig } from '@/config/seo';
import { announcement, showcases } from '@/data/home';
import { CollectionShowcase } from '@/features/home/sections/collection-showcase';
import { FeaturedCategories } from '@/features/home/sections/featured-categories';
import { HeroSection } from '@/features/home/sections/hero-section';
import { NewArrivals } from '@/features/home/sections/new-arrivals';
import { NewsletterSection } from '@/features/home/sections/newsletter-section';
import {
  CustomOrders,
  GiftBoxTeaser,
  LoveWebsites,
  PortfolioPreview,
} from '@/features/home/sections/teasers';
import { Testimonials } from '@/features/home/sections/testimonials';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: siteConfig.defaultTitle },
  description: siteConfig.description,
  alternates: { canonical: '/' },
};

// Section order follows Brand-Identity §23. The social gallery stays hidden until real handles exist.
export default function Home() {
  return (
    <>
      <AnnouncementBar {...announcement} />
      <HeroSection />
      <FeaturedCategories />
      <NewArrivals />
      {showcases.map(({ slug, ...showcase }, i) => (
        <CollectionShowcase
          key={slug}
          slug={slug}
          {...showcase}
          className={i % 2 === 1 ? 'bg-muted' : undefined}
        />
      ))}
      <GiftBoxTeaser />
      <CustomOrders />
      <LoveWebsites />
      <PortfolioPreview />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
