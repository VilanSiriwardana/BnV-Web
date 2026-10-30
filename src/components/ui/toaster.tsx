'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, toast } from 'sonner';

function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      position="bottom-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'glass text-popover-foreground shadow-glow flex w-full items-start gap-3 rounded-md border p-4 font-sans text-sm',
          title: 'font-semibold',
          description: 'text-muted-foreground text-small',
          actionButton:
            'bg-primary text-primary-foreground ml-auto cursor-pointer rounded-sm px-3 py-1 text-xs font-semibold',
          cancelButton:
            'bg-muted cursor-pointer rounded-sm px-3 py-1 text-xs font-semibold',
          success:
            'bg-success-soft border-success/40 [&_[data-icon]]:text-success-text',
          error:
            'bg-destructive-soft border-destructive/40 [&_[data-icon]]:text-destructive-text',
          warning:
            'bg-warning-soft border-warning/40 [&_[data-icon]]:text-warning-text',
          info: 'bg-info-soft border-info/40 [&_[data-icon]]:text-info-text',
        },
      }}
    />
  );
}

export { Toaster, toast };
