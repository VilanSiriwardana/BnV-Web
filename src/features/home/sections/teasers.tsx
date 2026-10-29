import { TeaserBand } from '@/components/marketing/teaser-band';
import { teasers } from '@/data/home';

export function GiftBoxTeaser() {
  return <TeaserBand id="gift-box-title" tone="surface" {...teasers.giftBox} />;
}

export function CustomOrders() {
  return <TeaserBand id="custom-orders-title" {...teasers.custom} />;
}

export function LoveWebsites() {
  return (
    <TeaserBand
      id="love-websites-title"
      tone="muted"
      {...teasers.loveWebsites}
    />
  );
}

// Real shoots only (D-10); a "coming soon" teaser until src/data/portfolio has entries.
export function PortfolioPreview() {
  return <TeaserBand id="portfolio-title" {...teasers.portfolio} />;
}
