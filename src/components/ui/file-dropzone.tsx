'use client';

import * as React from 'react';
import { UploadCloudIcon, XIcon } from 'lucide-react';

import { FieldError } from '@/components/ui/field-error';
import { cn } from '@/lib/utils/cn';

const DEFAULT_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function FileDropzone({
  value,
  onValueChange,
  accept = DEFAULT_TYPES,
  maxSizeMb = 5,
  multiple = true,
  className,
  id,
}: {
  value: File[];
  onValueChange: (files: File[]) => void;
  accept?: string[];
  maxSizeMb?: number;
  multiple?: boolean;
  className?: string;
  id?: string;
}) {
  const fallbackId = React.useId();
  const inputId = id ?? fallbackId;
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const previews = React.useMemo(
    () =>
      value.map((f) =>
        f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
      ),
    [value],
  );
  React.useEffect(
    () => () => previews.forEach((u) => u && URL.revokeObjectURL(u)),
    [previews],
  );

  const take = (list: FileList | null) => {
    if (!list) return;
    const files = Array.from(list);
    const bad = files.find(
      (f) => !accept.includes(f.type) || f.size > maxSizeMb * 1024 * 1024,
    );
    setError(
      bad
        ? `${bad.name}: use ${accept.map((t) => t.split('/')[1]).join(', ')} up to ${maxSizeMb} MB.`
        : undefined,
    );
    const ok = files.filter(
      (f) =>
        f !== bad &&
        accept.includes(f.type) &&
        f.size <= maxSizeMb * 1024 * 1024,
    );
    onValueChange(multiple ? [...value, ...ok] : ok.slice(0, 1));
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <label
        htmlFor={inputId}
        data-dragging={dragging || undefined}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          take(e.dataTransfer.files);
        }}
        className="border-input hover:border-primary hover:bg-primary-soft/50 data-[dragging]:border-primary data-[dragging]:bg-primary-soft data-[dragging]:shadow-glow focus-within:border-ring focus-within:ring-ring/40 flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-10 text-center font-sans transition-[border-color,background-color,box-shadow] duration-250 focus-within:ring-[3px]"
      >
        <span className="bg-primary-soft text-primary-text grid size-12 place-items-center rounded-full">
          <UploadCloudIcon className="size-5" strokeWidth={1.5} />
        </span>
        <span className="text-sm font-semibold">
          Drop files here or <span className="text-primary-text">browse</span>
        </span>
        <span className="text-caption text-muted-foreground">
          {accept.map((t) => t.split('/')[1].toUpperCase()).join(', ')} · up to{' '}
          {maxSizeMb} MB
        </span>
        <input
          id={inputId}
          type="file"
          accept={accept.join(',')}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => {
            take(e.target.files);
            e.target.value = '';
          }}
        />
      </label>
      <FieldError id={`${inputId}-error`} message={error} />
      {value.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="border-border bg-card animate-in fade-in-0 zoom-in-95 relative aspect-square overflow-hidden rounded-md border shadow-sm"
            >
              {previews[i] ? (
                // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
                <img
                  src={previews[i]}
                  alt={f.name}
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-caption grid size-full place-items-center p-2 break-all">
                  {f.name}
                </span>
              )}
              <button
                type="button"
                aria-label={`Remove ${f.name}`}
                onClick={() => onValueChange(value.filter((_, j) => j !== i))}
                className="glass focus-ring absolute top-1.5 right-1.5 grid size-7 cursor-pointer place-items-center rounded-full border"
              >
                <XIcon className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
