import { z } from 'zod';

import { paymentMethods } from '@/constants/statuses';
import { districts } from '@/data/sri-lanka-districts';
import { sriLankaPhoneSchema } from '@/lib/forms/fields';
import type { FormState } from '@/lib/forms/types';
import { newsletterSchema } from '@/features/newsletter/schema';

const optional = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().default('');

const checkbox = z
  .literal('on')
  .nullish()
  .transform((v) => v === 'on');

export { sriLankaPhoneSchema };

export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(150, 'That name is too long.'),
  phone: sriLankaPhoneSchema,
  email: newsletterSchema.shape.email,
  preferredContact: z.enum(['whatsapp', 'phone']).default('whatsapp'),
  addressLine1: z
    .string()
    .trim()
    .min(3, 'Please enter your address.')
    .max(200, 'That address is too long.'),
  addressLine2: optional(200, 'That address is too long.'),
  district: z.enum(districts, { error: 'Please choose your district.' }),
  city: z
    .string()
    .trim()
    .min(2, 'Please enter your city or town.')
    .max(100, 'That city name is too long.'),
  postalCode: optional(10, 'That postal code is too long.'),
  deliveryNotes: optional(
    300,
    'Please keep delivery notes under 300 characters.',
  ),
  isGift: checkbox,
  giftWrap: checkbox,
  giftMessage: optional(
    200,
    'Please keep the gift message under 200 characters.',
  ),
  hidePrices: checkbox,
  paymentMethod: z.enum(paymentMethods, {
    error: 'Please choose a payment method.',
  }),
  consent: z.literal('on', {
    error: 'Please agree to the terms and privacy policy.',
  }),
  marketing: checkbox,
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutField = keyof CheckoutInput;
export type CheckoutState = FormState<CheckoutField>;

// Gift fields and preferred contact live in orders.notes until dedicated columns exist (UX-Spec §1.1).
export function buildOrderNotes(input: CheckoutInput) {
  const lines = [
    `Preferred contact: ${input.preferredContact === 'whatsapp' ? 'WhatsApp' : 'Phone call'}`,
  ];
  if (input.isGift) {
    lines.push(
      `Gift: yes; wrap: ${input.giftWrap ? 'yes' : 'no'}; hide prices: ${input.hidePrices ? 'yes' : 'no'}`,
    );
    if (input.giftMessage) lines.push(`Gift message: ${input.giftMessage}`);
  }
  if (input.deliveryNotes) lines.push(`Delivery notes: ${input.deliveryNotes}`);
  return lines.join('\n');
}
