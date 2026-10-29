'use server';

import { z } from 'zod';

import { prisma } from '@/lib/prisma';

import { newsletterSchema, type NewsletterState } from './schema';

export async function subscribeToNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get('email'),
    consent: formData.get('consent'),
  });

  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      status: 'error',
      email: String(formData.get('email') ?? ''),
      fieldErrors: {
        email: fieldErrors.email?.[0],
        consent: fieldErrors.consent?.[0],
      },
    };
  }

  const { email } = parsed.data;

  try {
    // Same response for new, existing and returning subscribers, so emails cannot be enumerated.
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, source: 'homepage', status: 'active' },
      update: { status: 'active', unsubscribedAt: null },
    });
  } catch {
    return {
      status: 'error',
      email,
      message: 'Something went wrong on our side. Please try again shortly.',
    };
  }

  return {
    status: 'success',
    message:
      'Thank you for joining us. New drops and quiet little surprises will find their way to your inbox.',
  };
}
