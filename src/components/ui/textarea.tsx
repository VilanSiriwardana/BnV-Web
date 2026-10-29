import * as React from 'react';
import { cn } from '@/lib/utils/cn';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive placeholder:text-muted-foreground min-h-28 w-full rounded-md border px-3 py-2 text-base outline-none focus-visible:ring-[3px] md:text-sm',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
