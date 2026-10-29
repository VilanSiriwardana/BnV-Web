import { z } from 'zod';

import {
  consentSchema,
  emailSchema,
  futureDateSchema,
  nameSchema,
  optional,
  referenceLinksSchema,
  requiredChoice,
  requiredText,
  sriLankaPhoneSchema,
  text,
} from '@/lib/forms/fields';
import type { FormState } from '@/lib/forms/types';

import {
  budgetRanges,
  meetingModes,
  projectTypes,
  requestedRoles,
  requiredPeople,
} from './options';

// Field matrix: UX-Spec §3.4 (reference files deferred with Cloudinary).
const base = {
  name: nameSchema,
  email: emailSchema,
  phone: sriLankaPhoneSchema,
  message: requiredText(
    10,
    2000,
    'Please tell us a little more (at least 10 characters).',
  ),
  referenceLinks: optional(referenceLinksSchema),
  consent: consentSchema,
};

const brandName = text(150, 'Brand name');
const projectType = requiredChoice(
  projectTypes,
  'Please choose a project type.',
);
const people = requiredChoice(
  requiredPeople,
  'Please choose who you would like to work with.',
);
const preferredTime = requiredText(1, 50, 'Please share a preferred time.');
const location = requiredText(2, 200, 'Please share the location.');

export const collaborationFields = z.object({
  inquiryType: z.literal('collaboration'),
  ...base,
  brandName: optional(brandName),
  projectType,
  requiredPeople: people,
  preferredDate: optional(futureDateSchema),
  location: optional(location),
  budgetRange: optional(
    requiredChoice(budgetRanges, 'Please choose a budget range.'),
  ),
});

export const consultationFields = z.object({
  inquiryType: z.literal('consultation'),
  ...base,
  brandName: optional(brandName),
  projectType: optional(projectType),
  preferredDate: futureDateSchema,
  preferredTime,
  meetingMode: requiredChoice(
    meetingModes,
    'Please choose online or in person.',
  ),
  location: optional(location),
});

export const eventInvitationFields = z.object({
  inquiryType: z.literal('event_invitation'),
  ...base,
  brandName: requiredText(2, 150, 'Please enter the organiser or brand name.'),
  requiredPeople: people,
  preferredDate: futureDateSchema,
  preferredTime: optional(preferredTime),
  location,
  expectedAudience: optional(text(150, 'Expected audience')),
  requestedRole: requiredChoice(
    requestedRoles,
    'Please choose the role you have in mind.',
  ),
});

export const collaborationSchema = z
  .discriminatedUnion('inquiryType', [
    collaborationFields,
    consultationFields,
    eventInvitationFields,
  ])
  .superRefine((v, ctx) => {
    if (
      v.inquiryType === 'consultation' &&
      v.meetingMode === 'in_person' &&
      !v.location
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['location'],
        message: 'Please share where you would like to meet.',
      });
    }
  });

export type CollaborationInput = z.infer<typeof collaborationSchema>;
export type CollaborationState = FormState<string>;
