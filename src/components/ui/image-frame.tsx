import Image from 'next/image';

import { imageQuality, imageSizes } from '@/config/images';
import { blurFor } from '@/lib/utils/image';
import { cn } from '@/lib/utils/cn';

const aspects = {
  square: 'aspect-square',
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/9]',
} as const;

type Props = {
  src: string;
  alt: string;
  sizes?: string;
  aspect?: keyof typeof aspects | (string & {});
  priority?: boolean;
  zoom?: boolean;
  overlay?: boolean;
  /** @deprecated use `overlay` */
  scrim?: boolean;
  className?: string;
  imageClassName?: string;
  children?: React.ReactNode;
};

// Framed next/image: blur-up placeholder, rounded frame, slow 1.04 zoom when inside a `group`.
export function ImageFrame({
  src,
  alt,
  sizes = imageSizes.card,
  aspect = 'portrait',
  priority,
  zoom = true,
  overlay,
  scrim,
  className,
  imageClassName,
  children,
}: Props) {
  return (
    <div
      data-slot="image-frame"
      className={cn(
        'bg-primary-soft relative overflow-hidden rounded-lg',
        aspects[aspect as keyof typeof aspects] ?? aspect,
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
            'ease-standard transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
          imageClassName,
        )}
      />
      {(overlay || scrim) && (
        <div
          aria-hidden
          className="from-scrim/70 via-scrim/10 absolute inset-0 bg-linear-to-t to-transparent"
        />
      )}
      {children}
    </div>
  );
}
