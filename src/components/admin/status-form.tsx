'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { FormMessage } from '@/components/ui/field-error';
import { Select } from '@/components/ui/select';
import type { FormState } from '@/lib/forms/types';
import { formatStatus } from '@/lib/utils/format';

export type StatusState = FormState<'status'>;
export type StatusAction = (
  prev: StatusState,
  formData: FormData,
) => Promise<StatusState>;

export function StatusForm({
  action,
  current,
  options,
}: {
  action: StatusAction;
  current: string;
  options: readonly string[];
}) {
  const [state, formAction, pending] = useActionState(action, {
    status: 'idle',
  });

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <label className="w-full sm:w-56">
          <span className="sr-only">Status</span>
          <Select name="status" defaultValue={current} key={current}>
            {options.map((s) => (
              <option key={s} value={s}>
                {formatStatus(s)}
              </option>
            ))}
          </Select>
        </label>
        <Button type="submit" disabled={pending || options.length < 2}>
          {pending ? 'Saving…' : 'Update status'}
        </Button>
      </div>
      <FormMessage status={state.status} message={state.message} />
    </form>
  );
}
