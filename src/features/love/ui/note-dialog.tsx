'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { useEffect, useMemo, useRef } from 'react';

import { focusRing } from '@/components/ui/styles';
import { duration, ease } from '@/config/motion';
import { cn } from '@/lib/utils/cn';

import type { PhotoRef } from '../config/types';
import { useMotionPrefs } from '../engine/motion-prefs';
import { useLoveScroll } from '../engine/scroll-engine';
import { HeartDivider, ParchmentFrame } from '../sections/letter-ornaments';
import { LovePhoto } from '../sections/love-photo';
import { labelText } from '../sections/love-section';
import { inkReveal } from './afterglow-motion';

export type NoteContent = {
  label?: string;
  title: string;
  paragraphs: string[];
  photo?: PhotoRef;
};

type Props = {
  note: NoteContent | null;
  onClose: () => void;
  returnFocusTo?: HTMLElement | null;
  /** Blueprint 059: the paper grows out of this element and its words ink in. */
  originEl?: HTMLElement | null;
};

// Romance Additions F8/F9: a parchment note, mirroring MemoryDialog (Radix + Motion, Lenis stopped).
export function NoteDialog({ note, onClose, returnFocusTo, originEl }: Props) {
  const { calm } = useMotionPrefs();
  const fadeOnly = useReducedMotion() || calm;
  const { stop, start } = useLoveScroll();
  const open = note !== null;

  useEffect(() => {
    if (!open) return;
    stop();
    return () => start();
  }, [open, stop, start]);

  const transition = { duration: duration.base, ease: ease.standard };
  const body = useRef<HTMLDivElement>(null);
  const handoff = !fadeOnly && !!originEl;
  // Start where the origin sits, so the note reads as the same paper unfolding.
  const from = useMemo(() => {
    if (!handoff || !originEl || !open) return null;
    const r = originEl.getBoundingClientRect();
    const w = Math.min(576, window.innerWidth - 32);
    return {
      opacity: 0.2,
      x: r.left + r.width / 2 - window.innerWidth / 2,
      y: r.top + r.height / 2 - window.innerHeight / 2,
      scale: Math.max(0.15, r.width / w),
      rotateX: -14,
    };
  }, [handoff, originEl, open]);

  useEffect(() => {
    const el = body.current;
    if (!open || !handoff || !el) return;
    return inkReveal(Array.from(el.querySelectorAll('[data-ink]')), {
      delay: 0.45,
    });
  }, [open, handoff]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {note && (
          <DialogPrimitive.Portal
            forceMount
            container={document.querySelector<HTMLElement>('[data-love-root]')}
          >
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="bg-scrim/40 fixed inset-0 z-50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              asChild
              forceMount
              aria-describedby={undefined}
              onCloseAutoFocus={(e) => {
                if (!returnFocusTo) return;
                e.preventDefault();
                returnFocusTo.focus();
              }}
            >
              <motion.div
                className="love-parchment fixed inset-0 z-50 m-auto flex h-fit max-h-[85svh] w-[calc(100%-2rem)] max-w-xl flex-col rounded-lg shadow-lg"
                style={{ transformPerspective: 900 }}
                initial={
                  from ?? {
                    opacity: 0,
                    scale: fadeOnly ? 1 : 0.94,
                    y: fadeOnly ? 0 : 12,
                  }
                }
                animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: fadeOnly ? 1 : 0.97 }}
                transition={
                  from
                    ? { duration: 0.75, ease: [0.2, 0.7, 0.3, 1] }
                    : transition
                }
              >
                <ParchmentFrame />
                <div
                  ref={body}
                  data-lenis-prevent
                  className="relative min-h-0 overflow-y-auto overscroll-contain px-8 py-12 text-left md:px-12"
                >
                  {note.label && <p className={labelText}>{note.label}</p>}
                  <DialogPrimitive.Title
                    data-ink
                    className="font-display text-h3 mt-1 font-semibold break-words"
                  >
                    {note.title}
                  </DialogPrimitive.Title>
                  {note.photo && (
                    <LovePhoto
                      photo={note.photo}
                      sizes="(min-width: 768px) 36rem, 100vw"
                      className="mt-4 max-h-[40svh] w-full rounded-md object-cover"
                    />
                  )}
                  <div className="text-body mt-4 space-y-4 text-pretty">
                    {note.paragraphs.map((p, i) => (
                      <p key={i} data-ink>
                        {p}
                      </p>
                    ))}
                  </div>
                  <div className="mt-8">
                    <HeartDivider />
                  </div>
                </div>
                <DialogPrimitive.Close
                  className={cn(
                    'hover:bg-gold/20 absolute top-3 right-3 grid size-11 place-items-center rounded-md transition',
                    focusRing,
                  )}
                >
                  <XIcon className="text-secondary size-4" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
