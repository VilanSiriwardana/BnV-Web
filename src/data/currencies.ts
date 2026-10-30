export const currencies = [
  { code: 'LKR', name: 'Sri Lankan Rupee', country: 'LK' },
  { code: 'USD', name: 'US Dollar', country: 'US' },
  { code: 'EUR', name: 'Euro', country: 'EU' },
  { code: 'GBP', name: 'British Pound', country: 'GB' },
  { code: 'AED', name: 'UAE Dirham', country: 'AE' },
  { code: 'INR', name: 'Indian Rupee', country: 'IN' },
  { code: 'AUD', name: 'Australian Dollar', country: 'AU' },
  { code: 'JPY', name: 'Japanese Yen', country: 'JP' },
  { code: 'SGD', name: 'Singapore Dollar', country: 'SG' },
] as const;

export type CurrencyCode = (typeof currencies)[number]['code'];
