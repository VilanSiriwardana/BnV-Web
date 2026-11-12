import { Button } from '@/components/ui/button';

import { LoveSection } from './love-section';

export function Gate({ name }: { name: string }) {
  return (
    <LoveSection id="gate" dawn={0} className="flex min-h-svh items-center">
      <div
        aria-hidden
        className="size-24 rounded-full bg-[radial-gradient(circle,var(--primary)_0%,color-mix(in_oklab,var(--primary)_35%,transparent)_40%,transparent_70%)]"
      />
      <h2 id="gate-title" className="sr-only">
        Welcome
      </h2>
      <p className="text-body-lg mt-10 max-w-[60ch] text-balance break-words italic">
        A little something for you, {name}.
      </p>
      <Button size="lg" className="mt-10" aria-disabled>
        Tap to begin
      </Button>
    </LoveSection>
  );
}
