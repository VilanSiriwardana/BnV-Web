import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type Props = {
  label: string;
  href: string;
  image: { light: string; dark: string };
};

export function CategoryCard({ label, href, image }: Props) {
  return (
    <Link
      href={href}
      className="group focus-visible:ring-ring block overflow-hidden rounded-md outline-none focus-visible:ring-[3px]"
    >
      <div className="bg-muted relative aspect-[4/5]">
        {[
          { src: image.light, cls: 'dark:hidden' },
          { src: image.dark, cls: 'hidden dark:block' },
        ].map(({ src, cls }) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="(min-width: 1024px) 14vw, (min-width: 640px) 25vw, 50vw"
            className={cn(
              'ease-standard object-cover transition-transform duration-300 motion-safe:group-hover:scale-105',
              cls,
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="font-display text-h4 absolute inset-x-0 bottom-0 p-4 font-semibold text-white">
          {label}
        </span>
      </div>
    </Link>
  );
}
