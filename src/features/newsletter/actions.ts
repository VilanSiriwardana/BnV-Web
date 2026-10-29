'use server';

import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

import { newsletterSchema, type NewsletterState } from './schema';

const ALREADY_SUBSCRIBED: NewsletterState = {
  status: 'info',
  message: "You're already on our list. Nothing more to do.",
};

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
      values: { email: String(formData.get('email') ?? '') },
      fieldErrors: {
        email: fieldErrors.email?.[0],
        consent: fieldErrors.consent?.[0],
      },
    };
  }

  const { email } = parsed.data;

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
      select: { status: true },
    });

    if (existing?.status === 'active') return ALREADY_SUBSCRIBED;

    if (existing) {
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { status: 'active', unsubscribedAt: null },
      });
      return {
        status: 'success',
        message: "Welcome back. You're subscribed again.",
      };
    }

    await prisma.newsletterSubscriber.create({
      data: { email, source: 'homepage', status: 'active' },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return ALREADY_SUBSCRIBED;
    }
    return {
      status: 'error',
      values: { email },
      message: 'Something went wrong on our side. Please try again shortly.',
    };
  }

  return {
    status: 'success',
    message:
      'Thank you for joining us. New drops and quiet little surprises will find their way to your inbox.',
  };
}
