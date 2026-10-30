'use client';

import * as React from 'react';
import { XIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';

export function TagsInput({
  value,
  onValueChange,
  placeholder = 'Add a tag…',
  max,
  className,
  id,
  'aria-invalid': invalid,
}: {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  max?: number;
  className?: string;
  id?: string;
  'aria-invalid'?: boolean;
}) {
  const [draft, setDraft] = React.useState('');
  const full = max !== undefined && value.length >= max;

  const add = (raw: string) => {
    const tag = raw.trim();
    if (!tag || full) return;
    if (!value.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      onValueChange([...value, tag]);
    }
    setDraft('');
  };

  return (
    <div
      data-slot="tags-input"
      aria-invalid={invalid}
      className={cn(
        'border-input dark:bg-muted hover:border-primary focus-within:border-ring focus-within:ring-ring/40 aria-invalid:border-destructive focus-within:shadow-glow flex min-h-11 w-full cursor-text flex-wrap items-center gap-1.5 rounded-sm border bg-transparent px-2 py-1.5 font-sans text-sm shadow-sm transition-[border-color,box-shadow] duration-150 focus-within:ring-[3px]',
        className,
      )}
      onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
    >
      {value.map((tag) => (
        <Badge
          key={tag}
          className="animate-in fade-in-0 zoom-in-95 gap-1 pr-1 duration-150"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onValueChange(value.filter((t) => t !== tag))}
            className="hover:bg-foreground/10 cursor-pointer rounded-xs transition-colors"
          >
            <XIcon />
          </button>
        </Badge>
      ))}
      <input
        id={id}
        value={draft}
        disabled={full}
        placeholder={full ? '' : placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => add(draft)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add(draft);
          } else if (e.key === 'Backspace' && !draft && value.length) {
            onValueChange(value.slice(0, -1));
          }
        }}
        className="placeholder:text-muted-foreground min-w-24 flex-1 bg-transparent px-1 outline-none"
      />
    </div>
  );
}
