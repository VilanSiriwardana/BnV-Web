import Link from 'next/link';

import { AdminPageHeader } from '@/components/admin/page-header';
import { routes } from '@/config/routes';
import { requireAdmin } from '@/lib/auth/guards';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const has = (p: Parameters<typeof admin.permissions.has>[0]) =>
    admin.permissions.has(p);

  const tiles = await Promise.all(
    [
      has('orders.manage') && {
        label: 'Orders to handle',
        href: routes.admin.orders,
        count: prisma.order.count({
          where: { status: { notIn: ['delivered', 'cancelled', 'shipped'] } },
        }),
      },
      has('inquiries.manage') && {
        label: 'New custom requests',
        href: `${routes.admin.customRequests}?status=new`,
        count: prisma.customRequest.count({ where: { status: 'new' } }),
      },
      has('inquiries.manage') && {
        label: 'New collaborations',
        href: `${routes.admin.collaborationInquiries}?status=new`,
        count: prisma.collaborationInquiry.count({ where: { status: 'new' } }),
      },
      has('inquiries.manage') && {
        label: 'New contact messages',
        href: `${routes.admin.contactMessages}?status=new`,
        count: prisma.contactMessage.count({ where: { status: 'new' } }),
      },
      has('products.manage') && {
        label: 'Variants out of stock',
        href: routes.admin.products,
        count: prisma.inventory.count({ where: { quantity: { lte: 0 } } }),
      },
    ].map(async (tile) => (tile ? { ...tile, count: await tile.count } : null)),
  );

  return (
    <>
      <AdminPageHeader
        title={`Welcome${admin.name ? `, ${admin.name}` : ''}`}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.filter(Boolean).map((tile) => (
          <Link
            key={tile!.label}
            href={tile!.href}
            className="border-border hover:bg-accent/40 rounded-md border p-5"
          >
            <p className="font-display text-h2">{tile!.count}</p>
            <p className="text-muted-foreground">{tile!.label}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
