import type { ListSearchParams } from '@/lib/admin/list-params';
import { OrderListView } from '@/features/admin-orders/views';

export default function Page({
  searchParams,
}: {
  searchParams: ListSearchParams;
}) {
  return <OrderListView searchParams={searchParams} />;
}
