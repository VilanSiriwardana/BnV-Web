import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
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

const sortLabels = {
  newest: 'Newest',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
} as const;

// A GET form keeps filter state in the URL; the comboboxes submit through hidden inputs.
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
      <div className="text-label flex flex-col gap-1.5 font-medium">
        <label htmlFor="filter-category">Category</label>
        <Combobox
          id="filter-category"
          name="category"
          defaultValue={params.category ?? null}
          options={[
            { value: '', label: 'All' },
            ...categories.map((c) => ({ value: c.slug, label: c.name })),
          ]}
          searchable={categories.length > 6}
          placeholder="All"
          autoSubmit
        />
      </div>
      <div className="text-label flex flex-col gap-1.5 font-medium">
        <label htmlFor="filter-collection">Collection</label>
        <Combobox
          id="filter-collection"
          name="collection"
          defaultValue={params.collection ?? null}
          options={[
            { value: '', label: 'All' },
            ...collections.map((c) => ({ value: c.slug, label: c.name })),
          ]}
          searchable={collections.length > 6}
          placeholder="All"
          autoSubmit
        />
      </div>
      <label className="text-label flex flex-col gap-1.5 font-medium">
        Min price (LKR)
        <Input
          name="minPrice"
          type="number"
          min={0}
          inputMode="numeric"
          defaultValue={params.minPrice}
        />
      </label>
      <label className="text-label flex flex-col gap-1.5 font-medium">
        Max price (LKR)
        <Input
          name="maxPrice"
          type="number"
          min={0}
          inputMode="numeric"
          defaultValue={params.maxPrice}
        />
      </label>
      <div className="text-label flex flex-col gap-1.5 font-medium">
        <label htmlFor="filter-sort">Sort</label>
        <Combobox
          id="filter-sort"
          name="sort"
          defaultValue={params.sort ?? 'newest'}
          options={Object.entries(sortLabels).map(([value, label]) => ({
            value,
            label,
          }))}
          searchable={false}
          autoSubmit
        />
      </div>
      <label className="text-label hover:text-primary-text flex h-11 cursor-pointer items-center gap-2 font-medium transition-colors">
        <Checkbox name="inStock" value="1" defaultChecked={params.inStock} />
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
