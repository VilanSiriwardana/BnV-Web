import type { ListSearchParams } from '@/lib/admin/list-params';
import { CategoryListView } from '@/features/admin-catalog/views';

export default function Page({
  searchParams,
}: {
  searchParams: ListSearchParams;
}) {
  return <CategoryListView searchParams={searchParams} />;
}
