import type { Metadata } from 'next';

import { AnnouncementBar } from '@/components/marketing/announcement-bar';
import { siteConfig } from '@/config/seo';
import { announcement } from '@/data/home';
import { BrandStory } from '@/features/home/sections/brand-story';
import { ComingSoonStrip } from '@/features/home/sections/coming-soon-strip';
import { FeaturedCategories } from '@/features/home/sections/featured-categories';
import { HeroSection } from '@/features/home/sections/hero-section';
import { NewArrivals } from '@/features/home/sections/new-arrivals';
import { NewsletterSection } from '@/features/home/sections/newsletter-section';
import { ShowcaseRail } from '@/features/home/sections/showcase-rail';
import { TeaserBento } from '@/features/home/sections/teaser-bento';
import { Testimonials } from '@/features/home/sections/testimonials';
import { TrustStrip } from '@/features/home/sections/trust-strip';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: siteConfig.defaultTitle },
  description: siteConfig.description,
  alternates: { canonical: '/' },
};

// Section order follows Brand-Identity §23 (v1.5, ADR-0024). The social gallery stays hidden until real handles exist.
export default function Home() {
  return (
    <>
      <AnnouncementBar {...announcement} />
      <HeroSection />
      <TrustStrip />
      <FeaturedCategories />
      <NewArrivals />
      <BrandStory />
      <ShowcaseRail />
      <TeaserBento />
      <ComingSoonStrip />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
