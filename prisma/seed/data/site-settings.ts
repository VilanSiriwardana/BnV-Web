// Placeholders until the owner supplies real values (Gate B). Re-seeding never overwrites edits.
export const SITE_SETTINGS = [
  {
    key: 'currency',
    value: 'LKR',
    description: 'Default currency',
    isPublic: true,
  },
  {
    key: 'country',
    value: 'LK',
    description: 'Default country',
    isPublic: true,
  },
  {
    key: 'whatsapp_number',
    value: '',
    description: 'WhatsApp contact number',
    isPublic: true,
  },
  {
    key: 'instagram_url',
    value: '',
    description: 'Instagram profile URL',
    isPublic: true,
  },
  {
    key: 'tiktok_url',
    value: '',
    description: 'TikTok profile URL',
    isPublic: true,
  },
] as const;
