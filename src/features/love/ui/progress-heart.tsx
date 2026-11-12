import { Heart } from 'lucide-react';

// Decorative scroll progress. `--progress` (0–1) is written on the love root by one ScrollTrigger in story.ts.
export function ProgressHeart() {
  return (
    <div aria-hidden className="pointer-events-none">
      <div className="bg-border/60 fixed inset-y-8 right-3 z-20 hidden w-0.5 rounded-full md:block">
        <div className="bg-primary h-full origin-top scale-y-(--progress) rounded-full" />
        <Heart
          className="text-primary fill-primary absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2"
          style={{ top: 'calc(var(--progress, 0) * 100%)' }}
        />
      </div>
      <div className="bg-border/60 fixed inset-x-0 top-0 z-20 h-0.5 md:hidden">
        <div className="bg-primary h-full origin-left scale-x-(--progress)" />
      </div>
    </div>
  );
}
