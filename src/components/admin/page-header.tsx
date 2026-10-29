import type { ReactNode } from 'react';

export function AdminPageHeader({
  title,
  actions,
}: {
  title: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-display text-h3">{title}</h1>
      {actions}
    </div>
  );
}
