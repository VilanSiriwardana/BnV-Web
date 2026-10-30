import { getImageProps } from 'next/image';

import { imageQuality, imageSizes } from '@/config/images';
import type { ArtDirectedImage as ArtDirectedImageData } from '@/data/home';
import { cn } from '@/lib/utils';
import { imagePlaceholders } from '@/data/image-placeholders';

type Props = {
  image: ArtDirectedImageData;
  eager?: boolean;
  className?: string;
};

// <picture> downloads only the desktop (1920×650) or mobile (1:1) file; the theme swap is CSS.
// Only the light variant of an eager image is fetched with high priority.
export function ArtDirectedImage({ image, eager, className }: Props) {
  const themes = [
    { variant: image.light, cls: 'dark:hidden', isEager: eager },
    { variant: image.dark, cls: 'hidden dark:block', isEager: false },
  ];

  return (
    <div
      className={cn(
        'bg-muted relative aspect-square w-full overflow-hidden md:aspect-[1920/650]',
        className,
      )}
    >
      {themes.map(({ variant, cls, isEager }) => {
        const common = {
          alt: image.alt,
          fill: true,
          sizes: imageSizes.hero,
          quality: isEager ? imageQuality.hero : imageQuality.default,
        };
        const {
          props: { srcSet: desktopSrcSet },
        } = getImageProps({ ...common, src: variant.desktop });
        const { props } = getImageProps({
          ...common,
          src: variant.mobile,
          loading: isEager ? 'eager' : 'lazy',
          fetchPriority: isEager ? 'high' : undefined,
        });
        const blur = imagePlaceholders[variant.mobile];

        return (
          <picture
            key={variant.desktop}
            className={cn('absolute inset-0 bg-cover bg-center', cls)}
            style={blur ? { backgroundImage: `url("${blur}")` } : undefined}
          >
            <source
              media="(min-width: 768px)"
              srcSet={desktopSrcSet}
              sizes={imageSizes.hero}
            />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- props come from getImageProps */}
            <img
              {...props}
              className="object-cover"
              style={{
                ...props.style,
                objectPosition: image.objectPosition ?? 'right center',
              }}
            />
          </picture>
        );
      })}
    </div>
  );
}
