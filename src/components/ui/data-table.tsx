'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { focusRing } from '@/components/ui/styles';
import { cn } from '@/lib/utils/cn';

export type DataTableColumn<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number | Date;
  className?: string;
  link?: boolean;
};

type Props<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  getRowHref?: (row: T) => string;
  empty?: React.ReactNode;
  selectable?: boolean;
  selected?: string[];
  onSelectedChange?: (keys: string[]) => void;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  getRowHref,
  empty = 'Nothing here yet.',
  selectable,
  selected = [],
  onSelectedChange,
  className,
}: Props<T>) {
  const [sort, setSort] = React.useState<{
    key: string;
    dir: 'asc' | 'desc';
  } | null>(null);

  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const get = col.sortValue;
    const out = [...rows].sort((a, b) => {
      const x = get(a);
      const y = get(b);
      return x < y ? -1 : x > y ? 1 : 0;
    });
    return sort.dir === 'desc' ? out.reverse() : out;
  }, [rows, columns, sort]);

  if (rows.length === 0) {
    return <p className="text-muted-foreground py-8">{empty}</p>;
  }

  const keys = rows.map(getRowKey);
  const allSelected = keys.every((k) => selected.includes(k));
  const toggleRow = (k: string) =>
    onSelectedChange?.(
      selected.includes(k) ? selected.filter((x) => x !== k) : [...selected, k],
    );

  return (
    <div
      className={cn(
        'border-border bg-card overflow-x-auto rounded-md border shadow-sm',
        className,
      )}
    >
      <table className="text-small w-full font-sans">
        <thead className="bg-primary-soft sticky top-0 z-10 text-left">
          <tr>
            {selectable && (
              <th className="w-10 px-3 py-2.5">
                <Checkbox
                  aria-label="Select all rows"
                  checked={allSelected}
                  onCheckedChange={() =>
                    onSelectedChange?.(allSelected ? [] : keys)
                  }
                />
              </th>
            )}
            {columns.map((c) => {
              const active = sort?.key === c.key;
              return (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={
                    active
                      ? sort.dir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                  className={cn('px-3 py-2.5 font-semibold', c.className)}
                >
                  {c.sortValue ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSort(
                          active && sort.dir === 'asc'
                            ? { key: c.key, dir: 'desc' }
                            : active
                              ? null
                              : { key: c.key, dir: 'asc' },
                        )
                      }
                      className={cn(
                        'hover:text-primary-text -mx-1 inline-flex items-center gap-1 rounded-sm px-1 transition-colors',
                        focusRing,
                      )}
                    >
                      {c.header}
                      {!active ? (
                        <ArrowUpDownIcon className="size-3.5 opacity-50" />
                      ) : sort.dir === 'asc' ? (
                        <ArrowUpIcon className="text-primary-text size-3.5" />
                      ) : (
                        <ArrowDownIcon className="text-primary-text size-3.5" />
                      )}
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const k = getRowKey(row);
            const href = getRowHref?.(row);
            const isSelected = selected.includes(k);
            return (
              <tr
                key={k}
                data-state={isSelected ? 'selected' : undefined}
                className="border-border hover:bg-accent data-[state=selected]:bg-primary-soft/60 border-t transition-colors duration-150"
              >
                {selectable && (
                  <td className="px-3 py-2">
                    <Checkbox
                      aria-label="Select row"
                      checked={isSelected}
                      onCheckedChange={() => toggleRow(k)}
                    />
                  </td>
                )}
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn('px-3 py-2 align-top', c.className)}
                  >
                    {c.link && href ? (
                      <Link
                        href={href}
                        className="hover:text-primary-text font-medium underline-offset-4 hover:underline"
                      >
                        {c.cell(row)}
                      </Link>
                    ) : (
                      c.cell(row)
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
