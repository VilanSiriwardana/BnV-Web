import Link from 'next/link';
import type { ReactNode } from 'react';

export function AdminTable({
  headers,
  rows,
  empty,
}: {
  headers: string[];
  rows: { key: string; href: string; cells: ReactNode[] }[];
  empty: string;
}) {
  if (rows.length === 0) {
    return <p className="text-muted-foreground py-8">{empty}</p>;
  }
  return (
    <div className="border-border bg-card overflow-x-auto rounded-md border shadow-sm">
      <table className="text-small w-full font-sans">
        <thead className="bg-primary-soft text-left">
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col" className="px-3 py-2.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.key}
              className="border-border hover:bg-accent border-t transition-colors duration-150"
            >
              {row.cells.map((cell, i) => (
                <td key={i} className="px-3 py-2 align-top">
                  {i === 1 ? (
                    <Link
                      href={row.href}
                      className="hover:text-primary-text font-medium underline-offset-4 hover:underline"
                    >
                      {cell}
                    </Link>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DetailList({
  items,
}: {
  items: { label: string; value: ReactNode }[];
}) {
  return (
    <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-[12rem_1fr]">
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="text-muted-foreground">{item.label}</dt>
          <dd className="whitespace-pre-line">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
