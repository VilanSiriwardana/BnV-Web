'use client';

import { useActionState, useState } from 'react';

import {
  DateField,
  ConsentField,
  FormShell,
  FormSuccess,
  SelectField,
  TextareaField,
  TextField,
} from '@/components/forms/form-kit';
import { whatsappUrl } from '@/config/brand';
import type { CollaborationInquiryType } from '@/constants/statuses';
import { cn } from '@/lib/utils/cn';

import { submitCollaborationInquiry } from './actions';
import {
  budgetRangeOptions,
  inquiryTabs,
  meetingModeOptions,
  projectTypeOptions,
  requestedRoleOptions,
  requiredPeopleOptions,
} from './options';
import {
  collaborationFields,
  consultationFields,
  eventInvitationFields,
  type CollaborationState,
} from './schema';

const initialState: CollaborationState = { status: 'idle' };

export function CollaborateForms({
  initialType,
}: {
  initialType: CollaborationInquiryType;
}) {
  const [type, setType] = useState(initialType);

  const select = (next: CollaborationInquiryType) => {
    setType(next);
    const url = new URL(window.location.href);
    url.searchParams.set('type', next);
    window.history.replaceState(null, '', url);
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Inquiry type"
        className="bg-muted mb-8 inline-flex flex-wrap rounded-md p-1"
      >
        {inquiryTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            id={`tab-${tab.value}`}
            aria-selected={type === tab.value}
            aria-controls="collaborate-panel"
            onClick={() => select(tab.value)}
            className={cn(
              'text-small rounded-sm px-4 py-2 font-medium transition-colors',
              type === tab.value
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        id="collaborate-panel"
        role="tabpanel"
        aria-labelledby={`tab-${type}`}
      >
        <InquiryForm key={type} type={type} />
      </div>
    </div>
  );
}

function InquiryForm({ type }: { type: CollaborationInquiryType }) {
  const [state, formAction, pending] = useActionState(
    submitCollaborationInquiry,
    initialState,
  );

  if (state.status === 'success') {
    return (
      <FormSuccess
        title="Inquiry received"
        message={state.message}
        whatsapp={
          type === 'consultation'
            ? {
                href: whatsappUrl(
                  'Hi B&V, I just requested a consultation. Confirming here on WhatsApp.',
                ),
                label: 'Confirm on WhatsApp',
              }
            : undefined
        }
      />
    );
  }

  return (
    <FormShell
      action={formAction}
      state={state}
      pending={pending}
      submitLabel="Send inquiry"
    >
      <input type="hidden" name="inquiryType" value={type} />
      {type === 'collaboration' && <CollaborationFields />}
      {type === 'consultation' && <ConsultationFields />}
      {type === 'event_invitation' && <EventInvitationFields />}
    </FormShell>
  );
}

type Shape =
  | typeof collaborationFields.shape
  | typeof consultationFields.shape
  | typeof eventInvitationFields.shape;

function ContactDetails({
  f,
  brandRequired,
}: {
  f: Shape;
  brandRequired?: boolean;
}) {
  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <TextField
          placeholder="e.g. Dilini Perera"
          name="name"
          label="Your name"
          schema={f.name}
          required
          autoComplete="name"
        />
        <TextField
          placeholder="e.g. Café Kandy"
          name="brandName"
          label={brandRequired ? 'Organiser or brand' : 'Brand or business'}
          schema={f.brandName}
          required={brandRequired}
          autoComplete="organization"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <TextField
          placeholder="you@example.com"
          name="email"
          label="Email"
          schema={f.email}
          required
          type="email"
          autoComplete="email"
        />
        <TextField
          name="phone"
          label="Mobile (WhatsApp)"
          schema={f.phone}
          required
          type="tel"
          autoComplete="tel"
          placeholder="077 123 4567"
        />
      </div>
    </>
  );
}

function Closing({ f }: { f: Shape }) {
  return (
    <>
      <TextareaField
        placeholder="Tell us what you have in mind"
        name="message"
        label="Tell us about it"
        schema={f.message}
        required
      />
      <TextareaField
        name="referenceLinks"
        label="Reference links"
        schema={f.referenceLinks}
        rows={3}
        hint="Up to 5 links, one per line (mood boards, Instagram posts, venue pages)."
      />
      <ConsentField schema={f.consent} />
    </>
  );
}

function CollaborationFields() {
  const f = collaborationFields.shape;
  return (
    <>
      <ContactDetails f={f} />
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <SelectField
          placeholder="Choose a project type"
          name="projectType"
          label="Project type"
          schema={f.projectType}
          options={projectTypeOptions}
          required
        />
        <SelectField
          placeholder="Choose who you need"
          name="requiredPeople"
          label="Who would you like?"
          schema={f.requiredPeople}
          options={requiredPeopleOptions}
          required
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
        <DateField
          placeholder="Pick a date"
          hint="We will confirm availability with you"
          name="preferredDate"
          label="Preferred date"
          schema={f.preferredDate}
          min={new Date()}
        />
        <TextField
          placeholder="e.g. Galle Face, Colombo"
          name="location"
          label="Location"
          schema={f.location}
        />
        <SelectField
          placeholder="Choose a range"
          hint="In LKR"
          name="budgetRange"
          label="Budget range"
          schema={f.budgetRange}
          options={budgetRangeOptions}
        />
      </div>
      <Closing f={f} />
    </>
  );
}

function ConsultationFields() {
  const f = consultationFields.shape;
  return (
    <>
      <ContactDetails f={f} />
      <SelectField
        placeholder="Choose a project type"
        name="projectType"
        label="What is it about?"
        schema={f.projectType}
        options={projectTypeOptions}
      />
      <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
        <DateField
          placeholder="Pick a date"
          hint="We will confirm availability with you"
          name="preferredDate"
          label="Preferred date"
          schema={f.preferredDate}
          required
          min={new Date()}
        />
        <TextField
          name="preferredTime"
          label="Preferred time"
          schema={f.preferredTime}
          required
          placeholder="e.g. 4–6 pm"
        />
        <SelectField
          placeholder="In person or online"
          name="meetingMode"
          label="Meeting"
          schema={f.meetingMode}
          options={meetingModeOptions}
          required
        />
      </div>
      <TextField
        placeholder="e.g. Galle Face, Colombo"
        name="location"
        label="Meeting place"
        schema={f.location}
        hint="Needed for in-person meetings."
      />
      <Closing f={f} />
    </>
  );
}

function EventInvitationFields() {
  const f = eventInvitationFields.shape;
  return (
    <>
      <ContactDetails f={f} brandRequired />
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <SelectField
          placeholder="Choose who you need"
          name="requiredPeople"
          label="Who would you like to invite?"
          schema={f.requiredPeople}
          options={requiredPeopleOptions}
          required
        />
        <SelectField
          placeholder="Choose a role"
          name="requestedRole"
          label="Role"
          schema={f.requestedRole}
          options={requestedRoleOptions}
          required
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
        <DateField
          placeholder="Pick your event date"
          hint="Pick the day of your event"
          name="preferredDate"
          label="Event date"
          schema={f.preferredDate}
          required
          min={new Date()}
        />
        <TextField
          placeholder="e.g. 6:30 PM"
          name="preferredTime"
          label="Time"
          schema={f.preferredTime}
        />
        <TextField
          placeholder="e.g. 150 guests"
          hint="A rough number is fine"
          name="expectedAudience"
          label="Expected audience"
          schema={f.expectedAudience}
        />
      </div>
      <TextField
        placeholder="Venue name and city"
        name="location"
        label="Venue"
        schema={f.location}
        required
      />
      <Closing f={f} />
    </>
  );
}
