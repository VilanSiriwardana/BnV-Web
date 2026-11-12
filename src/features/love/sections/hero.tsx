import { LoveSection, proseColumn } from './love-section';

export function Hero({ name, sub }: { name: string; sub: string }) {
  return (
    <LoveSection
      id="hero"
      dawn={0}
      stage="200vh"
      className="flex min-h-svh items-center"
    >
      <h1 id="hero-title" className="text-display text-balance break-words">
        Happy Birthday, <span className="text-gold-text">{name}</span>
      </h1>
      <p className={`${proseColumn} text-muted-foreground mt-6`}>{sub}</p>
    </LoveSection>
  );
}
