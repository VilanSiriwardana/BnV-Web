'use client';

import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils/cn';

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid gap-2', className)}
      {...props}
    />
  );
}

// Card-style option: the whole row is the radio, with an optional description.
function RadioGroupItem({
  className,
  children,
  description,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  description?: React.ReactNode;
}) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'group/radio border-input bg-card hover:border-primary hover:bg-primary-soft/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary-soft data-[state=checked]:shadow-glow focus-ring flex w-full cursor-pointer items-start gap-3 rounded-md border p-3 text-left font-sans text-sm transition-[border-color,background-color,box-shadow] duration-150 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <span className="border-input group-hover/radio:border-primary group-data-[state=checked]/radio:border-primary-text bg-background mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border transition-colors">
        <RadioGroupPrimitive.Indicator className="bg-primary-text animate-in zoom-in-50 size-2.5 rounded-full duration-150" />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="font-medium">{children}</span>
        {description && (
          <span className="text-muted-foreground text-caption">
            {description}
          </span>
        )}
      </span>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
