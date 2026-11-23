'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { useEffect } from 'react';

import { focusRing } from '@/components/ui/styles';
import { duration, ease } from '@/config/motion';
import { cn } from '@/lib/utils/cn';

import type { LoveSiteConfig } from '../config';
import { useMotionPrefs } from '../engine/motion-prefs';
import { useLoveScroll } from '../engine/scroll-engine';
import { LovePhoto } from '../sections/love-photo';
import { labelText } from '../sections/love-section';

type Memory = LoveSiteConfig['memories'][number];
type Props = {
  memory: Memory | null;
  originRect: { x: number; y: number } | null;
  onClose: () => void;
  returnFocusTo?: HTMLElement | null;
};

// Tech Stack §5.10: Radix for focus trap / Esc / ARIA, framer-motion for the scale-from-orb,
// Lenis stopped while open. The shared DialogContent is not used: its CSS zoom would fight Motion.
export function MemoryDialog({
  memory,
  originRect,
  onClose,
  returnFocusTo,
}: Props) {
  const { calm } = useMotionPrefs();
  const fadeOnly = useReducedMotion() || calm;
  const { stop, start } = useLoveScroll();
  const open = memory !== null;

  useEffect(() => {
    if (!open) return;
    stop();
    return () => start();
  }, [open, stop, start]);

  const origin = originRect
    ? `calc(50% + ${originRect.x - window.innerWidth / 2}px) calc(50% + ${originRect.y - window.innerHeight / 2}px)`
    : '50% 50%';
  const transition = { duration: duration.base, ease: ease.standard };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {memory && (
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
                data-lenis-prevent
                className="glass fixed inset-0 z-50 m-auto grid h-fit max-h-[85svh] w-[calc(100%-2rem)] max-w-2xl gap-4 overflow-y-auto overscroll-contain rounded-lg border p-4 shadow-lg md:p-6"
                style={{ transformOrigin: origin }}
                initial={{ opacity: 0, scale: fadeOnly ? 1 : 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: fadeOnly ? 1 : 0.96 }}
                transition={transition}
              >
                <LovePhoto
                  photo={memory.photo}
                  sizes="(min-width: 768px) 42rem, 100vw"
                  className="max-h-[55svh] w-full rounded-md object-cover"
                />
                <div>
                  <p className={labelText}>{memory.date}</p>
                  <DialogPrimitive.Title className="font-display text-h3 mt-1 font-semibold break-words">
                    {memory.title}
                  </DialogPrimitive.Title>
                  <p className="text-body mt-2 text-pretty">{memory.caption}</p>
                </div>
                <DialogPrimitive.Close
                  className={cn(
                    'bg-background/70 hover:bg-accent absolute top-3 right-3 grid size-11 place-items-center rounded-md transition',
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
