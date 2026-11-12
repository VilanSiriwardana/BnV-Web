import Image from 'next/image';

import type { PhotoRef } from '../config';

type Props = { photo: PhotoRef; sizes: string; className?: string };

export function LovePhoto({ photo, sizes, className }: Props) {
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      sizes={sizes}
      placeholder={photo.blur ? 'blur' : 'empty'}
      blurDataURL={photo.blur}
      className={className}
    />
  );
}
