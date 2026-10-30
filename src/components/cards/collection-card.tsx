import Image from 'next/image';
import Link from 'next/link';

import { imageSizes } from '@/config/images';
import { cn } from '@/lib/utils/cn';
import { blurFor } from '@/lib/utils/image';

import { cardShell, type CardStyle } from './variants';

export type CollectionCardProps = {
  label: string;
  subtitle?: string;
  href: string;
  image: { light: string; dark: string };
  cta?: string;
  variant?: CardStyle;
};

export function CollectionCard({
  label,
  subtitle,
  href,
  image,
  cta = 'Shop now',
  variant = 'solid',
}: CollectionCardProps) {
  return (
    <Link
      href={href}
      data-spotlight
      className={cardShell(variant, 'flex h-full flex-col overflow-hidden')}
    >
      <div className="bg-primary-soft relative aspect-[4/5] overflow-hidden">
        {[
          { src: image.light, cls: 'dark:hidden' },
          { src: image.dark, cls: 'hidden dark:block' },
        ].map(({ src, cls }) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes={imageSizes.categoryCard}
            {...blurFor(src)}
            className={cn(
              'ease-standard object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]',
              cls,
            )}
          />
        ))}
      </div>
      <div className="flex flex-1 flex-col items-center px-3 pt-4 pb-5 text-center">
        <span className="font-display text-h4 group-hover:text-primary-text font-semibold transition-colors md:text-[1.25rem]">
          {label}
        </span>
        {subtitle && (
          <span className="text-small text-foreground/75 mt-1">{subtitle}</span>
        )}
        <span className="text-caption text-primary-text mt-3 inline-flex items-center gap-1 font-sans font-semibold tracking-widest uppercase">
          {cta}
          <span
            aria-hidden
            className="ease-standard transition-transform duration-150 group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
