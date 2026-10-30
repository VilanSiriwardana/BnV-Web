import Image from 'next/image';
import Link from 'next/link';

import { imageQuality, imageSizes } from '@/config/images';
import { routes } from '@/config/routes';
import {
  categoryLabels,
  featuredLabels,
  mediaSrc,
  type Shoot,
} from '@/data/portfolio';

export function ShootCard({ shoot }: { shoot: Shoot }) {
  return (
    <Link href={routes.shoot(shoot.slug)} className="group block">
      <div className="bg-muted relative aspect-[3/4] overflow-hidden rounded-lg">
        <Image
          src={mediaSrc(shoot.cover.cloudinaryId)}
          alt={shoot.cover.alt}
          fill
          sizes={imageSizes.portfolioCover}
          quality={imageQuality.default}
          className="ease-standard object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.03]"
        />
      </div>
      <p className="text-caption text-primary-text mt-3">
        {featuredLabels[shoot.featured]} ·{' '}
        {shoot.categories.map((c) => categoryLabels[c]).join(', ')}
      </p>
      <h3 className="font-display text-h4 mt-1">{shoot.title}</h3>
      <p className="text-small text-muted-foreground mt-1 line-clamp-2">
        {shoot.summary}
      </p>
    </Link>
  );
}
