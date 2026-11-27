'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { focusRing } from '@/components/ui/styles';
import { duration, ease } from '@/config/motion';
import { cn } from '@/lib/utils/cn';

import { HIDDEN_HEART_IDS } from '../engine/hidden-hearts';
import { useMotionPrefs } from '../engine/motion-prefs';
import { useLoveScroll } from '../engine/scroll-engine';
import { HeartDivider, ParchmentFrame } from '../sections/letter-ornaments';
import { labelText } from '../sections/love-section';
import { HIDDEN_HEART_CLUES } from './hidden-heart-clues';

type Props = { open: boolean; onClose: () => void };

// Blueprint 085: after the hero intro, a parchment note tells her about the five hidden hearts.
// Mirrors NoteDialog (Radix + Motion, Lenis stopped while open).
export function HuntIntroDialog({ open, onClose }: Props) {
  const { calm } = useMotionPrefs();
  const fadeOnly = useReducedMotion() || calm;
  const { stop, start } = useLoveScroll();

  useEffect(() => {
    if (!open) return;
    stop();
    return () => start();
  }, [open, stop, start]);

  const transition = { duration: duration.slow, ease: ease.standard };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && (
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
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className="love-parchment fixed inset-0 z-50 m-auto flex h-fit max-h-[85svh] w-[calc(100%-2rem)] max-w-md flex-col rounded-lg shadow-lg"
                initial={{
                  opacity: 0,
                  scale: fadeOnly ? 1 : 0.94,
                  y: fadeOnly ? 0 : 16,
                }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: fadeOnly ? 1 : 0.97 }}
                transition={transition}
              >
                <ParchmentFrame />
                <div
                  data-lenis-prevent
                  className="relative min-h-0 overflow-y-auto overscroll-contain px-8 py-10 text-left md:px-10"
                >
                  <p className={labelText}>A little game</p>
                  <DialogPrimitive.Title className="font-display text-h3 mt-1 font-semibold">
                    Five hidden hearts
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="text-body mt-3 text-pretty">
                    Tiny gold hearts are tucked around our story. Find all five
                    to open the secret room at the end.
                  </DialogPrimitive.Description>
                  <ul className="mt-6 space-y-3">
                    {HIDDEN_HEART_IDS.map((id) => {
                      const { icon: Icon, text } = HIDDEN_HEART_CLUES[id];
                      return (
                        <li
                          key={id}
                          className="flex items-center gap-3 font-serif text-lg tracking-wide"
                        >
                          <span
                            aria-hidden
                            className="border-gold/50 bg-gold/10 text-gold grid size-9 shrink-0 place-items-center rounded-full border"
                          >
                            <Icon className="size-4" strokeWidth={1.5} />
                          </span>
                          {text}
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-8">
                    <HeartDivider />
                  </div>
                  <div className="mt-6 flex justify-center">
                    <DialogPrimitive.Close asChild>
                      <Button variant="love-primary">Let’s look</Button>
                    </DialogPrimitive.Close>
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
