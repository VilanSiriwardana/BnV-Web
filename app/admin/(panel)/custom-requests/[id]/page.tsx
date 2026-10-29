import { InquiryDetailView } from '@/features/admin-inquiries/views';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <InquiryDetailView kind="custom" params={params} />;
}
