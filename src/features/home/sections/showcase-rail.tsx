import { SectionHeading } from '@/components/marketing/section-heading';
import { showcases } from '@/data/home';

import { getCollectionProducts } from '../queries';
import { ShowcaseTabs } from './showcase-tabs';

export async function ShowcaseRail() {
  const lists = await Promise.all(
    showcases.map(async ({ slug, title, description, href }) => ({
      slug,
      title,
      description,
      href,
      products: await getCollectionProducts(slug, 4),
    })),
  );
  const tabs = lists.filter((list) => list.products.length > 0);
  if (tabs.length === 0) return null;

  return (
    <section
      aria-labelledby="showcase-title"
      className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16"
    >
      <SectionHeading
        id="showcase-title"
        eyebrow="Collections"
        title="Curated for the moment"
      />
      <ShowcaseTabs tabs={tabs} />
    </section>
  );
}
