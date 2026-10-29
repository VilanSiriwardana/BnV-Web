'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { writeConsent } from '@/lib/consent';

import { useConsent } from './use-consent';

// UX-Spec §7: non-blocking, two equal-weight choices, stored for 12 months.
export function CookieConsent() {
  const consent = useConsent();
  if (consent !== null) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="border-border bg-surface fixed inset-x-0 bottom-0 z-50 border-t shadow-lg"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="text-small text-muted-foreground max-w-2xl">
          We use essential cookies to run the store. With your permission we
          also use analytics to improve it. Read our{' '}
          <Link
            href={routes.policy('privacy')}
            className="text-primary-text underline underline-offset-4"
          >
            privacy policy
          </Link>
          .
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => writeConsent('essential')}>
            Only essential
          </Button>
          <Button variant="secondary" onClick={() => writeConsent('analytics')}>
            Accept analytics
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => writeConsent(null)}
      className="hover:text-primary-text underline-offset-4 hover:underline"
    >
      Cookie settings
    </button>
  );
}
