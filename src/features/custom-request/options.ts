import type { CustomRequestType } from '@/constants/statuses';

export const requestTypeOptions = [
  { value: 'custom_fashion', label: 'Custom outfit or matching set' },
  { value: 'custom_jewelry', label: 'Custom jewelry' },
  { value: 'gift_box', label: 'Custom gift box' },
  { value: 'embroidery', label: 'Embroidery' },
  { value: 'engraving', label: 'Engraving' },
  { value: 'love_website', label: 'Love website' },
  { value: 'other', label: 'Something else' },
] as const satisfies readonly { value: CustomRequestType; label: string }[];

export const occasions = [
  'birthday',
  'anniversary',
  'wedding',
  'engagement',
  'proposal',
  'valentines',
  'just_because',
  'other',
] as const;

export const occasionOptions = [
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'valentines', label: "Valentine's Day" },
  { value: 'just_because', label: 'Just because' },
  { value: 'other', label: 'Other' },
] as const satisfies readonly {
  value: (typeof occasions)[number];
  label: string;
}[];
