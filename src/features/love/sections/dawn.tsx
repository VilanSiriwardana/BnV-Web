import { LoveSection, proseColumn } from './love-section';

// Experience §10: an almost empty breath. No text between 20 % and 75 % of the section; the
// single line sits at the bottom and is revealed at 75 % (story.ts buildDawn).
export function Dawn({ quote }: { quote: string }) {
  return (
    <LoveSection
      id="dawn"
      dawn={0}
      stage="100vh"
      className="flex min-h-[60svh] items-end"
    >
      <div
        aria-hidden
        className="from-gold/40 via-secondary/20 pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent"
        style={{ opacity: 'var(--dawn, 1)' }}
      />
      <h2 id="dawn-title" className="sr-only">
        Dawn
      </h2>
      <p
        data-dawn-line
        className={`${proseColumn} text-body-lg relative italic`}
      >
        {quote}
      </p>
    </LoveSection>
  );
}
