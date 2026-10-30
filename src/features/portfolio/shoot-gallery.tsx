'use client';

import { Play, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { imageQuality, imageSizes } from '@/config/images';
import { mediaSrc, videoLabels, type ShootMedia } from '@/data/portfolio';
import { cn } from '@/lib/utils/cn';

const tabs = [
  { value: 'all', label: 'All' },
  { value: 'photo', label: 'Photos' },
  { value: 'video', label: 'Videos' },
] as const;

const duration = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export function ShootGallery({ media }: { media: ShootMedia[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]['value']>('all');
  const [open, setOpen] = useState<number | null>(null);
  const items = media.filter((m) => tab === 'all' || m.kind === tab);
  const current = open === null ? null : items[open];

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight')
        setOpen((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === 'ArrowLeft')
        setOpen((i) =>
          i === null ? i : (i - 1 + items.length) % items.length,
        );
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, items.length]);

  return (
    <div>
      <div role="tablist" aria-label="Media type" className="mb-6 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              'text-small rounded-full border px-4 py-1.5',
              tab === t.value &&
                'bg-primary text-primary-foreground border-primary',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((m, i) => (
          <li key={m.cloudinaryId} className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group bg-muted relative block w-full overflow-hidden rounded-lg"
              aria-label={`Open ${m.alt}`}
            >
              {m.kind === 'photo' ? (
                <Image
                  src={mediaSrc(m.cloudinaryId)}
                  alt={m.alt}
                  width={m.width}
                  height={m.height}
                  sizes={imageSizes.portfolioCover}
                  quality={imageQuality.default}
                  className="h-auto w-full"
                />
              ) : (
                <div className="relative aspect-video">
                  <Image
                    src={mediaSrc(m.posterId)}
                    alt={m.alt}
                    fill
                    sizes={imageSizes.videoPoster}
                    quality={imageQuality.default}
                    className="object-cover"
                  />
                  <span className="bg-background/80 absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full">
                    <Play className="size-5" aria-hidden />
                  </span>
                  <span className="text-caption bg-background/80 absolute bottom-2 left-2 rounded px-2 py-0.5">
                    {videoLabels[m.label]} · {duration(m.durationSec)}
                  </span>
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="bg-scrim/90 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setOpen(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white"
            onClick={() => setOpen(null)}
            aria-label="Close"
            autoFocus
          >
            <X />
          </Button>
          <div
            className="relative max-h-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {current.kind === 'photo' ? (
              <Image
                src={mediaSrc(current.cloudinaryId)}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="100vw"
                quality={imageQuality.hero}
                className="max-h-[85vh] w-auto object-contain"
              />
            ) : (
              <video
                src={mediaSrc(current.cloudinaryId, 'video')}
                poster={mediaSrc(current.posterId)}
                controls
                autoPlay
                className="max-h-[85vh]"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
