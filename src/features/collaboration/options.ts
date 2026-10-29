import type { CollaborationInquiryType } from '@/constants/statuses';

export const inquiryTabs = [
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'event_invitation', label: 'Event invitation' },
] as const satisfies readonly {
  value: CollaborationInquiryType;
  label: string;
}[];

export const projectTypes = [
  'fashion',
  'jewelry',
  'promotional',
  'bridal',
  'restaurant',
  'product',
  'cinematic',
  'lifestyle',
  'event',
  'other',
] as const;

export const projectTypeOptions = [
  { value: 'fashion', label: 'Fashion shoot' },
  { value: 'jewelry', label: 'Jewelry shoot' },
  { value: 'promotional', label: 'Brand promotion' },
  { value: 'bridal', label: 'Bridal or couple concept' },
  { value: 'restaurant', label: 'Restaurant or cafe' },
  { value: 'product', label: 'Product campaign' },
  { value: 'cinematic', label: 'Cinematic reel' },
  { value: 'lifestyle', label: 'Lifestyle content' },
  { value: 'event', label: 'Event content' },
  { value: 'other', label: 'Something else' },
] as const satisfies readonly {
  value: (typeof projectTypes)[number];
  label: string;
}[];

export const requiredPeople = ['couple', 'buwi', 'vila', 'not_sure'] as const;
export const requiredPeopleOptions = [
  { value: 'couple', label: 'Buwi and Vila together' },
  { value: 'buwi', label: 'Buwi' },
  { value: 'vila', label: 'Vila' },
  { value: 'not_sure', label: 'Not sure yet' },
] as const;

export const meetingModes = ['online', 'in_person'] as const;
export const meetingModeOptions = [
  { value: 'online', label: 'Online' },
  { value: 'in_person', label: 'In person' },
] as const;

export const budgetRanges = [
  'under_50k',
  '50k_150k',
  '150k_300k',
  'over_300k',
  'discuss',
] as const;
export const budgetRangeOptions = [
  { value: 'under_50k', label: 'Under LKR 50,000' },
  { value: '50k_150k', label: 'LKR 50,000 – 150,000' },
  { value: '150k_300k', label: 'LKR 150,000 – 300,000' },
  { value: 'over_300k', label: 'Over LKR 300,000' },
  { value: 'discuss', label: "Let's discuss" },
] as const;

export const requestedRoles = [
  'special_guests',
  'content_creators',
  'hosts',
  'other',
] as const;
export const requestedRoleOptions = [
  { value: 'special_guests', label: 'Special guests' },
  { value: 'content_creators', label: 'Content creators at the event' },
  { value: 'hosts', label: 'Hosts or presenters' },
  { value: 'other', label: 'Something else' },
] as const;
