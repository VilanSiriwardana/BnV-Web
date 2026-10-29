import type { ListSearchParams } from '@/lib/admin/list-params';
import { ProductListView } from '@/features/admin-catalog/views';

export default function Page({
  searchParams,
}: {
  searchParams: ListSearchParams;
}) {
  return <ProductListView searchParams={searchParams} />;
}
