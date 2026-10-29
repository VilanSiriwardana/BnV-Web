'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import type { StatusState } from '@/components/admin/status-form';
import { ForbiddenError, requirePermission } from '@/lib/auth/guards';
import { SERVER_ERROR } from '@/lib/forms/parse';
import { prisma } from '@/lib/prisma';

import { inquiryConfig, inquiryKinds, type InquiryKind } from './config';

const idSchema = z.uuid();

export async function updateInquiryStatus(
  kind: InquiryKind,
  id: string,
  _prev: StatusState,
  formData: FormData,
): Promise<StatusState> {
  try {
    await requirePermission('inquiries.manage');
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return { status: 'error', message: error.message };
    }
    throw error;
  }

  const config = inquiryKinds.includes(kind) ? inquiryConfig[kind] : null;
  const status = z
    .enum(config?.statuses ?? ['new'])
    .safeParse(formData.get('status'));
  if (!config || !idSchema.safeParse(id).success || !status.success) {
    return { status: 'error', message: 'Please choose a valid status.' };
  }

  try {
    const data = { status: status.data };
    if (kind === 'custom') {
      await prisma.customRequest.update({ where: { id }, data });
    } else if (kind === 'collaboration') {
      await prisma.collaborationInquiry.update({ where: { id }, data });
    } else {
      await prisma.contactMessage.update({ where: { id }, data });
    }
  } catch (error) {
    console.error('[updateInquiryStatus]', error);
    return SERVER_ERROR;
  }

  revalidatePath(config.href, 'layout');
  return { status: 'success', message: 'Status updated.' };
}
