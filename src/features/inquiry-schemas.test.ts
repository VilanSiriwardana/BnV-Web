import { describe, expect, it } from 'vitest';

import { collaborationSchema } from '@/features/collaboration/schema';
import { contactSchema } from '@/features/contact/schema';
import { customRequestSchema } from '@/features/custom-request/schema';

const future = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
const past = '2020-01-01';
const message = 'A short but valid message.';

describe('contactSchema', () => {
  const base = { name: 'Nimali Perera', message, consent: 'on' };

  it('requires an email or a phone', () => {
    const r = contactSchema.safeParse(base);
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].path).toEqual(['email']);
  });

  it('accepts a phone only and normalises it, storing blanks as undefined', () => {
    const r = contactSchema.parse({
      ...base,
      phone: '077 123 4567',
      email: '',
      subject: '',
    });
    expect(r.phone).toBe('+94771234567');
    expect(r.email).toBeUndefined();
    expect(r.subject).toBeUndefined();
  });
});

describe('customRequestSchema', () => {
  const base = {
    requestType: 'gift_box',
    name: 'Nimali Perera',
    phone: '0771234567',
    message,
    consent: 'on',
  };

  it('accepts the minimum fields', () => {
    expect(customRequestSchema.safeParse(base).success).toBe(true);
  });

  it('rejects a maximum budget below the minimum', () => {
    const r = customRequestSchema.safeParse({
      ...base,
      budgetMin: '20000',
      budgetMax: '10000',
    });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].path).toEqual(['budgetMax']);
  });

  it('coerces budgets and rejects past dates', () => {
    expect(
      customRequestSchema.parse({
        ...base,
        budgetMin: '5000',
        requiredDate: future,
      }).budgetMin,
    ).toBe(5000);
    expect(
      customRequestSchema.safeParse({ ...base, requiredDate: past }).success,
    ).toBe(false);
  });

  it('rejects an unknown request type', () => {
    expect(
      customRequestSchema.safeParse({ ...base, requestType: 'tattoo' }).success,
    ).toBe(false);
  });
});

describe('collaborationSchema', () => {
  const contact = {
    name: 'Kasun Silva',
    email: 'kasun@example.com',
    phone: '+94771234567',
    message,
    consent: 'on',
  };

  it('collaboration requires project type and people', () => {
    expect(
      collaborationSchema.safeParse({
        ...contact,
        inquiryType: 'collaboration',
      }).success,
    ).toBe(false);
    expect(
      collaborationSchema.safeParse({
        ...contact,
        inquiryType: 'collaboration',
        projectType: 'fashion',
        requiredPeople: 'couple',
      }).success,
    ).toBe(true);
  });

  it('consultation in person requires a location', () => {
    const consultation = {
      ...contact,
      inquiryType: 'consultation',
      preferredDate: future,
      preferredTime: '4 pm',
      meetingMode: 'in_person',
    };
    const r = collaborationSchema.safeParse(consultation);
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].path).toEqual(['location']);
    expect(
      collaborationSchema.safeParse({ ...consultation, meetingMode: 'online' })
        .success,
    ).toBe(true);
  });

  it('event invitation requires organiser, venue, date and role', () => {
    const event = {
      ...contact,
      inquiryType: 'event_invitation',
      brandName: 'Cafe Lumière',
      requiredPeople: 'couple',
      preferredDate: future,
      location: 'Colombo 07',
      requestedRole: 'special_guests',
    };
    expect(collaborationSchema.safeParse(event).success).toBe(true);
    expect(
      collaborationSchema.safeParse({ ...event, location: '' }).success,
    ).toBe(false);
  });

  it('splits reference links and rejects invalid ones', () => {
    const base = {
      ...contact,
      inquiryType: 'collaboration',
      projectType: 'fashion',
      requiredPeople: 'buwi',
    };
    const r = collaborationSchema.parse({
      ...base,
      referenceLinks: 'https://a.example\n\nhttps://b.example',
    });
    expect(r.referenceLinks).toEqual([
      'https://a.example',
      'https://b.example',
    ]);
    expect(
      collaborationSchema.safeParse({ ...base, referenceLinks: 'not a link' })
        .success,
    ).toBe(false);
  });
});
