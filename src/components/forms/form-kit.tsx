'use client';

import Link from 'next/link';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  type FormEvent,
  type ReactNode,
} from 'react';
import type { ZodType } from 'zod';

import { Button } from '@/components/ui/button';
import { FieldError, FormMessage } from '@/components/ui/field-error';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { routes } from '@/config/routes';
import { HONEYPOT_FIELD } from '@/lib/forms/fields';
import type { FormState } from '@/lib/forms/types';
import { useInput, type Validatable } from '@/lib/forms/use-input';
import { cn } from '@/lib/utils/cn';
import { format } from 'date-fns';

const labelClass = 'text-label mb-1.5 block font-medium';

type Ctx = {
  formId: string;
  state: FormState<string>;
  register: (field: Validatable) => () => void;
};

const FormCtx = createContext<Ctx | null>(null);

function useFormCtx() {
  const ctx = useContext(FormCtx);
  if (!ctx) throw new Error('Form fields must be rendered inside <FormShell>.');
  return ctx;
}

// Form wrapper: registers fields for submit-time validation, adds the honeypot and the shared status line.
export function FormShell({
  action,
  state,
  pending,
  submitLabel,
  pendingLabel = 'Sending…',
  className,
  children,
}: {
  action: (formData: FormData) => void;
  state: FormState<string>;
  pending: boolean;
  submitLabel: string;
  pendingLabel?: string;
  className?: string;
  children: ReactNode;
}) {
  const formId = useId();
  const fields = useRef(new Set<Validatable>());

  const register = useCallback((field: Validatable) => {
    fields.current.add(field);
    return () => void fields.current.delete(field);
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const list = [...fields.current];
    const firstInvalid = list.map((f) => f.validate()).indexOf(false);
    if (firstInvalid !== -1) {
      event.preventDefault();
      list[firstInvalid].ref.current?.focus();
    }
  };

  return (
    <FormCtx.Provider value={{ formId, state, register }}>
      <form
        action={action}
        onSubmit={onSubmit}
        noValidate
        className={cn('flex flex-col gap-2', className)}
      >
        <div
          aria-hidden
          className="absolute -left-[9999px] size-px overflow-hidden"
        >
          <label htmlFor={`${formId}-hp`}>Leave this empty</label>
          <input
            id={`${formId}-hp`}
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {children}
        <Button
          type="submit"
          size="lg"
          className="mt-4 self-start"
          disabled={pending}
        >
          {pending ? pendingLabel : submitLabel}
        </Button>
        <FormMessage status={state.status} message={state.message} />
      </form>
    </FormCtx.Provider>
  );
}

function useField<
  E extends
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | HTMLButtonElement,
>(name: string, schema: ZodType, type: 'text' | 'checkbox' = 'text') {
  const { formId, state, register } = useFormCtx();
  const input = useInput<E>({
    id: `${formId}-${name}`,
    name,
    schema,
    type,
    initial: state.values?.[name] ?? '',
  });

  const { validate, ref, setServerError } = input;
  const latest = useRef(validate);
  useEffect(() => {
    latest.current = validate;
  }, [validate]);
  useEffect(
    () => register({ validate: () => latest.current(), ref }),
    [register, ref],
  );
  useEffect(() => {
    if (state.status === 'error') setServerError(state.fieldErrors?.[name]);
  }, [state, name, setServerError]);

  return input;
}

type BaseProps = {
  name: string;
  label: string;
  schema: ZodType;
  required?: boolean;
  hint?: string;
  className?: string;
};

function Label({
  htmlFor,
  label,
  required,
  hint,
}: { htmlFor: string } & Pick<BaseProps, 'label' | 'required' | 'hint'>) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {label}
      {!required && (
        <span className="text-muted-foreground font-normal"> (optional)</span>
      )}
      {hint && (
        <span className="text-small text-muted-foreground block font-normal">
          {hint}
        </span>
      )}
    </label>
  );
}

