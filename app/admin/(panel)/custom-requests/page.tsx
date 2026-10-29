import type { ListSearchParams } from '@/lib/admin/list-params';
import { InquiryListView } from '@/features/admin-inquiries/views';

export default function Page({
  searchParams,
}: {
  searchParams: ListSearchParams;
}) {
  return <InquiryListView kind="custom" searchParams={searchParams} />;
}
