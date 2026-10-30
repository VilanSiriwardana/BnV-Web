import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AdminNav, type AdminNavItem } from '@/components/admin/admin-nav';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import type { PermissionName } from '@/constants/permissions';
import { logoutAdmin } from '@/features/admin-auth/actions';
import { requireAdmin } from '@/lib/auth/guards';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

const NAV: (AdminNavItem & { permission?: PermissionName })[] = [
  { href: routes.admin.dashboard, label: 'Dashboard' },
  { href: routes.admin.orders, label: 'Orders', permission: 'orders.manage' },
  {
    href: routes.admin.customRequests,
    label: 'Custom requests',
    permission: 'inquiries.manage',
  },
  {
    href: routes.admin.collaborationInquiries,
    label: 'Collaborations',
    permission: 'inquiries.manage',
  },
  {
    href: routes.admin.contactMessages,
    label: 'Contact messages',
    permission: 'inquiries.manage',
  },
  {
    href: routes.admin.products,
    label: 'Products',
    permission: 'products.manage',
  },
  {
    href: routes.admin.categories,
    label: 'Categories',
    permission: 'catalog.manage',
  },
  {
    href: routes.admin.collections,
    label: 'Collections',
    permission: 'catalog.manage',
  },
];

// Server-side gate for every admin page (D-12); proxy.ts is only a redirect.
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await requireAdmin();
  const items = NAV.filter(
    (item) => !item.permission || admin.permissions.has(item.permission),
  );

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 font-sans md:grid-cols-[13rem_1fr]">
      <aside className="flex flex-col gap-4">
        <p className="font-display text-h4">BnV Admin</p>
        <AdminNav items={items} />
        <form action={logoutAdmin} className="mt-auto">
          <p className="text-caption text-muted-foreground mb-2 truncate">
            {admin.email}
          </p>
          <Button type="submit" variant="secondary" size="sm">
            Sign out
          </Button>
        </form>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
