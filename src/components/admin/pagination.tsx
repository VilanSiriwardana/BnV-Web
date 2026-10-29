import Link from 'next/link';

import { PAGE_SIZE } from '@/lib/admin/list-params';

export function Pagination({
  page,
  total,
  params,
}: {
  page: number;
  total: number;
  params: Record<string, string | undefined>;
}) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const href = (p: number) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) search.set(key, value);
    }
    search.set('page', String(p));
    return `?${search}`;
  };

  return (
    <div className="text-small text-muted-foreground mt-4 flex items-center justify-between">
      <span>
        {total} {total === 1 ? 'result' : 'results'} · page {page} of {pages}
      </span>
      <span className="flex gap-3">
        {page > 1 && <Link href={href(page - 1)}>Previous</Link>}
        {page < pages && <Link href={href(page + 1)}>Next</Link>}
      </span>
    </div>
  );
}
