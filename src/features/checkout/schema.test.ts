import { describe, expect, it } from 'vitest';

import { buildOrderNotes, checkoutSchema, sriLankaPhoneSchema } from './schema';

const valid = {
  name: 'Nimali Perera',
  phone: '077 123 4567',
  email: 'Nimali@Example.com',
  addressLine1: '12 Lake Road',
  district: 'Kandy',
  city: 'Peradeniya',
  paymentMethod: 'cod',
  consent: 'on',
};

describe('sriLankaPhoneSchema', () => {
  it.each([
    '0771234567',
    '077 123 4567',
    '+94771234567',
    '94771234567',
    '771234567',
  ])('normalises %s', (input) => {
    expect(sriLankaPhoneSchema.parse(input)).toBe('+94771234567');
  });

  it.each(['0112345678', '07712345', ''])('rejects %s', (input) => {
    expect(sriLankaPhoneSchema.safeParse(input).success).toBe(false);
  });
});

describe('checkoutSchema', () => {
  it('accepts a minimal valid form', () => {
    const data = checkoutSchema.parse(valid);
    expect(data.email).toBe('nimali@example.com');
    expect(data.preferredContact).toBe('whatsapp');
    expect(data.isGift).toBe(false);
  });

  it('requires consent, a known district and payment method', () => {
    const result = checkoutSchema.safeParse({
      ...valid,
      consent: null,
      district: 'Atlantis',
      paymentMethod: 'card',
    });
    expect(result.success).toBe(false);
    const paths = result.error!.issues.map((i) => i.path[0]);
    expect(paths).toEqual(
      expect.arrayContaining(['consent', 'district', 'paymentMethod']),
    );
  });

  it('writes gift details into notes', () => {
    const notes = buildOrderNotes(
      checkoutSchema.parse({
        ...valid,
        isGift: 'on',
        giftMessage: 'Happy birthday',
      }),
    );
    expect(notes).toContain('Gift: yes');
    expect(notes).toContain('Gift message: Happy birthday');
  });
});
