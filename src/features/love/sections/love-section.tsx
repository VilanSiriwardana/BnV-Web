import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

import { StickyStage } from '../ui/sticky-stage';

type Props = {
  id: string;
  /** Night depth stop for Calm mode (0 aubergine → 1 velvet plum); motion scrubs --depth instead. */
  depth?: 0 | 0.5 | 1;
  /** Scroll length of the sticky stage (Experience §4.1), e.g. '200vh'. Omit for natural flow. */
  stage?: string;
  className?: string;
  children: ReactNode;
};

const padding = 'px-4 py-24 md:px-8 md:py-32';

// Section landmark. `data-depth` is the static night depth used in Calm mode; with motion on,
// the root's scrubbed --depth wins (selectors scoped in app/globals.css).
export function LoveSection({
  id,
  depth = 0,
  stage,
  className,
  children,
}: Props) {
  const content = (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
      {children}
    </div>
  );

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-love-section
      data-depth={depth}
      className={cn(
        'bg-background text-foreground relative',
        !stage && padding,
        !stage && className,
      )}
    >
      {stage ? (
        <StickyStage id={id} height={stage} className={cn(padding, className)}>
          {content}
        </StickyStage>
      ) : (
        content
      )}
    </section>
  );
}

export const sectionTitle = 'text-h2 text-gold-text text-balance break-words';
export const proseColumn = 'max-w-[60ch] text-body text-pretty';
export const labelText =
  'font-sans text-small tracking-wide text-muted-foreground uppercase';
