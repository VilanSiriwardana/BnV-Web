'use client';

import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type RefObject,
} from 'react';
import type { ZodType } from 'zod';

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type Options = {
  id: string;
  name: string;
  schema: ZodType;
  initial?: string;
  type?: 'text' | 'checkbox';
};

// Controlled input validated against its Zod field schema: on blur, then on every change once touched.
export function useInput<E extends FieldElement = HTMLInputElement>({
  id,
  name,
  schema,
  initial = '',
  type = 'text',
}: Options) {
  const [value, setValue] = useState(initial);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const ref = useRef<E>(null);
  const errorId = `${id}-error`;

  const validate = useCallback(
    (next: string = value) => {
      const result = schema.safeParse(
        type === 'checkbox' ? next || null : next,
      );
      setError(result.success ? undefined : result.error.issues[0]?.message);
      return result.success;
    },
    [schema, type, value],
  );

  const onChange = (event: ChangeEvent<E>) => {
    const next =
      type === 'checkbox'
        ? (event.target as HTMLInputElement).checked
          ? 'on'
          : ''
        : event.target.value;
    setValue(next);
    if (touched || type === 'checkbox') validate(next);
  };

  const onBlur = () => {
    setTouched(true);
    validate();
  };

  const reset = () => {
    setValue(initial);
    setTouched(false);
    setError(undefined);
  };

  const field = {
    id,
    name,
    ref,
    onChange,
    onBlur,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': errorId,
  };

  return {
    value,
    error,
    errorId,
    ref,
    validate,
    reset,
    setServerError: setError,
    bind:
      type === 'checkbox'
        ? { ...field, type: 'checkbox' as const, checked: value === 'on' }
        : { ...field, value },
  };
}

export type Validatable = {
  validate: () => boolean;
  ref: RefObject<FieldElement | null>;
};

// Blocks submission when any input is invalid and focuses the first one (UX-Spec §6).
export function useFormValidation(inputs: Validatable[]) {
  return (event: FormEvent<HTMLFormElement>) => {
    const results = inputs.map((input) => input.validate());
    const firstInvalid = results.indexOf(false);
    if (firstInvalid !== -1) {
      event.preventDefault();
      inputs[firstInvalid].ref.current?.focus();
    }
  };
}
