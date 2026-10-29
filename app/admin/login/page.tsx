import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { routes } from '@/config/routes';
import { LoginForm } from '@/features/admin-auth/login-form';
import { getAdmin } from '@/lib/auth/guards';

export const metadata: Metadata = {
  title: 'Admin sign in',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect(routes.admin.dashboard);

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="text-h2 font-display mb-6">Admin sign in</h1>
      <LoginForm />
    </div>
  );
}
