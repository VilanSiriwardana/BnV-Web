import { CollectionEditView } from '@/features/admin-catalog/views';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <CollectionEditView params={params} />;
}
