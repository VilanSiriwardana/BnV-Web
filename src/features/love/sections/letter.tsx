import type { LoveSiteConfig } from '../config';
import { LoveSection, sectionTitle } from './love-section';

type Props = { title: string; letter: LoveSiteConfig['letter'] };

export function Letter({ title, letter }: Props) {
  return (
    <LoveSection id="letter" dawn={1}>
      <h2 id="letter-title" className={sectionTitle}>
        {title}
      </h2>
      <article className="border-border bg-surface-elevated mt-12 w-full max-w-2xl rounded-lg border p-8 text-left shadow-sm md:p-12">
        <div className="text-body mx-auto flex max-w-[60ch] flex-col gap-5 text-pretty break-words">
          {letter.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="mt-4 italic">{letter.signoff}</p>
        </div>
      </article>
    </LoveSection>
  );
}
