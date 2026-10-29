'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { duration, ease, revealOffset } from '@/config/motion';

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

// Fades and slides content in once when it enters the viewport; opacity only under reduced motion.
export function Reveal({ children, delay = 0, className }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : revealOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: duration.slow, ease: ease.standard, delay }}
    >
      {children}
    </motion.div>
  );
}
