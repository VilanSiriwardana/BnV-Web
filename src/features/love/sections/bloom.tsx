import { LoveSection, proseColumn } from './love-section';

export function Bloom({ line }: { line: string }) {
  return (
    <LoveSection id="bloom" dawn={0} stage="150vh">
      <h2 id="bloom-title" className="sr-only">
        Bloom
      </h2>
      <p className={`${proseColumn} text-body-lg italic`}>{line}</p>
    </LoveSection>
  );
}
