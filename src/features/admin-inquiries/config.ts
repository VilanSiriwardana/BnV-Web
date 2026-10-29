import { routes } from '@/config/routes';
import {
  collaborationInquiryStatuses,
  contactMessageStatuses,
  customRequestStatuses,
} from '@/constants/statuses';

export const inquiryKinds = ['custom', 'collaboration', 'contact'] as const;
export type InquiryKind = (typeof inquiryKinds)[number];

export const inquiryConfig = {
  custom: {
    title: 'Custom requests',
    singular: 'custom request',
    href: routes.admin.customRequests,
    statuses: customRequestStatuses,
  },
  collaboration: {
    title: 'Collaboration inquiries',
    singular: 'collaboration inquiry',
    href: routes.admin.collaborationInquiries,
    statuses: collaborationInquiryStatuses,
  },
  contact: {
    title: 'Contact messages',
    singular: 'contact message',
    href: routes.admin.contactMessages,
    statuses: contactMessageStatuses,
  },
} as const satisfies Record<
  InquiryKind,
  { title: string; singular: string; href: string; statuses: readonly string[] }
>;
