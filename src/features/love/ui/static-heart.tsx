'use client';

import { heartPoint } from '../canvas/heart-geometry';
import { cn } from '@/lib/utils/cn';
import { useQuiet } from '../engine/use-quiet';

const HEART_PATH = (() => {
  const steps = 64;
  const pts = Array.from({ length: steps }, (_, i) => {
    const [x, y] = heartPoint((i / steps) * Math.PI * 2);
    return `${x.toFixed(3)} ${(-y).toFixed(3)}`;
  });
  return `M ${pts.join(' L ')} Z`;
})();

// Static-path heart (no WebGL / Calm): SVG from the same parametric curve as the 3D heart.
export function StaticHeart({
  className,
  glow = false,
}: {
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg
      aria-hidden
      viewBox="-1.1 -1.1 2.2 2.2"
      className={cn('text-primary overflow-visible', className)}
    >
      <path
        d={HEART_PATH}
        className={cn(
          'fill-gold/40 transition-opacity duration-300',
          glow ? 'opacity-100' : 'opacity-0',
        )}
        transform="scale(1.12)"
      />
      <path
        d={HEART_PATH}
        className="stroke-gold fill-current"
        strokeWidth={0.04}
      />
    </svg>
  );
}

export function QuietHeart(props: { className?: string; glow?: boolean }) {
  return useQuiet() ? <StaticHeart {...props} /> : null;
}
