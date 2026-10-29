'use client';

import Image from 'next/image';
import { useState } from 'react';

import { imageQuality, imageSizes } from '@/config/images';
import { cn } from '@/lib/utils';
import { blurFor } from '@/lib/utils/image';

type GalleryImage = { id: string; imageUrl: string; altText: string | null };

type Props = { images: GalleryImage[]; name: string };

export function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-muted relative aspect-[4/5] overflow-hidden rounded-md">
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
            className="object-cover"
          />
        )}
      </div>
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
                  'bg-muted focus-visible:ring-ring relative block aspect-[4/5] w-full overflow-hidden rounded-sm outline-none focus-visible:ring-[3px]',
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
