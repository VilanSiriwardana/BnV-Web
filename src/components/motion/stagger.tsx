'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

import { duration, ease, revealOffset } from '@/config/motion';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function Stagger({ children, className }: Props) {
  return (
    <motion.ul
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
    >
      {children}
    </motion.ul>
  );
}

export function StaggerItem({ children, className }: Props) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : revealOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.slow, ease: ease.standard },
    },
  };

  return (
    <motion.li className={className} variants={variants}>
      {children}
    </motion.li>
  );
}
