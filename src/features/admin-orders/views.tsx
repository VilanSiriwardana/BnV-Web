import type { Prisma } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AdminTable, DetailList } from '@/components/admin/data-table';
import { FilterBar } from '@/components/admin/filter-bar';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Pagination } from '@/components/admin/pagination';
import { StatusBadge } from '@/components/admin/status-badge';
import { StatusForm } from '@/components/admin/status-form';
import { Button } from '@/components/ui/button';
import { brand, whatsappUrlTo } from '@/config/brand';
import { routes } from '@/config/routes';
import { orderStatuses, type OrderStatus } from '@/constants/statuses';
import { readListParams, type ListSearchParams } from '@/lib/admin/list-params';
import { requirePermission } from '@/lib/auth/guards';
import { prisma } from '@/lib/prisma';
import { formatDateTime, formatLkr, formatStatus } from '@/lib/utils/format';

import { changeOrderStatus } from './actions';
import { orderTransitions } from './transitions';

const contains = (q: string) => ({ contains: q, mode: 'insensitive' as const });

export async function OrderListView({
  searchParams,
}: {
  searchParams: ListSearchParams;
}) {
  await requirePermission('orders.manage');
  const params = await readListParams(searchParams, orderStatuses);
  const where: Prisma.OrderWhereInput = {
    status: params.status,
    OR: params.q
      ? [
          { orderNumber: contains(params.q) },
          { customerName: contains(params.q) },
          { customerPhone: contains(params.q) },
          { customerEmail: contains(params.q) },
        ]
      : undefined,
  };
  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: params.skip,
      take: params.take,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerPhone: true,
        grandTotal: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  return (
    <>
      <AdminPageHeader title="Orders" />
      <FilterBar
        statuses={orderStatuses}
        status={params.status}
        q={params.q}
        searchPlaceholder="Order number, name or phone"
      />
      <AdminTable
        headers={['Placed', 'Order', 'Customer', 'Total', 'Status']}
        empty="No orders match these filters."
        rows={orders.map((o) => ({
          key: o.id,
          href: `${routes.admin.orders}/${o.id}`,
          cells: [
            formatDateTime(o.createdAt),
            o.orderNumber,
            [o.customerName, o.customerPhone].filter(Boolean).join(' · '),
            formatLkr(Number(o.grandTotal)),
            <StatusBadge key="s" status={o.status} />,
          ],
        }))}
      />
      <Pagination
        page={params.page}
        total={total}
        params={{ status: params.status, q: params.q }}
      />
    </>
  );
}

export async function OrderDetailView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission('orders.manage');
  const { id } = await params;
  const order = await prisma.order
    .findUnique({ where: { id }, include: { items: true } })
    .catch(() => null);
  if (!order) notFound();

  const status = order.status as OrderStatus;
  const next = orderTransitions[status] ?? [];
  const whatsapp = whatsappUrlTo(
    order.customerPhone,
    `Hi ${order.customerName.split(' ')[0]}, this is ${brand.name} about your order ${order.orderNumber}. `,
  );
  const address = [
    order.addressLine1,
    order.addressLine2,
    order.city,
    order.district,
    order.province,
    order.postalCode,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      <Link
        href={routes.admin.orders}
        className="text-small text-muted-foreground"
      >
        ← Orders
      </Link>
      <AdminPageHeader
        title={order.orderNumber}
        actions={<StatusBadge status={order.status} />}
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="flex flex-col gap-6">
          <DetailList
            items={[
              { label: 'Placed', value: formatDateTime(order.createdAt) },
              { label: 'Customer', value: order.customerName },
              {
                label: 'Contact',
                value: [order.customerPhone, order.customerEmail]
                  .filter(Boolean)
                  .join(' · '),
              },
              { label: 'Deliver to', value: address },
              {
                label: 'Payment',
                value: `${formatStatus(order.paymentMethod ?? 'not set')} · ${formatStatus(order.paymentStatus)}`,
              },
              ...(order.dispatchedAt
                ? [
                    {
                      label: 'Dispatched',
                      value: formatDateTime(order.dispatchedAt),
                    },
                  ]
                : []),
              ...(order.notes ? [{ label: 'Notes', value: order.notes }] : []),
            ]}
          />
          <AdminTable
            headers={['SKU', 'Item', 'Qty', 'Unit', 'Total']}
            empty="This order has no items."
            rows={order.items.map((item) => ({
              key: item.id,
              href: routes.product(item.productSlug),
              cells: [
                item.sku,
                item.productName,
                item.quantity,
                formatLkr(Number(item.unitPrice)),
                formatLkr(Number(item.lineTotal)),
              ],
            }))}
          />
          <p className="text-right font-medium">
            Total {formatLkr(Number(order.grandTotal))}
          </p>
        </section>
        <aside className="flex flex-col gap-4">
          <StatusForm
            action={changeOrderStatus.bind(null, order.id)}
            current={order.status}
            options={[order.status, ...next]}
          />
          <p className="text-caption text-muted-foreground">
            Moving to Shipped dispatches the order and takes the items out of
            stock. Cancelling a dispatched order puts them back.
          </p>
          {whatsapp && (
            <Button asChild variant="whatsapp">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                Message on WhatsApp
              </a>
            </Button>
          )}
        </aside>
      </div>
    </>
  );
}
