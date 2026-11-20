import { splitBloomLines } from '../engine/bloom-lines';
import { QuietHeart } from '../ui/static-heart';
import { TinyHeart } from './letter-ornaments';
import { LoveSection } from './love-section';

type Props = {
  line: string;
  lines?: [string, string, string];
  emphasis?: string;
};

const serifLine =
  'font-serif italic text-[clamp(1.6rem,3.2vw,3rem)] leading-tight text-foreground/90';
const gradientWord =
  'bg-[linear-gradient(100deg,var(--gold),var(--primary))] bg-clip-text text-transparent';

// Words are pre-split into inline spans (one sentence for screen readers); buildBloom animates them.
function Words({ text, className }: { text: string; className?: string }) {
  return text.split(' ').map((w, i) => (
    <span key={i}>
      {i > 0 && ' '}
      <span data-bloom-word className={`inline-block ${className ?? ''}`}>
        {w}
      </span>
    </span>
  ));
}

// Romance Additions §9.2: a left-third statement (lower third on phones) that emerges from the burst.
export function Bloom({ line, lines, emphasis = 'opens' }: Props) {
  const [l1, l2, l3] = lines ?? splitBloomLines(line, emphasis);
  const [first, ...rest] = l3.split(' ');
  const opens = first?.toLowerCase().startsWith(emphasis.toLowerCase());
  return (
    <LoveSection id="bloom" stage="150vh" className="relative">
      <QuietHeart className="mb-6 size-16" />
      <h2 id="bloom-title" className="sr-only">
        Bloom
      </h2>
      <div
        data-bloom-line
        className="relative w-full max-w-md text-left [[data-love-motion]_&]:absolute [[data-love-motion]_&]:max-md:inset-x-[7.5%] [[data-love-motion]_&]:max-md:bottom-[12svh] [[data-love-motion]_&]:max-md:w-auto [[data-love-motion]_&]:md:top-[45%] [[data-love-motion]_&]:md:left-[6vw] [[data-love-motion]_&]:md:w-[clamp(18rem,33vw,30rem)] [[data-love-motion]_&]:md:-translate-y-1/2"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-[20vw] -inset-y-16 -z-10 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--background)_70%,transparent)_0%,color-mix(in_oklab,var(--background)_45%,transparent)_45%,transparent_80%)]"
        />
        <div
          data-bloom-rule
          aria-hidden
          className="text-gold-text mb-6 flex items-center gap-2"
        >
          <span className="bg-gold/70 h-px w-12" />
          <TinyHeart className="size-2.5" />
        </div>
        <p>
          <span className={`block ${serifLine}`}>
            <Words text={l1} />
          </span>
          <span className={`block ${serifLine}`}>
            <Words text={l2} />
          </span>
          <span className="font-display mt-2 block text-[clamp(2rem,4vw,3.8rem)] leading-tight tracking-[0.02em]">
            {opens ? (
              <>
                <span
                  data-bloom-word
                  data-bloom-emphasis
                  className={`inline-block ${gradientWord}`}
                >
                  {first}
                </span>
                {rest.length > 0 && (
                  <>
                    {' '}
                    <Words text={rest.join(' ')} className={gradientWord} />
                  </>
                )}
              </>
            ) : (
              <Words text={l3} className={gradientWord} />
            )}
          </span>
        </p>
        <svg
          aria-hidden
          viewBox="0 0 220 12"
          className="text-gold-text mt-3 h-3 w-[min(100%,14rem)] overflow-visible"
        >
          <path
            data-bloom-underline
            d="M0 6 H204"
            pathLength={1}
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M212 3.2a2 2 0 0 0-3.4 0 2 2 0 0 0-3.4 0c0 2.3 3.4 4.6 3.4 4.6s3.4-2.3 3.4-4.6z"
            fill="currentColor"
          />
        </svg>
      </div>
    </LoveSection>
  );
}
