import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, 'That email address is too long.')
    .pipe(z.email('Please enter a valid email address.')),
  consent: z.literal('on', {
    error: 'Please agree to receive emails from us.',
  }),
});

export type NewsletterState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  email?: string;
  fieldErrors?: Partial<Record<'email' | 'consent', string>>;
};
