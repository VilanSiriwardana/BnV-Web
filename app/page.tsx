import type { Metadata } from 'next';

import { siteConfig } from '@/config/seo';
import { BrandStory } from '@/features/home/sections/brand-story';
import { ClosingRow } from '@/features/home/sections/closing-row';
import { ComingSoonStrip } from '@/features/home/sections/coming-soon-strip';
import { FeaturedCategories } from '@/features/home/sections/featured-categories';
import { GiftBoxBanner } from '@/features/home/sections/gift-box-banner';
import { Divider } from '@/components/marketing/divider';
import { HeroSection } from '@/features/home/sections/hero-section';
import { NewArrivals } from '@/features/home/sections/new-arrivals';
import { ShowcaseRail } from '@/features/home/sections/showcase-rail';
import { TeaserBento } from '@/features/home/sections/teaser-bento';
import { TrustStrip } from '@/features/home/sections/trust-strip';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: siteConfig.defaultTitle },
  description: siteConfig.description,
  alternates: { canonical: '/' },
};

// Section order follows Brand-Identity §23 (v1.6, ADR-0025). The social gallery stays hidden until real handles exist.
export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <FeaturedCategories />
      <NewArrivals />
      <GiftBoxBanner />
      <Divider className="my-4" />
      <BrandStory />
      <ShowcaseRail />
      <TeaserBento />
      <ComingSoonStrip />
      <ClosingRow />
    </>
  );
}
