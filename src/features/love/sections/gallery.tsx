import type { PhotoRef } from '../config';
import { LovePhoto } from './love-photo';
import { LoveSection, sectionTitle } from './love-section';

type Props = { title: string; photos: PhotoRef[] };

export function Gallery({ title, photos }: Props) {
  return (
    <LoveSection id="gallery" dawn={1}>
      <h2 id="gallery-title" className={sectionTitle}>
        {title}
      </h2>
      <ul className="mt-12 w-full columns-2 gap-4 md:columns-3">
        {photos.map((p) => (
          <li
            key={p.src}
            className="border-border bg-surface mb-4 break-inside-avoid overflow-hidden rounded-lg border p-2"
          >
            <LovePhoto
              photo={p}
              sizes="(min-width: 768px) 33vw, 50vw"
              className="h-auto w-full rounded-md"
            />
          </li>
        ))}
      </ul>
    </LoveSection>
  );
}
