import { beforeEach, describe, expect, it, vi } from 'vitest';

const session = vi.hoisted(() => ({
  current: null as { user: { id: string } } | null,
}));
const user = vi.hoisted(() => ({ current: null as unknown }));

vi.mock('@/auth', () => ({ auth: async () => session.current }));
vi.mock('@/lib/prisma', () => ({
  prisma: { user: { findUnique: async () => user.current } },
}));
vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

const { ForbiddenError, requirePermission } = await import('./guards');
const { rateLimit } = await import('./rate-limit');

const withPermissions = (status: string, names: string[]) => ({
  id: 'u1',
  name: 'Admin',
  email: 'a@example.com',
  status,
  userRoles: [
    {
      role: {
        rolePermissions: names.map((name) => ({ permission: { name } })),
      },
    },
  ],
});

describe('requirePermission', () => {
  beforeEach(() => {
    session.current = { user: { id: 'u1' } };
    user.current = null;
  });

  it('redirects to the login page without a session', async () => {
    session.current = null;
    await expect(requirePermission('orders.manage')).rejects.toThrow(
      'REDIRECT:/admin/login',
    );
  });

  it('redirects a disabled user even with a valid session', async () => {
    user.current = withPermissions('disabled', ['orders.manage']);
    await expect(requirePermission('orders.manage')).rejects.toThrow(
      'REDIRECT:/admin/login',
    );
  });

  it('rejects a user without the permission', async () => {
    user.current = withPermissions('active', ['products.manage']);
    await expect(requirePermission('orders.manage')).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });

  it('allows a user with the permission', async () => {
    user.current = withPermissions('active', ['orders.manage']);
    await expect(requirePermission('orders.manage')).resolves.toMatchObject({
      id: 'u1',
    });
  });
});

describe('rateLimit', () => {
  it('blocks after the limit and resets after the window', () => {
    const key = 'test:key';
    for (let i = 0; i < 5; i++)
      expect(rateLimit(key, 5, 1000, 0).ok).toBe(true);
    expect(rateLimit(key, 5, 1000, 10).ok).toBe(false);
    expect(rateLimit(key, 5, 1000, 1001).ok).toBe(true);
  });
});
