'use server';

import { isOwnUploadUrl, uploadFolders } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { isSpam } from '@/lib/forms/fields';
import { parseForm, SERVER_ERROR, withoutConsent } from '@/lib/forms/parse';

import { customRequestSchema, type CustomRequestState } from './schema';

const SUCCESS: CustomRequestState = {
  status: 'success',
  message:
    'Thank you. We will review your idea and reply with a quote, usually within one to two days.',
};

export async function submitCustomRequest(
  _prev: CustomRequestState,
  formData: FormData,
): Promise<CustomRequestState> {
  if (isSpam(formData)) return SUCCESS;

  const parsed = parseForm(customRequestSchema, formData);
  if (!parsed.success) return parsed.state;

  const { name, phone, email, requiredDate, referenceImages, ...rest } =
    withoutConsent(parsed.data);
  if (
    !referenceImages.every((url) =>
      isOwnUploadUrl(url, uploadFolders.customRequests),
    )
  ) {
    return {
      status: 'error',
      message: 'Please add images with the upload button.',
      fieldErrors: {
        referenceImages: 'Please add images with the upload button.',
      },
    };
  }
  try {
    await prisma.customRequest.create({
      data: {
        ...rest,
        referenceImageUrls: referenceImages,
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        requiredDate: requiredDate ? new Date(requiredDate) : undefined,
      },
    });
  } catch (error) {
    console.error('[submitCustomRequest]', error);
    return SERVER_ERROR;
  }

  return SUCCESS;
}
