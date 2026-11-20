'use client';

import { useRef, useState, useSyncExternalStore } from 'react';

import { cn } from '@/lib/utils/cn';

import type { LoveSiteConfig } from '../config';
import { director } from '../engine/heart-director';
import { progressSet, usePersistedSet } from '../engine/hidden-hearts';
import { useQuiet } from '../engine/use-quiet';
import { useHold } from '../hooks/use-hold';
import { NoteDialog, type NoteContent } from '../ui/note-dialog';
import { TinyHeart } from './letter-ornaments';
import { labelText } from './love-section';

type Note = NonNullable<
  NonNullable<LoveSiteConfig['afterglow']>['openWhen']
>[number];

const HOLD_MS = 900;
const noSubscribe = () => () => {};
// Minute resolution keeps the snapshot stable between renders.
const readNow = () => Math.floor(Date.now() / 60_000) * 60_000;
const serverZero = () => 0;
const day = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
});

// Romance Additions F8: sealed scrolls; hold the seal (click in Calm), the note opens on parchment.
export function AfterglowNotes({
  slug,
  notes,
}: {
  slug: string;
  notes: Note[];
}) {
  const set = progressSet(slug, 'notes');
  const opened = usePersistedSet(set);
  const [active, setActive] = useState<NoteContent | null>(null);
  const [returnTo, setReturnTo] = useState<HTMLElement | null>(null);

  return (
    <div data-reveal className="w-full">
      <h3 id="afterglow-notes-title" className="text-h3 font-display">
        Open when…
      </h3>
      <p className={`${labelText} mt-2`} aria-live="polite">
        {opened.length} of {notes.length} opened
      </p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {notes.map((n) => (
          <li key={n.id}>
            <Scroll
              note={n}
              opened={opened.includes(n.id)}
              onOpen={(el) => {
                set.add(n.id);
                setReturnTo(el);
                setActive({
                  label: 'Open when…',
                  title: n.label,
                  paragraphs: n.paragraphs,
                });
              }}
            />
          </li>
        ))}
      </ul>
      <NoteDialog
        note={active}
        onClose={() => setActive(null)}
        returnFocusTo={returnTo}
      />
    </div>
  );
}

function Scroll({
  note,
  opened,
  onOpen,
}: {
  note: Note;
  opened: boolean;
  onOpen: (el: HTMLElement) => void;
}) {
  const quiet = useQuiet();
  const button = useRef<HTMLButtonElement>(null);
  const [progress, setProgress] = useState(0);
  const unlockAt = note.unlockAt ? new Date(note.unlockAt) : null;
  const now = useSyncExternalStore(noSubscribe, readNow, serverZero);
  // Server render treats every dated note as locked; the client corrects it after hydration.
  const locked = unlockAt !== null && unlockAt.getTime() > (now || Infinity);

  const open = () => {
    setProgress(0);
    if (!opened) void director.play('noteOpen');
    if (button.current) onOpen(button.current);
  };

  const { handlers, complete } = useHold({
    duration: HOLD_MS,
    onProgress: setProgress,
    onComplete: open,
    completeOnClick: quiet || opened,
  });

  return (
    <div className="love-parchment relative flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg px-6 py-6">
      <p className="font-display text-h4 text-balance">{note.label}</p>
      <button
        ref={button}
        type="button"
        {...handlers}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.repeat && !locked) {
            e.preventDefault();
            complete();
            return;
          }
          handlers.onKeyDown(e);
        }}
        disabled={locked}
        aria-label={
          locked && now
            ? `${note.label}. Opens on ${day.format(unlockAt!)}`
            : opened
              ? `${note.label}. Read again`
              : `${note.label}. Sealed. Hold or press Enter to open.`
        }
        className={cn(
          'focus-ring relative grid size-22 touch-none place-items-center rounded-full select-none',
          opened ? 'text-gold' : 'text-primary',
          locked && 'opacity-50',
        )}
        style={{ transform: `scale(${1 + progress * 0.08})` }}
      >
        <span
          aria-hidden
          className={cn(
            'absolute inset-2 rounded-full border-3 border-current transition-[clip-path] duration-300',
            progress > 0.5 && '[clip-path:inset(0_52%_0_0)]',
          )}
        />
        <TinyHeart className="size-8" />
      </button>
      <p className="text-small text-muted-foreground font-sans">
        {locked && now
          ? `Opens on ${day.format(unlockAt!)}`
          : locked
            ? 'Sealed'
            : opened
              ? 'Opened'
              : 'Sealed'}
      </p>
    </div>
  );
}
