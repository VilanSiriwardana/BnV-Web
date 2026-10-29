import { Badge } from '@/components/ui/badge';
import { formatStatus } from '@/lib/utils/format';

const DONE = [
  'completed',
  'delivered',
  'replied',
  'accepted',
  'shipped',
  'active',
];
const STOPPED = ['cancelled', 'rejected', 'declined', 'archived', 'disabled'];

export function StatusBadge({ status }: { status: string }) {
  const variant = DONE.includes(status)
    ? 'default'
    : STOPPED.includes(status)
      ? 'outline'
      : status === 'new'
        ? 'gold'
        : 'rose';
  return <Badge variant={variant}>{formatStatus(status)}</Badge>;
}
