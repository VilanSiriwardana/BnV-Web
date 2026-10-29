'use server';

import { prisma } from '@/lib/prisma';
import { isSpam } from '@/lib/forms/fields';
import { parseForm, SERVER_ERROR, withoutConsent } from '@/lib/forms/parse';

import { collaborationSchema, type CollaborationState } from './schema';

const SUCCESS: CollaborationState = {
  status: 'success',
  message:
    'Thank you for thinking of us. We will reply within two to three days.',
};

export async function submitCollaborationInquiry(
  _prev: CollaborationState,
  formData: FormData,
): Promise<CollaborationState> {
  if (isSpam(formData)) return SUCCESS;

  const parsed = parseForm(collaborationSchema, formData);
  if (!parsed.success) return parsed.state;

  const { preferredDate, referenceLinks, ...rest } = withoutConsent(
    parsed.data,
  );
  try {
    await prisma.collaborationInquiry.create({
      data: {
        ...rest,
        preferredDate: preferredDate ? new Date(preferredDate) : undefined,
        referenceLinks: referenceLinks?.length ? referenceLinks : undefined,
      },
    });
  } catch (error) {
    console.error('[submitCollaborationInquiry]', error);
    return SERVER_ERROR;
  }

  return SUCCESS;
}
