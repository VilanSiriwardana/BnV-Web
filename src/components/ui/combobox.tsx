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
import { fieldTrigger, optionRow } from '@/components/ui/styles';
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
  /** Renders hidden inputs so the value submits with a surrounding form. */
  name?: string;
  /** Submits the surrounding form after each change. */
  autoSubmit?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  'aria-describedby'?: string;
};

type SingleProps = BaseProps & {
  mode?: 'single';
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
};

type MultiProps = BaseProps & {
  mode: 'multi';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type ComboboxProps = SingleProps | MultiProps;

const toList = (v: string | string[] | null | undefined) =>
  Array.isArray(v) ? v : v ? [v] : [];

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
    name,
    autoSubmit,
  } = props;
  const multi = props.mode === 'multi';
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState(() => toList(props.defaultValue));
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listId = React.useId();
  const byValue = React.useMemo(
    () => new Map(options.map((o) => [o.value, o])),
    [options],
  );

  const values = props.value !== undefined ? toList(props.value) : inner;
  const selected = multi ? values : [];
  const isSelected = (v: string) => values.includes(v);

  const commit = (next: string[]) => {
    setInner(next);
    if (props.mode === 'multi') props.onValueChange?.(next);
    else props.onValueChange?.(next[0] ?? null);
    if (autoSubmit) {
      queueMicrotask(() => triggerRef.current?.form?.requestSubmit());
    }
  };

  const toggle = (v: string) => {
    if (multi) {
      commit(isSelected(v) ? values.filter((x) => x !== v) : [...values, v]);
    } else {
      commit(isSelected(v) ? [] : [v]);
      setOpen(false);
    }
  };

  const single = !multi && values[0] ? byValue.get(values[0]) : null;
  const empty = values.length === 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {name &&
        (multi ? (
          values.map((v) => (
            <input key={v} type="hidden" name={name} value={v} />
          ))
        ) : (
          <input type="hidden" name={name} value={values[0] ?? ''} />
        ))}
      <PopoverTrigger asChild disabled={disabled}>
        <button
          ref={(el) => {
            triggerRef.current = el;
            if (typeof props.ref === 'function') props.ref(el);
            else if (props.ref) props.ref.current = el;
          }}
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-invalid={props['aria-invalid']}
          aria-describedby={props['aria-describedby']}
          data-placeholder={empty || undefined}
          className={cn(fieldTrigger, 'group/combo h-auto min-h-11', className)}
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
              <Badge
                key={v}
                variant="default"
                className="animate-in fade-in-0 zoom-in-95 gap-1 pr-1 duration-150"
              >
                {byValue.get(v)?.label ?? v}
                <span
                  role="button"
                  tabIndex={-1}
                  aria-label={`Remove ${byValue.get(v)?.label ?? v}`}
                  className="hover:bg-foreground/10 cursor-pointer rounded-xs transition-colors"
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
          <ChevronsUpDownIcon className="text-muted-foreground group-data-[state=open]/combo:text-primary-text size-4 shrink-0 transition-colors" />
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
            {options.map((o, i) => (
              <Command.Item
                key={o.value}
                value={`${o.label} ${o.value}`}
                keywords={o.keywords}
                onSelect={() => toggle(o.value)}
                data-spotlight
                data-checked={isSelected(o.value)}
                style={{ animationDelay: `${Math.min(i, 10) * 20}ms` }}
                className={optionRow}
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
