'use client';

import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';

import { focusRing } from '@/components/ui/styles';
import { cn } from '@/lib/utils/cn';

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted border-input inline-flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 transition-colors duration-150 disabled:opacity-50',
        focusRing,
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="bg-card ease-standard block size-4.5 rounded-full shadow-sm transition-transform duration-250 data-[state=checked]:translate-x-5" />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
