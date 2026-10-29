'use client';

import Image from 'next/image';
import { useId, useState, type ChangeEvent } from 'react';

import { Button } from '@/components/ui/button';
import { FieldError } from '@/components/ui/field-error';
import type { UploadSignature } from '@/lib/cloudinary';

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];

async function uploadOne(file: File, signUrl: string) {
  const signRes = await fetch(signUrl, { method: 'POST' });
  const sign = (await signRes.json()) as UploadSignature & { error?: string };
  if (!signRes.ok) throw new Error(sign.error ?? 'Could not start the upload.');

  const body = new FormData();
  body.set('file', file);
  body.set('api_key', sign.apiKey);
  body.set('timestamp', String(sign.timestamp));
  body.set('signature', sign.signature);
  body.set('folder', sign.folder);
  body.set('allowed_formats', sign.allowedFormats);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
    { method: 'POST', body },
  );
  const data = (await res.json()) as {
    secure_url?: string;
    error?: { message: string };
  };
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message ?? 'The upload failed.');
  }
  return data.secure_url;
}

// Uploads straight to Cloudinary and keeps the URLs in one hidden field, one per line (first = primary).
export function ImageUploader({
  name,
  label,
  signUrl,
  initial = [],
  max = 8,
  hint,
  error,
}: {
  name: string;
  label: string;
  signUrl: string;
  initial?: string[];
  max?: number;
  hint?: string;
  error?: string;
}) {
  const id = useId();
  const [urls, setUrls] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])];
    event.target.value = '';
    if (files.length === 0) return;
    if (urls.length + files.length > max) {
      setMessage(`Please add up to ${max} images.`);
      return;
    }
    const bad = files.find(
      (f) => !TYPES.includes(f.type) || f.size > MAX_BYTES,
    );
    if (bad) {
      setMessage('Images must be JPG, PNG or WebP and under 5 MB.');
      return;
    }

    setBusy(true);
    setMessage(undefined);
    try {
      for (const file of files) {
        const url = await uploadOne(file, signUrl);
        setUrls((current) => [...current, url]);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'The upload failed.');
    } finally {
      setBusy(false);
    }
  };

  const move = (index: number, by: number) =>
    setUrls((current) => {
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(Math.max(0, index + by), 0, item);
      return next;
    });

  return (
    <div>
      <label htmlFor={id} className="text-small mb-1 block font-medium">
        {label}
        {hint && (
          <span className="text-caption text-muted-foreground block font-normal">
            {hint}
          </span>
        )}
      </label>
      <input type="hidden" name={name} value={urls.join('\n')} />
      {urls.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-2">
          {urls.map((url, i) => (
            <li key={url} className="border-border w-28 rounded-sm border p-1">
              <Image
                src={url}
                alt=""
                width={112}
                height={112}
                className="aspect-square w-full object-cover"
              />
              <div className="mt-1 flex justify-between">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Move earlier"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  ←
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Remove image"
                  onClick={() =>
                    setUrls((current) => current.filter((u) => u !== url))
                  }
                >
                  ×
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <input
        id={id}
        type="file"
        accept={TYPES.join(',')}
        multiple={max > 1}
        disabled={busy || urls.length >= max}
        onChange={onChange}
        className="text-small file:border-input file:mr-3 file:rounded-sm file:border file:bg-transparent file:px-3 file:py-1.5"
      />
      {busy && (
        <p className="text-caption text-muted-foreground mt-1">Uploading…</p>
      )}
      <FieldError id={`${id}-error`} message={message ?? error} />
    </div>
  );
}