export function TextField({
  type = 'text',
  autoComplete,
  placeholder,
  ...props
}: BaseProps & {
  type?: 'text' | 'email' | 'tel' | 'date' | 'number' | 'password';
  autoComplete?: string;
  placeholder?: string;
}) {
  const input = useField<HTMLInputElement>(props.name, props.schema);
  return (
    <div className={props.className}>
      <Label htmlFor={input.bind.id} {...props} />
      <Input
        {...input.bind}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={type === 'number' ? 'numeric' : undefined}
      />
      <FieldError id={input.errorId} message={input.error} />
    </div>
  );
}

export function TextareaField({
  placeholder,
  rows = 5,
  ...props
}: BaseProps & { placeholder?: string; rows?: number }) {
  const input = useField<HTMLTextAreaElement>(props.name, props.schema);
  return (
    <div className={props.className}>
      <Label htmlFor={input.bind.id} {...props} />
      <Textarea {...input.bind} rows={rows} placeholder={placeholder} />
      <FieldError id={input.errorId} message={input.error} />
    </div>
  );
}

export type Option = { value: string; label: string };

export function SelectField({
  options,
  placeholder = 'Choose one',
  ...props
}: BaseProps & { options: readonly Option[]; placeholder?: string }) {
  const { ref, bind, value, change, error, errorId } =
    useField<HTMLButtonElement>(props.name, props.schema);
  return (
    <div className={props.className}>
      <Label htmlFor={bind.id} {...props} />
      <Combobox
        id={bind.id}
        name={props.name}
        ref={ref}
        options={[...options]}
        placeholder={placeholder}
        searchable={options.length > 7}
        value={value || null}
        onValueChange={(v) => change(v ?? '')}
        aria-invalid={bind['aria-invalid']}
        aria-describedby={errorId}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

const toIso = (d: Date) => format(d, 'yyyy-MM-dd');
const fromIso = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return y && m && d ? new Date(y, m - 1, d) : undefined;
};

// Posts yyyy-MM-dd, the same value a native date input submits.
export function DateField({
  min,
  max,
  placeholder = 'Pick a date',
  ...props
}: BaseProps & { min?: Date; max?: Date; placeholder?: string }) {
  const { ref, bind, value, change, error, errorId } =
    useField<HTMLButtonElement>(props.name, props.schema);
  const disabled = [
    ...(min ? [{ before: min }] : []),
    ...(max ? [{ after: max }] : []),
  ];
  return (
    <div className={props.className}>
      <Label htmlFor={bind.id} {...props} />
      <input type="hidden" name={props.name} value={value} />
      <DatePicker
        id={bind.id}
        ref={ref}
        value={fromIso(value)}
        onValueChange={(d) => change(d ? toIso(d) : '')}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full"
        aria-invalid={bind['aria-invalid']}
        aria-describedby={errorId}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function ConsentField({ schema }: { schema: ZodType }) {
  const input = useField<HTMLInputElement>('consent', schema, 'checkbox');
  return (
    <div className="mt-2">
      <div className="flex items-start gap-2">
        <input
          {...input.bind}
          className="accent-primary mt-1 size-4 shrink-0"
        />
        <label htmlFor={input.bind.id} className="text-small">
          I agree to the{' '}
          <Link
            href={routes.policy('terms')}
            className="text-primary-text underline underline-offset-4"
          >
            terms
          </Link>{' '}
          and{' '}
          <Link
            href={routes.policy('privacy')}
            className="text-primary-text underline underline-offset-4"
          >
            privacy policy
          </Link>
          .
        </label>
      </div>
      <FieldError id={input.errorId} message={input.error} />
    </div>
  );
}

export function FormSuccess({
  title,
  message,
  whatsapp,
}: {
  title: string;
  message?: string;
  whatsapp?: { href: string | null; label: string };
}) {
  return (
    <div role="status" className="bg-muted rounded-lg p-6 md:p-8">
      <p className="font-display text-h3">{title}</p>
      {message && <p className="text-muted-foreground mt-2">{message}</p>}
      {whatsapp?.href && (
        <Button asChild variant="whatsapp" className="mt-4">
          <a href={whatsapp.href} target="_blank" rel="noopener noreferrer">
            {whatsapp.label}
          </a>
        </Button>
      )}
    </div>
  );
}
