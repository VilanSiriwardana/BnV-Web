'use client';

import * as React from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils/cn';

function Tooltip({
  children,
  content,
  side = 'top',
  className,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: React.ComponentProps<typeof TooltipPrimitive.Content>['side'];
  className?: string;
}) {
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            data-slot="tooltip"
            side={side}
            sideOffset={6}
            className={cn(
              'bg-foreground text-background text-caption data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 z-50 rounded-sm px-2.5 py-1.5 font-sans shadow-md',
              className,
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-foreground" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export { Tooltip };
