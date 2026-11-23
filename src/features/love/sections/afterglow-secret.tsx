'use client';

import {
  Camera,
  Check,
  Images,
  Lightbulb,
  Lock,
  type LucideIcon,
  PenLine,
  Sparkles,
  Spline,
  UserRound,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

import type { LoveSiteConfig } from '../config';
import { playChime } from '../engine/chime';
import { director } from '../engine/heart-director';
import {
  HIDDEN_HEART_IDS,
  type HiddenHeartId,
  hiddenHearts,
  usePersistedSet,
} from '../engine/hidden-hearts';
import { NoteDialog } from '../ui/note-dialog';
import { labelText } from './love-section';

type Secret = NonNullable<NonNullable<LoveSiteConfig['afterglow']>['secret']>;
const TOTAL = HIDDEN_HEART_IDS.length;

const CLUES: Record<
  HiddenHeartId,
  { icon: LucideIcon; text: string; tone: string }
> = {
  hero: { icon: UserRound, text: 'Near your name', tone: 'text-secondary' },
  memories: { icon: Images, text: 'The memories title', tone: 'text-primary' },
  timeline: { icon: Spline, text: 'The end of our thread', tone: 'text-gold' },
  gallery: { icon: Camera, text: 'One gallery photo', tone: 'text-secondary' },
  letter: { icon: PenLine, text: 'My signature', tone: 'text-primary' },
};

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
  const found = usePersistedSet(hiddenHearts(slug));
  const count = found.length;
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
      className="border-gold/40 bg-surface/60 w-full max-w-lg rounded-2xl border p-6 shadow-[0_0_48px_-20px_var(--gold)] backdrop-blur-sm md:p-8"
    >
      <h3
        id="afterglow-secret-title"
        className="text-h3 font-display flex items-center justify-center gap-2"
      >
        {unlocked ? (
          <Sparkles aria-hidden className="text-gold size-5" />
        ) : (
          <Lock aria-hidden className="text-primary size-5" />
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
            <Lightbulb aria-hidden className="text-gold size-4" />
            {showHint ? 'Hide the hints' : 'A little hint'}
          </Button>
          {showHint && (
            <div className="animate-in fade-in slide-in-from-bottom-2 mt-5 duration-500 motion-reduce:animate-none">
              <ul className="grid gap-2 text-left sm:grid-cols-2">
                {HIDDEN_HEART_IDS.map((id) => {
                  const { icon: Icon, text, tone } = CLUES[id];
                  const got = found.includes(id);
                  return (
                    <li
                      key={id}
                      className={cn(
                        'flex items-center gap-3 rounded-full border px-3 py-2 font-sans text-sm transition-colors',
                        got
                          ? 'border-gold/70 bg-gold/10 text-gold-text shadow-[0_0_18px_-6px_var(--gold)]'
                          : 'border-gold/20 bg-surface/80 text-foreground/85',
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'bg-background/60 grid size-8 shrink-0 place-items-center rounded-full',
                          got ? 'text-gold' : tone,
                        )}
                      >
                        {got ? (
                          <Check className="size-4" />
                        ) : (
                          <Icon className="size-4" />
                        )}
                      </span>
                      <span className="min-w-0">
                        {text}
                        <span className="sr-only">
                          {got ? ', found' : ', not found yet'}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="text-small text-muted-foreground mt-4 text-pretty italic">
                {hint}
              </p>
            </div>
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
