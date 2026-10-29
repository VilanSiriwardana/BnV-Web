import { OrderDetailView } from '@/features/admin-orders/views';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <OrderDetailView params={params} />;
}
