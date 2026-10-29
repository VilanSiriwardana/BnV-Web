import { cookies } from 'next/headers';

const CART_COOKIE = 'bnv_cart';
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function getCartToken() {
  return (await cookies()).get(CART_COOKIE)?.value ?? null;
}

// Server Actions only: Next.js cannot set cookies while rendering.
export async function ensureCartToken() {
  const existing = await getCartToken();
  if (existing) return existing;
  const token = crypto.randomUUID();
  (await cookies()).set(CART_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: THIRTY_DAYS,
  });
  return token;
}

export async function clearCartToken() {
  (await cookies()).delete(CART_COOKIE);
}
