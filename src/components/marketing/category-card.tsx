import Image from 'next/image';
import Link from 'next/link';

import { imageSizes } from '@/config/images';
import { cn } from '@/lib/utils';
import { blurFor } from '@/lib/utils/image';

type Props = {
  label: string;
  subtitle?: string;
  href: string;
  image: { light: string; dark: string };
};

export function CategoryCard({ label, subtitle, href, image }: Props) {
  return (
    <Link
      href={href}
      className="group focus-visible:ring-ring bg-card border-border ease-standard flex h-full flex-col overflow-hidden rounded-md border shadow-sm transition-[transform,box-shadow] duration-150 outline-none hover:shadow-md focus-visible:ring-[3px] active:scale-[0.98]"
    >
      <div className="bg-muted relative aspect-[4/5] overflow-hidden">
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
              'ease-standard object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]',
              cls,
            )}
          />
        ))}
      </div>
      <div className="flex flex-1 flex-col items-center px-3 pt-4 pb-5 text-center">
        <span className="font-display text-h4 font-semibold">{label}</span>
        {subtitle && (
          <span className="text-small text-muted-foreground mt-1">
            {subtitle}
          </span>
        )}
        <span className="text-caption text-primary-text mt-3 inline-flex items-center gap-1 font-sans font-semibold tracking-widest uppercase">
          Shop now
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
