import { z } from 'zod';

import type { FormState } from '@/lib/forms/types';

// Shared by the client (useInput) and the Server Action (authoritative).
export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Please enter your email address.')
    .max(254, 'That email address is too long.')
    .pipe(z.email('Please enter a valid email address.')),
  consent: z.literal('on', {
    error: 'Please agree to receive emails from us.',
  }),
});

export type NewsletterState = FormState<'email' | 'consent'>;
