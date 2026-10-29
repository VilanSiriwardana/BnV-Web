'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import type { StatusState } from '@/components/admin/status-form';
import { routes } from '@/config/routes';
import { orderStatusSchema } from '@/constants/statuses';
import { ForbiddenError, requirePermission } from '@/lib/auth/guards';
import { SERVER_ERROR } from '@/lib/forms/parse';
import { prisma } from '@/lib/prisma';

import { applyOrderStatus, OrderTransitionError } from './stock';

export async function changeOrderStatus(
  orderId: string,
  _prev: StatusState,
  formData: FormData,
): Promise<StatusState> {
  try {
    await requirePermission('orders.manage');
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return { status: 'error', message: error.message };
    }
    throw error;
  }

  const to = orderStatusSchema.safeParse(formData.get('status'));
  if (!to.success || !z.uuid().safeParse(orderId).success) {
    return { status: 'error', message: 'Please choose a valid status.' };
  }

  let effect;
  try {
    effect = await prisma.$transaction((tx) =>
      applyOrderStatus(tx, orderId, to.data),
    );
  } catch (error) {
    if (error instanceof OrderTransitionError) {
      return { status: 'error', message: error.message };
    }
    console.error('[changeOrderStatus]', error);
    return SERVER_ERROR;
  }

  revalidatePath(routes.admin.orders, 'layout');
  if (effect !== 'none') revalidatePath('/', 'layout');
  return {
    status: 'success',
    message:
      effect === 'decrement'
        ? 'Order dispatched and stock updated.'
        : effect === 'restock'
          ? 'Order cancelled and stock returned.'
          : 'Status updated.',
  };
}
