import type { CSSProperties, ReactNode } from 'react';

type Props = {
  id: string;
  height: string;
  className?: string;
  children: ReactNode;
};

// Tall track + sticky stage (Experience §4.1). Sticky and the track length apply only under
// [data-love-motion] (app/globals.css), so Calm mode falls back to natural height.
export function StickyStage({ id, height, className, children }: Props) {
  return (
    <div
      data-stage={id}
      style={{ '--stage-h': height } as CSSProperties}
      className="relative"
    >
      <div data-stage-inner className={className}>
        {children}
      </div>
    </div>
  );
}
