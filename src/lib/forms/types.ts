// Shared return shape for every form Server Action (AGENTS.md "Forms").
export type FormState<F extends string> = {
  status: 'idle' | 'success' | 'info' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<F, string>>;
  values?: Partial<Record<F, string>>;
};
