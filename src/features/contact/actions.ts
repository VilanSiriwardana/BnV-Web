'use server';

import { prisma } from '@/lib/prisma';
import { isSpam } from '@/lib/forms/fields';
import { parseForm, SERVER_ERROR } from '@/lib/forms/parse';

import { contactSchema, type ContactState } from './schema';

const SUCCESS: ContactState = {
  status: 'success',
  message:
    'Thank you for writing to us. We usually reply within one to two days.',
};

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  if (isSpam(formData)) return SUCCESS;

  const parsed = parseForm(contactSchema, formData);
  if (!parsed.success) return parsed.state;

  const { name, email, phone, subject, message } = parsed.data;
  try {
    await prisma.contactMessage.create({
      data: { name, email, phone, subject, message, source: 'contact_page' },
    });
  } catch (error) {
    console.error('[sendContactMessage]', error);
    return SERVER_ERROR;
  }

  return SUCCESS;
}
