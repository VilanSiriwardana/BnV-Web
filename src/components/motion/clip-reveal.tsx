'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { duration, ease } from '@/config/motion';

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

// Unmasks content from a soft inset as it enters the viewport; opacity only under reduced motion.
export function ClipReveal({ children, delay = 0, className }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        reduce
          ? { opacity: 0 }
          : { clipPath: 'inset(4% 3% 4% 3% round 16px)', opacity: 0 }
      }
      whileInView={
        reduce
          ? { opacity: 1 }
          : { clipPath: 'inset(0% 0% 0% 0% round 16px)', opacity: 1 }
      }
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: duration.slow, ease: ease.standard, delay }}
    >
      {children}
    </motion.div>
  );
}
