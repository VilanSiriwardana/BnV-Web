import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { imageQuality, imageSizes } from '@/config/images';
import { routes } from '@/config/routes';
import {
  categoryLabels,
  featuredLabels,
  getShoot,
  mediaSrc,
  relatedShoots,
  shoots,
} from '@/data/portfolio';
import { CollaborateCtas } from '@/features/portfolio/coming-soon';
import { ShootCard } from '@/features/portfolio/shoot-card';
import { ShootGallery } from '@/features/portfolio/shoot-gallery';
import { pageMetadata } from '@/lib/seo/metadata';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return shoots.map((s) => ({ slug: s.slug }));
}

// Indexable only when the shoot has `context` text (D-07).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const shoot = getShoot(slug);
  if (!shoot) return {};
  return pageMetadata({
    title: `${shoot.title} — Visual Portfolio`,
    description: shoot.summary,
    path: routes.shoot(slug),
    image: mediaSrc(shoot.cover.cloudinaryId),
    noindex: !shoot.context,
  });
}

export default async function ShootPage({ params }: Props) {
  const { slug } = await params;
  const shoot = getShoot(slug);
  if (!shoot) notFound();
  const related = relatedShoots(shoot);

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
      <div className="bg-muted relative aspect-[3/4] overflow-hidden rounded-lg sm:aspect-[16/9]">
        <Image
          src={mediaSrc(shoot.cover.cloudinaryId)}
          alt={shoot.cover.alt}
          fill
          priority
          sizes={imageSizes.hero}
          quality={imageQuality.hero}
          className="object-cover"
        />
      </div>
      <header className="mt-8 max-w-3xl">
        <p className="text-caption text-primary-text">
          {featuredLabels[shoot.featured]} ·{' '}
          {shoot.categories.map((c) => categoryLabels[c]).join(', ')} ·{' '}
          {shoot.media.length} items
        </p>
        <h1 className="font-display text-h1 mt-2">{shoot.title}</h1>
        <p className="text-muted-foreground mt-3">{shoot.summary}</p>
        {shoot.context && <p className="mt-4">{shoot.context}</p>}
      </header>

      <section className="mt-12">
        <ShootGallery media={shoot.media} />
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-h3 mb-6">More shoots</h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <li key={s.slug}>
                <ShootCard shoot={s} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16 text-center">
        <h2 className="font-display text-h3 mb-6">Create something with us</h2>
        <CollaborateCtas />
      </section>
    </article>
  );
}
