import { PageHero } from '@/components/marketing/page-hero';
import { hero } from '@/data/home';

export function HeroSection() {
  return <PageHero {...hero} variant="split" eager />;
}
