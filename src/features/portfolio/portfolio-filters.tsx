import Link from 'next/link';

import { routes } from '@/config/routes';
import {
  categoryLabels,
  featuredLabels,
  featuredTypes,
  shootCategories,
  type FeaturedType,
  type ShootCategory,
} from '@/data/portfolio';
import { cn } from '@/lib/utils/cn';

type Filters = { featured?: FeaturedType; category?: ShootCategory };

function href(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.featured) params.set('featured', filters.featured);
  if (filters.category) params.set('category', filters.category);
  const qs = params.toString();
  return qs ? `${routes.portfolio}?${qs}` : routes.portfolio;
}

function Chip({
  active,
  href: to,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={to}
      aria-current={active ? 'true' : undefined}
      scroll={false}
      className={cn(
        'text-small rounded-full border px-4 py-1.5 transition-colors',
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'hover:border-primary',
      )}
    >
      {label}
    </Link>
  );
}

// Link-based filters keep the page server-rendered and shareable.
export function PortfolioFilters({
  filters,
  categories,
}: {
  filters: Filters;
  categories: ShootCategory[];
}) {
  return (
    <nav aria-label="Filter shoots" className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Chip
          active={!filters.featured}
          href={href({ ...filters, featured: undefined })}
          label="Everyone"
        />
        {featuredTypes.map((f) => (
          <Chip
            key={f}
            active={filters.featured === f}
            href={href({ ...filters, featured: f })}
            label={featuredLabels[f]}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Chip
          active={!filters.category}
          href={href({ ...filters, category: undefined })}
          label="All shoots"
        />
        {shootCategories
          .filter((c) => categories.includes(c))
          .map((c) => (
            <Chip
              key={c}
              active={filters.category === c}
              href={href({ ...filters, category: c })}
              label={categoryLabels[c]}
            />
          ))}
      </div>
    </nav>
  );
}
