import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { blurFor } from '@/lib/utils/image';

type Props = {
  title: string;
  text?: string;
  icon?: LucideIcon;
  image?: { src: string; alt: string };
  link?: { label: string; href: string };
  className?: string;
};

// White bordered card from the PageImages mockups: optional image or icon, title, text, "label →" link.
export function FeatureCard({
  title,
  text,
  icon: Icon,
  image,
  link,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground border-border relative flex flex-col overflow-hidden rounded-md border shadow-sm transition-shadow duration-250 has-[a:hover]:shadow-md',
        className,
      )}
    >
      {image && (
        <div className="bg-muted relative aspect-[4/3]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            {...blurFor(image.src)}
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {Icon && (
          <span className="bg-primary/20 text-primary-text grid size-10 place-items-center rounded-full">
            <Icon aria-hidden strokeWidth={1.5} className="size-5" />
          </span>
        )}
        <h3 className="font-display text-h4 font-semibold">{title}</h3>
        {text && <p className="text-muted-foreground">{text}</p>}
        {link && (
          <Link
            href={link.href}
            className="text-caption text-primary-text mt-auto inline-flex min-h-11 items-center gap-1 pt-2 font-sans font-semibold tracking-widest uppercase after:absolute after:inset-0"
          >
            {link.label} <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
