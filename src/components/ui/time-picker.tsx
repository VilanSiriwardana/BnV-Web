'use client';

import * as React from 'react';
import { ClockIcon } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { fieldTrigger, optionRow } from '@/components/ui/styles';
import { cn } from '@/lib/utils/cn';

const pad = (n: number) => String(n).padStart(2, '0');

function Column({
  label,
  values,
  selected,
  onPick,
}: {
  label: string;
  values: number[];
  selected: number | undefined;
  onPick: (v: number) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    ref.current
      ?.querySelector('[data-checked="true"]')
      ?.scrollIntoView({ block: 'center' });
  }, []);
  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={label}
      className="flex max-h-56 w-16 flex-col gap-0.5 overflow-y-auto p-1"
    >
      {values.map((v) => (
        <button
          key={v}
          type="button"
          role="option"
          aria-selected={v === selected}
          data-spotlight
          data-checked={v === selected}
          onClick={() => onPick(v)}
          className={cn(
            optionRow,
            'focus-ring hover:bg-primary-soft data-[checked=true]:bg-primary data-[checked=true]:text-primary-foreground justify-center tabular-nums',
          )}
        >
          {pad(v)}
        </button>
      ))}
    </div>
  );
}

export function TimePicker({
  value,
  onValueChange,
  minuteStep = 15,
  placeholder = 'Pick a time',
  className,
  id,
}: {
  value: string | undefined;
  onValueChange: (value: string) => void;
  minuteStep?: number;
  placeholder?: string;
  className?: string;
  id?: string;
}) {
  const [h, m] = value ? value.split(':').map(Number) : [];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from(
    { length: Math.ceil(60 / minuteStep) },
    (_, i) => i * minuteStep,
  );
  const set = (nh = h ?? 9, nm = m ?? 0) =>
    onValueChange(`${pad(nh)}:${pad(nm)}`);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          data-placeholder={!value || undefined}
          className={cn(fieldTrigger, className)}
        >
          <ClockIcon className="text-primary-text size-4 shrink-0" />
          <span className="tabular-nums">{value ?? placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto gap-1 p-1">
        <Column
          label="Hour"
          values={hours}
          selected={h}
          onPick={(v) => set(v, m)}
        />
        <div aria-hidden className="bg-border w-px" />
        <Column
          label="Minute"
          values={minutes}
          selected={m}
          onPick={(v) => set(h, v)}
        />
      </PopoverContent>
    </Popover>
  );
}
