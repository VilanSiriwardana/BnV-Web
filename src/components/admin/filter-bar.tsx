import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatStatus } from '@/lib/utils/format';

// Plain GET form so filters live in the URL and work without JavaScript.
export function FilterBar({
  statuses,
  status,
  q,
  searchPlaceholder = 'Search',
}: {
  statuses: readonly string[];
  status?: string;
  q?: string;
  searchPlaceholder?: string;
}) {
  return (
    <form method="get" className="mb-4 flex flex-wrap items-end gap-2">
      <label className="w-full sm:w-64">
        <span className="sr-only">Search</span>
        <Input name="q" defaultValue={q} placeholder={searchPlaceholder} />
      </label>
      <label className="w-full sm:w-48">
        <span className="sr-only">Status</span>
        <Select name="status" defaultValue={status ?? ''}>
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {formatStatus(s)}
            </option>
          ))}
        </Select>
      </label>
      <Button type="submit" variant="secondary">
        Filter
      </Button>
    </form>
  );
}
