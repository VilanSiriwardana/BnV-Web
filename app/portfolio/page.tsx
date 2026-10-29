import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import {
  featuredTypes,
  filterShoots,
  shootCategories,
  shoots,
  type FeaturedType,
  type ShootCategory,
} from '@/data/portfolio';
import {
  CollaborateCtas,
  PortfolioComingSoon,
} from '@/features/portfolio/coming-soon';
import { PortfolioFilters } from '@/features/portfolio/portfolio-filters';
import { ShootCard } from '@/features/portfolio/shoot-card';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Visual Portfolio',
  description:
    'Fashion, jewelry and lifestyle shoots with Buwi and Vila as models and creators. See their work and invite them to yours.',
  path: routes.portfolio,
});

const pick = <T extends string>(values: readonly T[], v: unknown) =>
  typeof v === 'string' && (values as readonly string[]).includes(v)
    ? (v as T)
    : undefined;

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = {
    featured: pick<FeaturedType>(featuredTypes, params.featured),
    category: pick<ShootCategory>(shootCategories, params.category),
  };
  const results = filterShoots(filters);
  const usedCategories = [...new Set(shoots.flatMap((s) => s.categories))];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-h1">Visual Portfolio</h1>
        <p className="text-muted-foreground mt-3">
          Buwi and Vila as models, lifestyle creators and collaborators:
          fashion, jewelry and romantic visual stories made with brands and
          friends.
        </p>
        <Button asChild className="mt-6">
          <Link href={routes.collaborate}>Work With Us</Link>
        </Button>
      </header>

      {shoots.length === 0 ? (
        <PortfolioComingSoon />
      ) : (
        <>
          <PortfolioFilters filters={filters} categories={usedCategories} />
          {results.length ? (
            <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((s) => (
                <li key={s.slug}>
                  <ShootCard shoot={s} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                No shoots match these filters yet.
              </p>
              <Button asChild variant="link">
                <Link href={routes.portfolio}>Clear filters</Link>
              </Button>
            </div>
          )}
          <section className="mt-16 text-center">
            <h2 className="font-display text-h3 mb-6">
              Create something with us
            </h2>
            <CollaborateCtas />
          </section>
        </>
      )}
    </div>
  );
}
