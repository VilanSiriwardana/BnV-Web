import { LoveSection, proseColumn } from './love-section';

export function Dawn({ quote }: { quote: string }) {
  return (
    <LoveSection id="dawn" dawn={0} className="flex min-h-[60svh] items-end">
      <h2 id="dawn-title" className="sr-only">
        Dawn
      </h2>
      <p className={`${proseColumn} text-body-lg italic`}>{quote}</p>
    </LoveSection>
  );
}
