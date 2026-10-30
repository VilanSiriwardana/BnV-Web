'use client';

import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';

import { cn } from '@/lib/utils/cn';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const d = getDefaultClassNames();
  return (
    <DayPicker
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      className={cn('font-sans text-sm', className)}
      classNames={{
        root: cn(d.root, 'relative'),
        months: 'flex flex-col gap-4 sm:flex-row',
        month: 'flex flex-col gap-3',
        month_caption: 'flex h-9 items-center justify-center',
        caption_label: 'font-display text-h4 font-semibold',
        nav: 'absolute inset-x-0 top-0 flex h-9 items-center justify-between',
        button_previous:
          'hover:bg-primary-soft focus-visible:ring-ring/40 grid size-9 place-items-center rounded-md outline-none focus-visible:ring-[3px] disabled:opacity-40',
        button_next:
          'hover:bg-primary-soft focus-visible:ring-ring/40 grid size-9 place-items-center rounded-md outline-none focus-visible:ring-[3px] disabled:opacity-40',
        weekdays: 'flex',
        weekday: 'text-muted-foreground text-caption w-9 font-medium uppercase',
        week: 'mt-1 flex w-full',
        day: 'group/day relative size-9 p-0 text-center',
        day_button:
          'hover:bg-primary-soft focus-visible:ring-ring/40 grid size-9 place-items-center rounded-md transition-colors duration-150 outline-none focus-visible:ring-[3px]',
        selected:
          '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:font-semibold [&>button]:hover:bg-primary-hover',
        range_start: 'bg-primary-soft rounded-l-md',
        range_end: 'bg-primary-soft rounded-r-md',
        range_middle:
          'bg-primary-soft [&>button]:bg-transparent! [&>button]:text-foreground! [&>button]:font-normal!',
        today: '[&>button]:text-primary-text [&>button]:font-semibold',
        outside: 'text-muted-foreground/50',
        disabled: 'text-muted-foreground opacity-40',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeftIcon className="size-4" />
          ) : (
            <ChevronRightIcon className="size-4" />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
