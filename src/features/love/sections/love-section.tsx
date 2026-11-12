import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type Props = {
  id: string;
  dawn: 0 | 1;
  className?: string;
  children: ReactNode;
};

// Section landmark with a static night/day stand-in; Phase 2 scrubs --dawn on the root instead.
export function LoveSection({ id, dawn, className, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-dawn={dawn}
      className={cn(
        'bg-background text-foreground relative px-4 py-24 md:px-8 md:py-32',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {children}
      </div>
    </section>
  );
}

export const sectionTitle = 'text-h2 text-balance break-words';
export const proseColumn = 'max-w-[60ch] text-body text-pretty';
export const labelText =
  'font-sans text-small tracking-wide text-muted-foreground uppercase';
