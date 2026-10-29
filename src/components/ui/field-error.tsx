import { cn } from '@/lib/utils';

// Always rendered with a reserved line so messages never shift the layout.
function FieldError({
  id,
  message,
  className,
}: {
  id: string;
  message?: string;
  className?: string;
}) {
  return (
    <p
      id={id}
      aria-live="polite"
      className={cn(
        'text-caption text-destructive mt-1 line-clamp-1 min-h-5 text-left',
        className,
      )}
    >
      {message}
    </p>
  );
}

function FormMessage({
  status,
  message,
  className,
}: {
  status: 'idle' | 'success' | 'info' | 'error';
  message?: string;
  className?: string;
}) {
  return (
    <p
      role={status === 'error' ? 'alert' : 'status'}
      className={cn(
        'text-small mt-2 line-clamp-2 min-h-5',
        status === 'error' ? 'text-destructive' : 'text-primary-text',
        className,
      )}
    >
      {status === 'info' || status === 'error' ? message : null}
    </p>
  );
}

export { FieldError, FormMessage };
