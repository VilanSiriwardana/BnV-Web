import { buttonVariants } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { SizeGuide } from '@/data/size-guides';

export function SizeGuideSheet({ guide }: { guide: SizeGuide }) {
  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: 'link' })}>
        Open size guide
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{guide.title}</SheetTitle>
        </SheetHeader>
        <div className="overflow-x-auto px-4">
          <table className="text-small w-full">
            <thead>
              <tr>
                {guide.columns.map((column) => (
                  <th key={column} className="border-b py-2 text-left">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guide.rows.map((row) => (
                <tr key={row.join('|')}>
                  {row.map((cell, i) => (
                    <td key={i} className="border-b py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SheetContent>
    </Sheet>
  );
}
