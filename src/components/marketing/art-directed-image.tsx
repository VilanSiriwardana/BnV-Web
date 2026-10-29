import Image from 'next/image';

import type { ArtDirectedImage as ArtDirectedImageData } from '@/data/home';
import { cn } from '@/lib/utils';

type Props = {
  image: ArtDirectedImageData;
  priority?: boolean;
  className?: string;
};

// Light/dark and desktop (1920×650) / mobile (1:1) variants, swapped by CSS so layout never shifts.
export function ArtDirectedImage({ image, priority, className }: Props) {
  const variants = [
    {
      src: image.light.desktop,
      cls: 'hidden md:block dark:md:hidden',
      eager: priority,
    },
    { src: image.light.mobile, cls: 'md:hidden dark:hidden' },
    { src: image.dark.desktop, cls: 'hidden dark:md:block' },
    { src: image.dark.mobile, cls: 'hidden dark:block dark:md:hidden' },
  ];

  return (
    <div
      className={cn(
        'bg-muted relative aspect-square w-full overflow-hidden md:aspect-[1920/650]',
        className,
      )}
    >
      {variants.map(({ src, cls, eager }) => (
        <Image
          key={src}
          src={src}
          alt={image.alt}
          fill
          sizes="100vw"
          priority={eager}
          className={cn('object-cover', cls)}
        />
      ))}
    </div>
  );
}
