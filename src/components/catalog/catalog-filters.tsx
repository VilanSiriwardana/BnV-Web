import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { routes } from '@/config/routes';
import type { ShopParams } from '@/features/catalog/schema';

type Option = { name: string; slug: string };

type Props = {
  params: ShopParams;
  categories: Option[];
  collections: Option[];
  total: number;
};

const selectClass =
  'border-input dark:bg-muted focus-visible:border-ring focus-visible:ring-ring/40 h-11 w-full rounded-sm border bg-transparent px-3 text-base shadow-sm outline-none focus-visible:ring-[3px]';

const sortLabels = {
  newest: 'Newest',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
} as const;

// A plain GET form keeps filter state in the URL and works without JavaScript.
export function CatalogFilters({
  params,
  categories,
  collections,
  total,
}: Props) {
  return (
    <form
      action={routes.shop}
      className="border-border mt-8 grid grid-cols-2 gap-4 border-y py-6 md:grid-cols-3 lg:grid-cols-6 lg:items-end"
    >
      <label className="text-small flex flex-col gap-1.5 font-medium">
        Category
        <select
          name="category"
          defaultValue={params.category ?? ''}
          className={selectClass}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-small flex flex-col gap-1.5 font-medium">
        Collection
        <select
          name="collection"
          defaultValue={params.collection ?? ''}
          className={selectClass}
        >
          <option value="">All</option>
          {collections.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-small flex flex-col gap-1.5 font-medium">
        Min price (LKR)
        <Input
          name="minPrice"
          type="number"
          min={0}
          inputMode="numeric"
          defaultValue={params.minPrice}
        />
      </label>
      <label className="text-small flex flex-col gap-1.5 font-medium">
        Max price (LKR)
        <Input
          name="maxPrice"
          type="number"
          min={0}
          inputMode="numeric"
          defaultValue={params.maxPrice}
        />
      </label>
      <label className="text-small flex flex-col gap-1.5 font-medium">
        Sort
        <select name="sort" defaultValue={params.sort} className={selectClass}>
          {Object.entries(sortLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-small flex h-11 items-center gap-2 font-medium">
        <input
          type="checkbox"
          name="inStock"
          value="1"
          defaultChecked={params.inStock}
          className="accent-primary size-4"
        />
        In stock only
      </label>
      <div className="col-span-2 flex items-center justify-between gap-4 md:col-span-3 lg:col-span-6">
        <p className="text-small text-muted-foreground" aria-live="polite">
          {total} {total === 1 ? 'piece' : 'pieces'}
        </p>
        <div className="flex gap-3">
          <Link
            href={routes.shop}
            className="text-small self-center underline-offset-4 hover:underline"
          >
            Reset
          </Link>
          <Button type="submit">Apply</Button>
        </div>
      </div>
    </form>
  );
}
