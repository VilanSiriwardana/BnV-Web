'use client';

import { useActionState } from 'react';

import {
  ConsentField,
  FormShell,
  FormSuccess,
  TextareaField,
  TextField,
} from '@/components/forms/form-kit';

import { sendContactMessage } from './actions';
import { contactFields, type ContactState } from './schema';

const initialState: ContactState = { status: 'idle' };
const f = contactFields.shape;

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initialState,
  );

  if (state.status === 'success') {
    return <FormSuccess title="Message sent" message={state.message} />;
  }

  return (
    <FormShell
      action={formAction}
      state={state}
      pending={pending}
      submitLabel="Send message"
    >
      <TextField
        placeholder="e.g. Dilini Perera"
        name="name"
        label="Full name"
        schema={f.name}
        required
        autoComplete="name"
      />
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <TextField
          placeholder="you@example.com"
          name="email"
          label="Email"
          schema={f.email}
          type="email"
          autoComplete="email"
        />
        <TextField
          name="phone"
          label="Mobile"
          schema={f.phone}
          type="tel"
          autoComplete="tel"
          placeholder="077 123 4567"
        />
      </div>
      <p className="text-caption text-muted-foreground -mt-1 mb-2">
        Please share at least one so we can reply.
      </p>
      <TextField
        placeholder="e.g. Question about an order"
        name="subject"
        label="Subject"
        schema={f.subject}
      />
      <TextareaField
        placeholder="Tell us what you have in mind"
        name="message"
        label="Message"
        schema={f.message}
        required
      />
      <ConsentField schema={f.consent} />
    </FormShell>
  );
}
