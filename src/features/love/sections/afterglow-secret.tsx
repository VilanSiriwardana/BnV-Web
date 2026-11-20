'use client';

import { Lock, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import type { LoveSiteConfig } from '../config';
import { playChime } from '../engine/chime';
import { director } from '../engine/heart-director';
import {
  HIDDEN_HEART_IDS,
  hiddenHearts,
  usePersistedSet,
} from '../engine/hidden-hearts';
import { NoteDialog } from '../ui/note-dialog';
import { labelText } from './love-section';

type Secret = NonNullable<NonNullable<LoveSiteConfig['afterglow']>['secret']>;
const TOTAL = HIDDEN_HEART_IDS.length;

// Romance Additions F9: locked until all five hidden hearts are found on this device.
export function AfterglowSecret({
  slug,
  secret,
  hint,
}: {
  slug: string;
  secret: Secret;
  hint: string;
}) {
  const count = usePersistedSet(hiddenHearts(slug)).length;
  const unlocked = count >= TOTAL;
  const [showHint, setShowHint] = useState(false);
  const [open, setOpen] = useState(false);
  const [returnTo, setReturnTo] = useState<HTMLElement | null>(null);
  const prev = useRef(count);

  useEffect(() => {
    const was = prev.current;
    prev.current = count;
    if (was >= TOTAL || count < TOTAL) return;
    void director.play('glowUp');
    [0, 2, 4].forEach((n, i) => window.setTimeout(() => playChime(n), i * 180));
  }, [count]);

  return (
    <div
      data-reveal
      className="border-gold/40 bg-surface/60 w-full max-w-lg rounded-lg border p-6"
    >
      <h3
        id="afterglow-secret-title"
        className="text-h3 font-display flex items-center justify-center gap-2"
      >
        {unlocked ? (
          <Sparkles aria-hidden className="text-gold size-5" />
        ) : (
          <Lock aria-hidden className="size-5" />
        )}
        A secret room…
      </h3>
      <p className={`${labelText} mt-2`} aria-live="polite">
        {count} of {TOTAL} hidden hearts found
      </p>
      {unlocked ? (
        <Button
          variant="love-primary"
          className="mt-6"
          onClick={(e) => {
            setReturnTo(e.currentTarget);
            setOpen(true);
          }}
        >
          Open the secret room
        </Button>
      ) : (
        <div className="mt-4">
          <Button
            variant="love-link"
            size="inline"
            aria-expanded={showHint}
            onClick={() => setShowHint((s) => !s)}
          >
            {showHint ? 'Hide the hint' : 'A little hint'}
          </Button>
          {showHint && (
            <p className="text-body text-muted-foreground mt-3 text-pretty">
              {hint}
            </p>
          )}
        </div>
      )}
      <NoteDialog
        note={open && unlocked ? secret : null}
        onClose={() => setOpen(false)}
        returnFocusTo={returnTo}
      />
    </div>
  );
}
