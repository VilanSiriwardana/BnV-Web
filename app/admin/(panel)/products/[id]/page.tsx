import { ProductEditView } from '@/features/admin-catalog/views';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ProductEditView params={params} />;
}
