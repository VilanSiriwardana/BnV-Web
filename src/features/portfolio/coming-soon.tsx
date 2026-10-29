import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';

const ctas = [
  { label: 'Book a collaboration', type: 'collaboration' },
  { label: 'Request a consultation', type: 'consultation' },
  { label: 'Invite us to an event', type: 'event_invitation' },
] as const;

export function CollaborateCtas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex flex-wrap justify-center gap-3">
        {ctas.map((c) => (
          <Button key={c.type} asChild variant="outline">
            <Link href={`${routes.collaborate}?type=${c.type}`}>{c.label}</Link>
          </Button>
        ))}
        <Button asChild>
          <Link href={routes.collaborate}>Work With Us</Link>
        </Button>
      </div>
    </div>
  );
}

export function PortfolioComingSoon() {
  return (
    <section
      aria-labelledby="coming-soon-title"
      className="bg-muted rounded-lg px-6 py-12 text-center md:py-16"
    >
      <h2 id="coming-soon-title" className="font-display text-h3">
        Our first shoots are coming soon
      </h2>
      <p className="text-muted-foreground mx-auto mt-3 max-w-xl">
        Fashion, jewelry and romantic visual stories with Buwi and Vila are on
        their way. Brands, restaurants and event organisers can already work
        with us.
      </p>
      <CollaborateCtas className="mt-8" />
    </section>
  );
}
