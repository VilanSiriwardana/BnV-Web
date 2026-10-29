import { z } from 'zod';

import {
  consentSchema,
  emailSchema,
  nameSchema,
  optional,
  requiredText,
  sriLankaPhoneSchema,
  text,
} from '@/lib/forms/fields';
import type { FormState } from '@/lib/forms/types';

export const contactFields = z.object({
  name: nameSchema,
  email: optional(emailSchema),
  phone: optional(sriLankaPhoneSchema),
  subject: optional(text(150, 'Subject')),
  message: requiredText(
    10,
    2000,
    'Please write a short message (at least 10 characters).',
  ),
  consent: consentSchema,
});

export const contactSchema = contactFields.refine((v) => v.email || v.phone, {
  message: 'Please share an email or a mobile number so we can reply.',
  path: ['email'],
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type ContactState = FormState<ContactField>;
