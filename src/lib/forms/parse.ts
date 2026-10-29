import { z } from 'zod';

import type { FormState } from './types';

// Validates FormData against a schema and builds the error state with echoed values (AGENTS.md "Forms").
export function parseForm<S extends z.ZodType>(
  schema: S,
  formData: FormData,
):
  | { success: true; data: z.output<S> }
  | { success: false; state: FormState<string> } {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === 'string'),
  ) as Record<string, string>;
  const parsed = schema.safeParse(raw);
  if (parsed.success) return { success: true, data: parsed.data };

  const { fieldErrors, formErrors } = z.flattenError(parsed.error);
  const errors = Object.fromEntries(
    Object.entries(fieldErrors as Record<string, string[] | undefined>).map(
      ([k, v]) => [k, v?.[0]],
    ),
  );
  const values = withoutConsent(raw);

  return {
    success: false,
    state: {
      status: 'error',
      message: formErrors[0] ?? 'Please check the highlighted fields.',
      fieldErrors: errors,
      values,
    },
  };
}

export const SERVER_ERROR = {
  status: 'error',
  message: 'Something went wrong on our side. Please try again shortly.',
} as const;

export function withoutConsent<T extends { consent?: unknown }>(
  data: T,
): Omit<T, 'consent'> {
  const copy = { ...data };
  delete copy.consent;
  return copy;
}
