import { QuietHeart } from '../ui/static-heart';
import { LoveSection, proseColumn } from './love-section';

export function Bloom({ line }: { line: string }) {
  return (
    <LoveSection id="bloom" stage="150vh">
      <QuietHeart className="mb-6 size-16" />
      <h2 id="bloom-title" className="sr-only">
        Bloom
      </h2>
      <p data-bloom-line className={`${proseColumn} text-body-lg italic`}>
        {line}
      </p>
    </LoveSection>
  );
}
