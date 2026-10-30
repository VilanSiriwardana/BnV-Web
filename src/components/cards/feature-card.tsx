import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { ImageFrame } from '@/components/ui/image-frame';
import { cn } from '@/lib/utils/cn';

import { cardShell, type CardStyle } from './variants';

export type FeatureCardProps = {
  title: string;
  text?: string;
  icon?: LucideIcon;
  image?: { src: string; alt: string };
  link?: { label: string; href: string };
  className?: string;
  variant?: CardStyle;
};

export function FeatureCard({
  title,
  text,
  icon: Icon,
  image,
  link,
  className,
  variant = 'solid',
}: FeatureCardProps) {
  return (
    <div
      data-spotlight
      className={cn(
        cardShell(variant),
        'relative overflow-hidden',
        !link && 'active:scale-100',
        className,
      )}
    >
      {image && (
        <ImageFrame
          src={image.src}
          alt={image.alt}
          aspect="landscape"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="rounded-none"
        />
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {Icon && (
          <span className="bg-primary-soft text-primary-text group-hover:bg-primary group-hover:text-primary-foreground grid size-10 place-items-center rounded-full transition-colors duration-250">
            <Icon aria-hidden strokeWidth={1.5} className="size-5" />
          </span>
        )}
        <h3 className="font-display text-h4 font-semibold">{title}</h3>
        {text && <p className="text-muted-foreground">{text}</p>}
        {link && (
          <Link
            href={link.href}
            className="text-caption text-primary-text mt-auto inline-flex min-h-11 items-center gap-1 pt-2 font-sans font-semibold tracking-widest uppercase outline-none after:absolute after:inset-0"
          >
            {link.label}
            <span
              aria-hidden
              className="ease-standard transition-transform duration-150 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
