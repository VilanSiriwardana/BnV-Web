import Image from 'next/image';
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
import { readListParams, type ListSearchParams } from '@/lib/admin/list-params';
import { requirePermission } from '@/lib/auth/guards';
import { formatDateTime } from '@/lib/utils/format';

import { updateInquiryStatus } from './actions';
import { inquiryConfig, type InquiryKind } from './config';
import { getInquiry, listInquiries } from './queries';

export async function InquiryListView({
  kind,
  searchParams,
}: {
  kind: InquiryKind;
  searchParams: ListSearchParams;
}) {
  await requirePermission('inquiries.manage');
  const config = inquiryConfig[kind];
  const params = await readListParams(searchParams, config.statuses);
  const { rows, total } = await listInquiries(kind, params);

  return (
    <>
      <AdminPageHeader title={config.title} />
      <FilterBar
        statuses={config.statuses}
        status={params.status}
        q={params.q}
        searchPlaceholder="Name, phone or email"
      />
      <AdminTable
        headers={['Received', 'Name', 'Contact', 'About', 'Status']}
        empty={`No ${config.singular} matches these filters.`}
        rows={rows.map((r) => ({
          key: r.id,
          href: `${config.href}/${r.id}`,
          cells: [
            formatDateTime(r.createdAt),
            r.name,
            r.contact,
            r.summary,
            <StatusBadge key="s" status={r.status} />,
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

export async function InquiryDetailView({
  kind,
  params,
}: {
  kind: InquiryKind;
  params: Promise<{ id: string }>;
}) {
  await requirePermission('inquiries.manage');
  const config = inquiryConfig[kind];
  const { id } = await params;
  const inquiry = await getInquiry(kind, id).catch(() => null);
  if (!inquiry) notFound();

  const firstName = inquiry.name.split(' ')[0];
  const whatsapp = whatsappUrlTo(
    inquiry.phone,
    `Hi ${firstName}, this is ${brand.name}. Thank you for your ${config.singular}. `,
  );

  return (
    <>
      <Link href={config.href} className="text-small text-muted-foreground">
        ← {config.title}
      </Link>
      <AdminPageHeader
        title={inquiry.name}
        actions={<StatusBadge status={inquiry.status} />}
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="flex flex-col gap-4">
          <DetailList
            items={[
              { label: 'Received', value: formatDateTime(inquiry.createdAt) },
              { label: 'Contact', value: inquiry.contact },
              ...inquiry.fields,
            ]}
          />
          {inquiry.message && (
            <div>
              <h2 className="font-display text-h4 mb-2">Message</h2>
              <p className="whitespace-pre-line">{inquiry.message}</p>
            </div>
          )}
          {inquiry.images.length > 0 && (
            <div>
              <h2 className="font-display text-h4 mb-2">Reference images</h2>
              <ul className="flex flex-wrap gap-3">
                {inquiry.images.map((src) => (
                  <li key={src}>
                    <a href={src} target="_blank" rel="noopener noreferrer">
                      <Image
                        src={src}
                        alt="Reference image from the customer"
                        width={192}
                        height={192}
                        className="border-border aspect-square rounded-sm border object-cover"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
        <aside className="flex flex-col gap-4">
          <StatusForm
            action={updateInquiryStatus.bind(null, kind, inquiry.id)}
            current={inquiry.status}
            options={config.statuses}
          />
          {whatsapp && (
            <Button asChild variant="whatsapp">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                Reply on WhatsApp
              </a>
            </Button>
          )}
          {inquiry.email && (
            <Button asChild variant="secondary">
              <a href={`mailto:${inquiry.email}`}>Reply by email</a>
            </Button>
          )}
        </aside>
      </div>
    </>
  );
}
