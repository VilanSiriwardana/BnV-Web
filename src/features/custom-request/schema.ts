import { z } from 'zod';

import { customRequestTypes } from '@/constants/statuses';
import {
  consentSchema,
  emailSchema,
  futureDateSchema,
  nameSchema,
  optional,
  requiredChoice,
  requiredText,
  sriLankaPhoneSchema,
  text,
} from '@/lib/forms/fields';
import type { FormState } from '@/lib/forms/types';

import { occasions } from './options';

const budget = optional(
  z.coerce
    .number({ error: 'Please enter an amount in LKR.' })
    .int('Please enter a whole amount in LKR.')
    .nonnegative('Please enter a positive amount.')
    .max(10_000_000, 'Please enter a smaller amount.'),
);

// Uploader URLs, one per line; the action checks they come from our Cloudinary folder.
const referenceImagesSchema = z
  .string()
  .default('')
  .transform((v) =>
    v
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.string().max(500)).max(3, 'Please share up to 3 images.'));

export const customRequestFields = z.object({
  requestType: requiredChoice(
    customRequestTypes,
    'Please choose what you would like made.',
  ),
  occasion: optional(requiredChoice(occasions, 'Please choose an occasion.')),
  personalizationText: optional(text(500, 'Personalisation')),
  preferredColor: optional(text(100, 'Colour')),
  preferredMaterial: optional(text(100, 'Material')),
  budgetMin: budget,
  budgetMax: budget,
  requiredDate: optional(futureDateSchema),
  name: nameSchema,
  phone: sriLankaPhoneSchema,
  email: optional(emailSchema),
  message: requiredText(
    10,
    2000,
    'Please describe your idea (at least 10 characters).',
  ),
  referenceImages: referenceImagesSchema,
  consent: consentSchema,
});

export const customRequestSchema = customRequestFields.refine(
  (v) =>
    v.budgetMin == null || v.budgetMax == null || v.budgetMax >= v.budgetMin,
  {
    message: 'The maximum should be at least the minimum.',
    path: ['budgetMax'],
  },
);

export type CustomRequestInput = z.infer<typeof customRequestSchema>;
export type CustomRequestField = keyof CustomRequestInput;
export type CustomRequestState = FormState<CustomRequestField>;
