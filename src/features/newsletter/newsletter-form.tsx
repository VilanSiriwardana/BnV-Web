'use client';

import Link from 'next/link';
import { useActionState, useEffect, useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { FieldError, FormMessage } from '@/components/ui/field-error';
import { Input } from '@/components/ui/input';
import { routes } from '@/config/routes';
import { useFormValidation, useInput } from '@/lib/forms/use-input';

import { subscribeToNewsletter } from './actions';
import { newsletterSchema, type NewsletterState } from './schema';

const initialState: NewsletterState = { status: 'idle' };

export function NewsletterForm() {
  const uid = useId();
  const emailId = `newsletter-email-${uid}`;
  const consentId = `newsletter-consent-${uid}`;
  const [state, formAction, pending] = useActionState(
    subscribeToNewsletter,
    initialState,
  );
  const [dismissed, setDismissed] = useState<NewsletterState | null>(null);

  const email = useInput({
    id: emailId,
    name: 'email',
    schema: newsletterSchema.shape.email,
  });
  const consent = useInput({
    id: consentId,
    name: 'consent',
    schema: newsletterSchema.shape.consent,
    type: 'checkbox',
  });
  const onSubmit = useFormValidation([email, consent]);

  const { setServerError: setEmailError } = email;
  const { setServerError: setConsentError } = consent;
  useEffect(() => {
    if (state.status !== 'error') return;
    setEmailError(state.fieldErrors?.email);
    setConsentError(state.fieldErrors?.consent);
  }, [state, setEmailError, setConsentError]);

  if (state.status === 'success' && dismissed !== state) {
    return (
      <div role="status" className="mx-auto max-w-xl text-center">
        <p className="font-display text-h4">{state.message}</p>
        <Button
          variant="link"
          className="mt-2"
          onClick={() => {
            email.reset();
            consent.reset();
            setDismissed(state);
          }}
        >
          Subscribe another email
        </Button>
      </div>
    );
  }

  const shown = dismissed === state ? initialState : state;

  return (
    <form
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      className="mx-auto max-w-xl"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <Input
            {...email.bind}
            type="email"
            autoComplete="email"
            placeholder="Your email address"
          />
          <FieldError id={email.errorId} message={email.error} />
        </div>
        <Button type="submit" size="lg" className="h-11" disabled={pending}>
          {pending ? 'Joining…' : 'Join the list'}
        </Button>
      </div>
      <div className="mt-2 flex items-start gap-2 text-left">
        <input {...consent.bind} className="checkbox-native mt-0.5" />
        <label htmlFor={consentId} className="text-small text-muted-foreground">
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
      <FieldError id={consent.errorId} message={consent.error} />
      <FormMessage status={shown.status} message={shown.message} />
    </form>
  );
}
