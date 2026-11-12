import { cn } from '@/lib/utils/cn';

import type { LoveSiteConfig } from '../config';
import { LovePhoto } from './love-photo';
import { LoveSection, labelText, sectionTitle } from './love-section';

type Props = { title: string; items: LoveSiteConfig['timeline'] };

export function Timeline({ title, items }: Props) {
  return (
    <LoveSection id="timeline" dawn={0}>
      <h2 id="timeline-title" className={sectionTitle}>
        {title}
      </h2>
      <ol className="border-gold mt-12 flex w-full max-w-2xl flex-col gap-8 border-l-2 pl-6 text-left md:pl-10">
        {items.map((t) => (
          <li
            key={t.id}
            className={cn(
              'border-border bg-surface relative rounded-lg border p-5',
              t.featured && 'border-gold',
            )}
          >
            <span
              aria-hidden
              className="bg-gold absolute top-6 -left-[calc(1.5rem+7px)] size-3 rounded-full md:-left-[calc(2.5rem+7px)]"
            />
            {t.photo && (
              <LovePhoto
                photo={t.photo}
                sizes="(min-width: 768px) 40rem, 100vw"
                className="mb-4 aspect-[16/9] w-full rounded-md object-cover"
              />
            )}
            <p className={labelText}>{t.date}</p>
            <h3 className="text-h3 mt-1 break-words">{t.title}</h3>
            <p className="text-body mt-2 text-pretty">{t.text}</p>
          </li>
        ))}
      </ol>
    </LoveSection>
  );
}
