import Link from 'next/link';

import type { Crumb } from '@/lib/seo/jsonld';

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-small text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((crumb, i) => (
          <li key={crumb.path} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="text-foreground">
                {crumb.name}
              </span>
            ) : (
              <Link
                href={crumb.path}
                className="underline-offset-4 hover:underline"
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
