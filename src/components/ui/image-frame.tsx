import Image from 'next/image';

import { imageQuality, imageSizes } from '@/config/images';
import { blurFor } from '@/lib/utils/image';
import { cn } from '@/lib/utils/cn';

type Props = {
  src: string;
  alt: string;
  sizes?: string;
  aspect?: string;
  priority?: boolean;
  zoom?: boolean;
  scrim?: boolean;
  className?: string;
  imageClassName?: string;
};

// Framed next/image: blur-up placeholder, rounded frame, ≤1.03 hover zoom when inside a `group`.
export function ImageFrame({
  src,
  alt,
  sizes = imageSizes.card,
  aspect = 'aspect-[4/5]',
  priority,
  zoom = true,
  scrim,
  className,
  imageClassName,
}: Props) {
  return (
    <div
      data-slot="image-frame"
      className={cn(
        'bg-primary-soft relative overflow-hidden rounded-lg',
        aspect,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={imageQuality.default}
        priority={priority}
        {...blurFor(src)}
        className={cn(
          'object-cover',
          zoom &&
            'ease-standard transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
          imageClassName,
        )}
      />
      {scrim && (
        <div
          aria-hidden
          className="from-foreground/60 absolute inset-0 bg-linear-to-t via-transparent to-transparent"
        />
      )}
    </div>
  );
}
