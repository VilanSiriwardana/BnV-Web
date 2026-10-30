'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Lightbox } from '@/components/ui/lightbox';
import { imageQuality, imageSizes } from '@/config/images';
import { cn } from '@/lib/utils';
import { blurFor } from '@/lib/utils/image';

type GalleryImage = { id: string; imageUrl: string; altText: string | null };

type Props = { images: GalleryImage[]; name: string };

export function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const current = images[active];

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label="Open full-screen image viewer"
        disabled={!current}
        className="group bg-muted focus-ring relative block aspect-[4/5] cursor-zoom-in overflow-hidden rounded-md"
      >
        {current && (
          <Image
            src={current.imageUrl}
            alt={current.altText ?? name}
            fill
            loading={active === 0 ? 'eager' : undefined}
            fetchPriority={active === 0 ? 'high' : undefined}
            quality={imageQuality.hero}
            sizes={imageSizes.gallery}
            {...blurFor(current.imageUrl)}
            className="ease-standard object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
          />
        )}
      </button>
      <Lightbox
        open={zoomed}
        onOpenChange={setZoomed}
        startIndex={active}
        label={name}
        images={images.map((img) => ({
          src: img.imageUrl,
          alt: img.altText ?? name,
        }))}
      />
      {images.length > 1 && (
        <ul className="grid grid-cols-5 gap-2">
          {images.map((image, i) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-pressed={i === active}
                className={cn(
                  'bg-muted focus-ring relative block aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-sm opacity-80 transition-opacity hover:opacity-100',
                  i === active && 'ring-primary ring-2',
                )}
              >
                <Image
                  src={image.imageUrl}
                  alt=""
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
