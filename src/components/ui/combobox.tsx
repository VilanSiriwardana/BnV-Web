'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { CheckIcon, ChevronsUpDownIcon, SearchIcon, XIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { fieldTrigger } from '@/components/ui/styles';
import { cn } from '@/lib/utils/cn';

export type ComboboxOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  keywords?: string[];
};

type BaseProps = {
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-invalid'?: boolean;
};

type SingleProps = BaseProps & {
  mode?: 'single';
  value: string | null;
  onValueChange: (value: string | null) => void;
};

type MultiProps = BaseProps & {
  mode: 'multi';
  value: string[];
  onValueChange: (value: string[]) => void;
};

export type ComboboxProps = SingleProps | MultiProps;

export function Combobox(props: ComboboxProps) {
  const {
    options,
    placeholder = 'Select…',
    searchPlaceholder = 'Search…',
    emptyText = 'No results',
    searchable = true,
    disabled,
    className,
    id,
  } = props;
  const [open, setOpen] = React.useState(false);
  const listId = React.useId();
  const byValue = React.useMemo(
    () => new Map(options.map((o) => [o.value, o])),
    [options],
  );

  const selected = props.mode === 'multi' ? props.value : [];
  const isSelected = (v: string) =>
    props.mode === 'multi' ? props.value.includes(v) : props.value === v;

  const toggle = (v: string) => {
    if (props.mode === 'multi') {
      props.onValueChange(
        props.value.includes(v)
          ? props.value.filter((x) => x !== v)
          : [...props.value, v],
      );
    } else {
      props.onValueChange(props.value === v ? null : v);
      setOpen(false);
    }
  };

  const single =
    props.mode !== 'multi' && props.value ? byValue.get(props.value) : null;
  const empty = props.mode === 'multi' ? selected.length === 0 : !single;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-invalid={props['aria-invalid']}
          data-placeholder={empty || undefined}
          className={cn(fieldTrigger, 'h-auto min-h-11', className)}
        >
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1 py-1">
            {empty && placeholder}
            {single && (
              <span className="flex items-center gap-2 truncate">
                {single.icon}
                {single.label}
              </span>
            )}
            {selected.map((v) => (
              <Badge key={v} variant="default" className="gap-1 pr-1">
                {byValue.get(v)?.label ?? v}
                <span
                  role="button"
                  tabIndex={-1}
                  aria-label={`Remove ${byValue.get(v)?.label ?? v}`}
                  className="hover:bg-foreground/10 rounded-xs"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle(v);
                  }}
                >
                  <XIcon />
                </span>
              </Badge>
            ))}
          </span>
          <ChevronsUpDownIcon className="text-muted-foreground size-4 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        id={listId}
        className="w-(--radix-popover-trigger-width) min-w-56 p-0"
      >
        <Command loop>
          {searchable && (
            <div className="border-border flex items-center gap-2 border-b px-3">
              <SearchIcon className="text-muted-foreground size-4" />
              <Command.Input
                placeholder={searchPlaceholder}
                className="placeholder:text-muted-foreground h-10 w-full bg-transparent text-sm outline-none"
              />
            </div>
          )}
          <Command.List className="max-h-64 overflow-y-auto p-1">
            <Command.Empty className="text-muted-foreground py-6 text-center text-sm">
              {emptyText}
            </Command.Empty>
            {options.map((o) => (
              <Command.Item
                key={o.value}
                value={`${o.label} ${o.value}`}
                keywords={o.keywords}
                onSelect={() => toggle(o.value)}
                className="data-[selected=true]:bg-primary-soft data-[selected=true]:text-primary-text flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm transition-colors duration-150"
              >
                {o.icon}
                <span className="flex-1 truncate">{o.label}</span>
                <CheckIcon
                  className={cn(
                    'text-primary-text size-4 transition-opacity',
                    isSelected(o.value) ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
