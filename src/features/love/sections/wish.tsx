import { Button } from '@/components/ui/button';

import { LoveSection, sectionTitle } from './love-section';

export function Wish({ name, prompt }: { name: string; prompt: string }) {
  return (
    <LoveSection id="wish" dawn={1} stage="200vh" className="bg-surface">
      <h2 id="wish-title" className={sectionTitle}>
        {prompt}, {name}.
      </h2>
      <Button size="lg" className="mt-10" aria-disabled>
        Make a wish
      </Button>
    </LoveSection>
  );
}
