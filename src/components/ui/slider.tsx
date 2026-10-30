'use client';

import * as React from 'react';
import { Slider as SliderPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils/cn';

function Slider({
  className,
  value,
  defaultValue,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const thumbs = (value ?? defaultValue ?? [0]).length;
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      className={cn(
        'relative flex w-full touch-none items-center py-2 select-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="bg-primary-soft relative h-1.5 grow overflow-hidden rounded-full">
        <SliderPrimitive.Range className="bg-gradient-brand absolute h-full" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbs }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="border-primary-text bg-card focus-visible:ring-ring/40 hover:shadow-glow block size-5 rounded-full border-2 shadow-md transition-[box-shadow] duration-150 outline-none focus-visible:ring-[4px]"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
