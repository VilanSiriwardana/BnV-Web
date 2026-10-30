'use client';

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Total drift in px across the element's pass through the viewport (≤ 24 per DESIGN.md). */
  distance?: number;
};

// Gentle scroll drift for feature imagery; static under reduced motion.
export function Parallax({ children, className, distance = 24 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="absolute inset-x-0 -inset-y-6"
        style={reduce ? undefined : { y }}
      >
        {children}
      </motion.div>
    </div>
  );
}
