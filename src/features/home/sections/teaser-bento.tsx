import Link from 'next/link';

import { ArtDirectedImage } from '@/components/marketing/art-directed-image';
import { Eyebrow } from '@/components/marketing/eyebrow';
import { ClipReveal } from '@/components/motion/clip-reveal';
import { teasers } from '@/data/home';
import { cn } from '@/lib/utils';

const tiles = [
  { ...teasers.custom, large: true },
  { ...teasers.loveWebsites, large: false },
];

export function TeaserBento() {
  return (
    <section
      aria-label="Made for you"
      className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-24"
    >
      <ul className="grid gap-4 md:grid-cols-5">
        {tiles.map((tile, i) => (
          <li
            key={tile.title}
            className={cn(tile.large ? 'md:col-span-3' : 'md:col-span-2')}
          >
            <ClipReveal delay={i * 0.08} className="h-full">
              <Link
                href={tile.cta.href}
                className="group focus-visible:ring-offset-background relative isolate flex h-full min-h-96 items-end overflow-hidden rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-white focus-visible:ring-offset-2 md:min-h-72"
              >
                <ArtDirectedImage
                  image={{ ...tile.image, alt: '' }}
                  className="ease-standard absolute inset-0 -z-10 aspect-auto h-full transition-transform duration-400 motion-safe:group-hover:scale-[1.03] md:aspect-auto"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/45 to-black/5"
                />
                <div className="p-6 text-white md:p-8">
                  <Eyebrow className="text-white/90">{tile.eyebrow}</Eyebrow>
                  <h3
                    className={cn(
                      'font-display mt-3 block font-semibold text-balance',
                      tile.large ? 'text-h1' : 'text-h3',
                    )}
                  >
                    {tile.title}
                  </h3>
                  <span
                    className={cn(
                      'mt-3 block max-w-md text-white/90',
                      !tile.large && 'line-clamp-2',
                    )}
                  >
                    {tile.description}
                  </span>
                  <span className="mt-5 inline-flex min-h-11 items-center font-sans text-sm font-semibold underline underline-offset-4">
                    {tile.cta.label}
                  </span>
                </div>
              </Link>
            </ClipReveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
