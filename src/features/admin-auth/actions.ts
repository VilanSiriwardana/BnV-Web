'use server';

import { AuthError } from 'next-auth';
import { headers } from 'next/headers';

import { signIn, signOut } from '@/auth';
import { routes } from '@/config/routes';
import { rateLimit, resetRateLimit } from '@/lib/auth/rate-limit';
import { parseForm, SERVER_ERROR } from '@/lib/forms/parse';

import { loginSchema, type LoginState } from './schema';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_TRIES = 5;

// One message for every failure so the form never reveals which emails exist (ADR-0019).
const INVALID: LoginState = {
  status: 'error',
  message: 'That email and password do not match an admin account.',
};

export async function loginAdmin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = parseForm(loginSchema, formData);
  if (!parsed.success) {
    return { ...parsed.state, values: { email: parsed.state.values?.email } };
  }
  const { email, password } = parsed.data;

  const ip =
    (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  const limits = [
    rateLimit(`login:ip:${ip}`, MAX_TRIES * 4, WINDOW_MS),
    rateLimit(`login:email:${email}`, MAX_TRIES, WINDOW_MS),
  ];
  if (limits.some((l) => !l.ok)) {
    return {
      status: 'error',
      message:
        'Too many sign-in attempts. Please wait 15 minutes and try again.',
      values: { email },
    };
  }

  try {
    await signIn('credentials', { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) return { ...INVALID, values: { email } };
    console.error('[loginAdmin]', error);
    return SERVER_ERROR;
  }

  resetRateLimit(`login:email:${email}`);
  return { status: 'success' };
}

export async function logoutAdmin() {
  await signOut({ redirectTo: routes.admin.login });
}
