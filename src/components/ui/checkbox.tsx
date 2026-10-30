'use client';

import * as React from 'react';
import { CheckIcon } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';

import { focusRing } from '@/components/ui/styles';
import { cn } from '@/lib/utils/cn';

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground aria-invalid:border-destructive peer size-5 shrink-0 rounded-sm border shadow-sm transition-colors duration-150 disabled:opacity-50',
        focusRing,
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="animate-in zoom-in-75 grid place-items-center duration-150">
        <CheckIcon className="size-3.5" strokeWidth={2.5} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
