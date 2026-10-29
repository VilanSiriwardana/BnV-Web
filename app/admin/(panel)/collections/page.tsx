import type { ListSearchParams } from '@/lib/admin/list-params';
import { CollectionListView } from '@/features/admin-catalog/views';

export default function Page({
  searchParams,
}: {
  searchParams: ListSearchParams;
}) {
  return <CollectionListView searchParams={searchParams} />;
}
