'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { routes } from '@/config/routes';

import { subscribeToNewsletter } from './actions';
import type { NewsletterState } from './schema';

const initialState: NewsletterState = { status: 'idle' };

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(
    subscribeToNewsletter,
    initialState,
  );

  if (state.status === 'success') {
    return (
      <p
        role="status"
        className="font-display text-h4 mx-auto max-w-xl text-center"
      >
        {state.message}
      </p>
    );
  }

  const emailError = state.fieldErrors?.email;
  const consentError = state.fieldErrors?.consent;

  return (
    <form action={formAction} noValidate className="mx-auto max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Your email address"
            defaultValue={state.email}
            required
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? 'newsletter-email-error' : undefined}
          />
          {emailError && (
            <p
              id="newsletter-email-error"
              className="text-small text-destructive mt-1 text-left"
            >
              {emailError}
            </p>
          )}
        </div>
        <Button type="submit" size="lg" className="h-11" disabled={pending}>
          {pending ? 'Joining…' : 'Join the list'}
        </Button>
      </div>
      <div className="mt-4 flex items-start gap-2 text-left">
        <input
          id="newsletter-consent"
          name="consent"
          type="checkbox"
          required
          className="accent-primary mt-1 size-4 shrink-0"
          aria-invalid={consentError ? true : undefined}
          aria-describedby={
            consentError ? 'newsletter-consent-error' : undefined
          }
        />
        <label
          htmlFor="newsletter-consent"
          className="text-small text-muted-foreground"
        >
          Send me new drops and offers. I have read the{' '}
          <Link
            href={routes.policy('privacy')}
            className="text-primary-text underline underline-offset-4"
          >
            privacy policy
          </Link>
          . You can unsubscribe at any time.
        </label>
      </div>
      {consentError && (
        <p
          id="newsletter-consent-error"
          className="text-small text-destructive mt-1 text-left"
        >
          {consentError}
        </p>
      )}
      {state.status === 'error' && state.message && (
        <p role="alert" className="text-small text-destructive mt-3">
          {state.message}
        </p>
      )}
    </form>
  );
}
