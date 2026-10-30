'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  createPaginatedRowModel,
  createSortedRowModel,
  flexRender,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  InboxIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { focusRing } from '@/components/ui/styles';
import { cn } from '@/lib/utils/cn';

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
});

export type DataTableColumn<T extends RowData> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number | Date;
  className?: string;
  link?: boolean;
};

type Props<T extends RowData> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  getRowHref?: (row: T) => string;
  empty?: React.ReactNode;
  selectable?: boolean;
  selected?: string[];
  onSelectedChange?: (keys: string[]) => void;
  loading?: boolean;
  pageSize?: number;
  className?: string;
};

export function DataTable<T extends RowData>({
  columns,
  rows,
  getRowKey,
  getRowHref,
  empty = 'Nothing here yet.',
  selectable,
  selected = [],
  onSelectedChange,
  loading,
  pageSize = 10,
  className,
}: Props<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const defs = React.useMemo<ColumnDef<typeof features, T>[]>(() => {
    const out: ColumnDef<typeof features, T>[] = columns.map((c) => ({
      id: c.key,
      header: () => c.header,
      accessorFn: c.sortValue,
      enableSorting: !!c.sortValue,
      cell: ({ row }) => c.cell(row.original),
      meta: c,
    }));
    if (selectable) {
      out.unshift({
        id: '__select',
        enableSorting: false,
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all rows"
            checked={
              table.getIsAllRowsSelected() ||
              (table.getIsSomeRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(v) => table.toggleAllRowsSelected(!!v)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label="Select row"
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
          />
        ),
      });
    }
    return out;
  }, [columns, selectable]);

  const rowSelection = React.useMemo<RowSelectionState>(
    () => Object.fromEntries(selected.map((k) => [k, true])),
    [selected],
  );

  const table = useTable({
    features,
    data: rows,
    columns: defs,
    getRowId: getRowKey,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(rowSelection) : updater;
      onSelectedChange?.(Object.keys(next).filter((k) => next[k]));
    },
    enableRowSelection: !!selectable,
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  if (!loading && rows.length === 0) {
    return (
      <div className="border-border bg-gradient-card flex flex-col items-center gap-3 rounded-md border px-6 py-12 text-center font-sans shadow-sm">
        <span className="bg-primary-soft text-primary-text grid size-12 place-items-center rounded-full">
          <InboxIcon className="size-5" strokeWidth={1.5} />
        </span>
        <p className="text-muted-foreground text-sm">{empty}</p>
      </div>
    );
  }

  const pageCount = table.getPageCount();

  return (
    <div
      className={cn(
        'border-border bg-card overflow-hidden rounded-md border shadow-sm',
        className,
      )}
    >
      <div className="max-h-[70svh] overflow-auto">
        <table className="text-small w-full font-sans">
          <thead className="glass sticky top-0 z-10 border-b text-left">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const meta = h.column.columnDef.meta as
                    DataTableColumn<T> | undefined;
                  const dir = h.column.getIsSorted();
                  return (
                    <th
                      key={h.id}
                      scope="col"
                      aria-sort={
                        dir === 'asc'
                          ? 'ascending'
                          : dir === 'desc'
                            ? 'descending'
                            : undefined
                      }
                      className={cn(
                        'px-3 py-2.5 font-semibold',
                        h.id === '__select' && 'w-10',
                        meta?.className,
                      )}
                    >
                      {h.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={h.column.getToggleSortingHandler()}
                          className={cn(
                            'hover:text-primary-text -mx-1 inline-flex cursor-pointer items-center gap-1 rounded-sm px-1 transition-colors',
                            focusRing,
                          )}
                        >
                          {flexRender(
                            h.column.columnDef.header,
                            h.getContext(),
                          )}
                          {dir === 'asc' ? (
                            <ArrowUpIcon className="text-primary-text size-3.5" />
                          ) : dir === 'desc' ? (
                            <ArrowDownIcon className="text-primary-text size-3.5" />
                          ) : (
                            <ArrowUpDownIcon className="size-3.5 opacity-50" />
                          )}
                        </button>
                      ) : (
                        flexRender(h.column.columnDef.header, h.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: Math.min(pageSize, 5) }, (_, i) => (
                  <tr key={i} className="border-border border-t">
                    {defs.map((d) => (
                      <td key={d.id} className="px-3 py-3">
                        <Skeleton className="h-4 w-full max-w-40" />
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.map((row) => {
                  const href = getRowHref?.(row.original);
                  return (
                    <tr
                      key={row.id}
                      data-state={row.getIsSelected() ? 'selected' : undefined}
                      className="border-border hover:bg-primary-soft/50 data-[state=selected]:bg-primary-soft border-t transition-colors duration-150"
                    >
                      {row.getAllCells().map((cell) => {
                        const meta = cell.column.columnDef.meta as
                          DataTableColumn<T> | undefined;
                        const content = flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        );
                        return (
                          <td
                            key={cell.id}
                            className={cn(
                              'px-3 py-2 align-top',
                              meta?.className,
                            )}
                          >
                            {meta?.link && href ? (
                              <Link
                                href={href}
                                className="hover:text-primary-text font-medium underline-offset-4 hover:underline"
                              >
                                {content}
                              </Link>
                            ) : (
                              content
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <div className="border-border flex items-center justify-between gap-3 border-t px-3 py-2 font-sans text-sm">
          <span className="text-muted-foreground tabular-nums">
            Page {table.state.pagination.pageIndex + 1} of {pageCount}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
