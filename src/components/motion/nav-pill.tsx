'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, type FocusEvent } from 'react';

import { cn } from '@/lib/utils/cn';

const spring = { type: 'spring', stiffness: 500, damping: 40 } as const;

// Shared-layout highlight that glides between nav items; jumps instantly under reduced motion.
export function NavPill({
  layoutId,
  className,
}: {
  layoutId: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      layoutId={layoutId}
      transition={reduce ? { duration: 0 } : spring}
      className={cn('pointer-events-none absolute -z-10', className)}
    />
  );
}

// Tracks the hovered or keyboard-focused item index for a NavPill.
export function useHoverIndex() {
  const [hovered, setHovered] = useState<number | null>(null);
  return {
    hovered,
    list: {
      onPointerLeave: () => setHovered(null),
      onBlur: (e: FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHovered(null);
      },
    },
    item: (i: number) => ({
      onPointerEnter: () => setHovered(i),
      onFocus: () => setHovered(i),
    }),
  };
}
