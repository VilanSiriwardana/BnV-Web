import { mulberry32 } from '../canvas/heart-geometry';
import { QuietHeart } from '../ui/static-heart';
import { LoveSection, proseColumn } from './love-section';

// Deterministic star field (same on server and client, no hydration drift).
const STARS = (() => {
  const rand = mulberry32(11);
  return Array.from({ length: 40 }, (_, i) => ({
    left: `${(rand() * 100).toFixed(2)}%`,
    top: `${(rand() * 85).toFixed(2)}%`,
    delay: `${(rand() * 4).toFixed(2)}s`,
    gold: i % 3 === 0,
  }));
})();

// All-night theme (replaces Dawn): a breath under a lavender and gold aurora; the heart rises
// and glows (story.ts buildStarlight). The single line is revealed from 40 %.
export function Starlight({ line }: { line: string }) {
  return (
    <LoveSection
      id="starlight"
      depth={1}
      stage="100vh"
      className="flex min-h-[60svh] items-end"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          data-love-aurora
          className="absolute -inset-x-1/4 top-0 h-2/3"
          style={{
            background:
              'radial-gradient(60% 50% at 30% 40%, var(--love-aurora-lav), transparent 70%), radial-gradient(50% 45% at 72% 55%, var(--love-aurora-gold), transparent 70%)',
          }}
        />
        {STARS.map((s, i) => (
          <span
            key={i}
            data-love-star
            className={`absolute size-0.5 rounded-full ${s.gold ? 'bg-gold' : 'bg-primary'}`}
            style={{ left: s.left, top: s.top, animationDelay: s.delay }}
          />
        ))}
      </div>
      <QuietHeart glow className="relative mb-8 size-28" />
      <h2 id="starlight-title" className="sr-only">
        Starlight
      </h2>
      <p
        data-starlight-line
        className={`${proseColumn} text-body-lg text-gold-text relative italic`}
      >
        {line}
      </p>
    </LoveSection>
  );
}
