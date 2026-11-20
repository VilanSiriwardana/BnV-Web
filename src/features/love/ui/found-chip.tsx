'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils/cn';

import {
  HIDDEN_HEART_IDS,
  hiddenHearts,
  usePersistedSet,
} from '../engine/hidden-hearts';
import { TinyHeart } from '../sections/letter-ornaments';

const SHOW_MS = 3000;

// Romance Additions F9: "3 of 5" beside the music toggle, for 3 s after each find.
export function FoundChip({ slug }: { slug: string }) {
  const count = usePersistedSet(hiddenHearts(slug)).length;
  const [visible, setVisible] = useState(false);
  const last = useRef(count);

  useEffect(() => {
    if (count === last.current) return;
    last.current = count;
    const show = window.setTimeout(() => setVisible(true), 0);
    const hide = window.setTimeout(() => setVisible(false), SHOW_MS);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [count]);

  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        'border-border bg-surface/80 text-small fixed top-4 right-17 z-20 flex h-11 items-center gap-2 rounded-md border px-3 font-sans transition-opacity duration-300',
        visible && count > 0 ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <TinyHeart className="text-gold size-3.5" />
      {count > 0 && `${count} of ${HIDDEN_HEART_IDS.length} hidden hearts`}
    </p>
  );
}
