import type { LoveSiteConfig } from '../config';
import { LovePhoto } from './love-photo';
import { LoveSection, labelText, sectionTitle } from './love-section';

type Props = { hint: string; memories: LoveSiteConfig['memories'] };

export function Memories({ hint, memories }: Props) {
  return (
    <LoveSection id="memories" dawn={0} stage="400vh">
      <h2 id="memories-title" className={sectionTitle}>
        Memories
      </h2>
      <p className={`${labelText} mt-3`}>{hint}</p>
      <ul className="mt-12 grid w-full gap-6 text-left sm:grid-cols-2">
        {memories.map((m) => (
          <li
            key={m.id}
            className="border-border bg-surface overflow-hidden rounded-lg border"
          >
            <LovePhoto
              photo={m.photo}
              sizes="(min-width: 640px) 50vw, 100vw"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="p-5">
              <p className={labelText}>{m.date}</p>
              <h3 className="text-h3 mt-1 break-words">{m.title}</h3>
              <p className="text-body mt-2 text-pretty">{m.caption}</p>
            </div>
          </li>
        ))}
      </ul>
    </LoveSection>
  );
}
