import { z } from 'zod';

// Shared Zod field schemas for public forms (UX-Spec §1, §8).

// Accepts 07X XXX XXXX, 7XXXXXXXX, 947XXXXXXXX or +947XXXXXXXX; stores +947XXXXXXXX (UX-Spec §1.1).
export const sriLankaPhoneSchema = z
  .string()
  .trim()
  .min(1, 'Please enter your mobile number.')
  .transform((v) => v.replace(/[\s()-]/g, '').replace(/^(\+?94|0)/, ''))
  .pipe(
    z
      .string()
      .regex(
        /^7\d{8}$/,
        'Please enter a Sri Lankan mobile, e.g. 077 123 4567.',
      ),
  )
  .transform((v) => `+94${v}`);

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Please enter your email address.')
  .max(254, 'That email address is too long.')
  .pipe(z.email('Please enter a valid email address.'));

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Please enter your full name.')
  .max(150, 'That name is too long.');

export const consentSchema = z.literal('on', {
  error: 'Please agree to the privacy policy.',
});

export const text = (max: number, label = 'This') =>
  z.string().trim().max(max, `${label} must be under ${max} characters.`);

export const requiredText = (min: number, max: number, message: string) =>
  z
    .string()
    .trim()
    .min(min, message)
    .max(max, `Please keep this under ${max} characters.`);

export const requiredChoice = <T extends readonly [string, ...string[]]>(
  values: T,
  message: string,
) => z.enum(values, { error: message });

// Empty strings and missing keys become undefined, so optional fields store NULL.
export const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(
    (v) =>
      v == null || (typeof v === 'string' && v.trim() === '') ? undefined : v,
    schema.optional(),
  );

const todayIso = () => new Date().toISOString().slice(0, 10);

export const futureDateSchema = z
  .string()
  .trim()
  .min(1, 'Please choose a date.')
  .pipe(z.iso.date('Please choose a valid date.'))
  .refine((v) => v >= todayIso(), 'Please choose a date from today onwards.');

// One URL per line, up to 5.
export const referenceLinksSchema = z
  .string()
  .transform((v) =>
    v
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean),
  )
  .pipe(
    z
      .array(z.url({ error: 'Each line must be a full link (https://…).' }))
      .max(5, 'Please share up to 5 links.'),
  );

export const HONEYPOT_FIELD = 'company_website';

export function isSpam(formData: FormData) {
  return Boolean(formData.get(HONEYPOT_FIELD));
}
