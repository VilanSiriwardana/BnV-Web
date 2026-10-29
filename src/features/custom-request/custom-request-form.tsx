'use client';

import { useActionState } from 'react';

import {
  ConsentField,
  FormShell,
  FormSuccess,
  SelectField,
  TextareaField,
  TextField,
} from '@/components/forms/form-kit';
import { whatsappUrl } from '@/config/brand';
import type { CustomRequestType } from '@/constants/statuses';

import { submitCustomRequest } from './actions';
import { occasionOptions, requestTypeOptions } from './options';
import { customRequestFields, type CustomRequestState } from './schema';

const initialState: CustomRequestState = { status: 'idle' };
const f = customRequestFields.shape;

export function CustomRequestForm({
  presetType,
}: {
  presetType?: CustomRequestType;
}) {
  const [state, formAction, pending] = useActionState(
    submitCustomRequest,
    initialState,
  );
  const isLoveWebsite = presetType === 'love_website';

  if (state.status === 'success') {
    return (
      <FormSuccess
        title="Request received"
        message={`${state.message} You can send reference images on WhatsApp.`}
        whatsapp={{
          href: whatsappUrl(
            isLoveWebsite
              ? 'Hi B&V, I just sent a love website request. Here are my photos and ideas:'
              : 'Hi B&V, I just sent a custom request. Here are my reference images:',
          ),
          label: 'Send images on WhatsApp',
        }}
      />
    );
  }

  return (
    <FormShell
      action={formAction}
      state={state}
      pending={pending}
      submitLabel="Send request"
    >
      <fieldset className="flex flex-col gap-2">
        <legend className="font-display text-h4 mb-4">Your idea</legend>
        {presetType ? (
          <input type="hidden" name="requestType" value={presetType} />
        ) : (
          <SelectField
            name="requestType"
            label="What would you like made?"
            schema={f.requestType}
            options={requestTypeOptions}
            required
          />
        )}
        <SelectField
          name="occasion"
          label="Occasion"
          schema={f.occasion}
          options={occasionOptions}
        />
        <TextareaField
          name="message"
          label={isLoveWebsite ? 'Tell us your story' : 'Describe your idea'}
          schema={f.message}
          required
          placeholder={
            isLoveWebsite
              ? 'How you met, the moments you want to include, and who it is for.'
              : 'What you have in mind, sizes, quantities and any details that matter.'
          }
        />
        <TextField
          name="personalizationText"
          label={
            isLoveWebsite ? 'Names and special dates' : 'Personalisation text'
          }
          schema={f.personalizationText}
          hint={
            isLoveWebsite
              ? undefined
              : 'Names, initials or a short message to add.'
          }
        />
        {!isLoveWebsite && (
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <TextField
              name="preferredColor"
              label="Preferred colour"
              schema={f.preferredColor}
            />
            <TextField
              name="preferredMaterial"
              label="Preferred material"
              schema={f.preferredMaterial}
            />
          </div>
        )}
        <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
          <TextField
            name="budgetMin"
            label="Budget from (LKR)"
            schema={f.budgetMin}
            type="number"
          />
          <TextField
            name="budgetMax"
            label="Budget up to (LKR)"
            schema={f.budgetMax}
            type="number"
          />
          <TextField
            name="requiredDate"
            label="Needed by"
            schema={f.requiredDate}
            type="date"
          />
        </div>
        <p className="text-caption text-muted-foreground">
          Have reference images? Send them on WhatsApp after submitting.
          Pricing, timing and any change terms are confirmed with your quote.
        </p>
      </fieldset>

      <fieldset className="mt-6 flex flex-col gap-2">
        <legend className="font-display text-h4 mb-4">Your details</legend>
        <TextField
          name="name"
          label="Full name"
          schema={f.name}
          required
          autoComplete="name"
        />
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
          <TextField
            name="phone"
            label="Mobile (WhatsApp)"
            schema={f.phone}
            required
            type="tel"
            autoComplete="tel"
            placeholder="077 123 4567"
          />
          <TextField
            name="email"
            label="Email"
            schema={f.email}
            type="email"
            autoComplete="email"
          />
        </div>
        <ConsentField schema={f.consent} />
      </fieldset>
    </FormShell>
  );
}
