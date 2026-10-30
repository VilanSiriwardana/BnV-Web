'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { DateRange, Matcher } from 'react-day-picker';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { fieldTrigger } from '@/components/ui/styles';
import { cn } from '@/lib/utils/cn';

const fmt = (d: Date) => format(d, 'd MMM yyyy');

type Common = {
  placeholder?: string;
  disabled?: Matcher | Matcher[];
  className?: string;
  id?: string;
};

function Trigger({
  id,
  className,
  empty,
  children,
}: {
  id?: string;
  className?: string;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        id={id}
        data-placeholder={empty || undefined}
        className={cn(fieldTrigger, className)}
      >
        <CalendarIcon className="text-primary-text size-4 shrink-0" />
        <span className="truncate">{children}</span>
      </button>
    </PopoverTrigger>
  );
}

export function DatePicker({
  value,
  onValueChange,
  placeholder = 'Pick a date',
  disabled,
  className,
  id,
}: Common & {
  value: Date | undefined;
  onValueChange: (value: Date | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Trigger id={id} className={className} empty={!value}>
        {value ? fmt(value) : placeholder}
      </Trigger>
      <PopoverContent className="w-auto p-3">
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          disabled={disabled}
          onSelect={(d) => {
            onValueChange(d);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export function DateRangePicker({
  value,
  onValueChange,
  placeholder = 'Pick a date range',
  disabled,
  className,
  id,
  numberOfMonths = 2,
}: Common & {
  value: DateRange | undefined;
  onValueChange: (value: DateRange | undefined) => void;
  numberOfMonths?: number;
}) {
  const label = value?.from
    ? value.to
      ? `${fmt(value.from)} – ${fmt(value.to)}`
      : fmt(value.from)
    : placeholder;
  return (
    <Popover>
      <Trigger id={id} className={className} empty={!value?.from}>
        {label}
      </Trigger>
      <PopoverContent className="w-auto p-3">
        <Calendar
          mode="range"
          selected={value}
          defaultMonth={value?.from}
          disabled={disabled}
          numberOfMonths={numberOfMonths}
          onSelect={onValueChange}
        />
      </PopoverContent>
    </Popover>
  );
}

export type { DateRange };
