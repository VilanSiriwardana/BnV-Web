import { z } from 'zod';

// D-04 and D-20 (Phase-1-Reconciled-Decisions.md). Add values there first.
export const productStatuses = ['draft', 'active', 'archived'] as const;
export const productStatusSchema = z.enum(productStatuses);
export type ProductStatus = z.infer<typeof productStatusSchema>;

export const cartStatuses = ['active', 'converted', 'abandoned'] as const;
export const cartStatusSchema = z.enum(cartStatuses);
export type CartStatus = z.infer<typeof cartStatusSchema>;

export const orderStatuses = [
  'inquiry_received',
  'pending_confirmation',
  'confirmed',
  'preparing',
  'cancelled',
  'shipped',
  'delivered',
] as const;
export const orderStatusSchema = z.enum(orderStatuses);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const orderPaymentStatuses = [
  'not_required',
  'pending',
  'paid',
  'failed',
  'refunded',
] as const;
export const orderPaymentStatusSchema = z.enum(orderPaymentStatuses);
export type OrderPaymentStatus = z.infer<typeof orderPaymentStatusSchema>;

export const paymentProviders = ['manual', 'payhere', 'koko'] as const;
export const paymentProviderSchema = z.enum(paymentProviders);
export type PaymentProvider = z.infer<typeof paymentProviderSchema>;

export const paymentStatuses = [
  'pending',
  'paid',
  'failed',
  'cancelled',
  'refunded',
] as const;
export const paymentStatusSchema = z.enum(paymentStatuses);
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

export const paymentMethods = ['cod', 'bank_transfer'] as const;
export const paymentMethodSchema = z.enum(paymentMethods);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const customRequestStatuses = [
  'new',
  'reviewing',
  'quoted',
  'accepted',
  'rejected',
  'completed',
] as const;
export const customRequestStatusSchema = z.enum(customRequestStatuses);
export type CustomRequestStatus = z.infer<typeof customRequestStatusSchema>;

export const customRequestTypes = [
  'custom_fashion',
  'custom_jewelry',
  'gift_box',
  'embroidery',
  'engraving',
  'love_website',
  'other',
] as const;
export const customRequestTypeSchema = z.enum(customRequestTypes);
export type CustomRequestType = z.infer<typeof customRequestTypeSchema>;

export const contactMessageStatuses = [
  'new',
  'read',
  'replied',
  'archived',
] as const;
export const contactMessageStatusSchema = z.enum(contactMessageStatuses);
export type ContactMessageStatus = z.infer<typeof contactMessageStatusSchema>;

export const collaborationInquiryStatuses = [
  'new',
  'reviewing',
  'replied',
  'accepted',
  'declined',
  'archived',
] as const;
export const collaborationInquiryStatusSchema = z.enum(
  collaborationInquiryStatuses,
);
export type CollaborationInquiryStatus = z.infer<
  typeof collaborationInquiryStatusSchema
>;

export const collaborationInquiryTypes = [
  'collaboration',
  'consultation',
  'event_invitation',
] as const;
export const collaborationInquiryTypeSchema = z.enum(collaborationInquiryTypes);
export type CollaborationInquiryType = z.infer<
  typeof collaborationInquiryTypeSchema
>;

export const newsletterSubscriberStatuses = ['active', 'unsubscribed'] as const;
export const newsletterSubscriberStatusSchema = z.enum(
  newsletterSubscriberStatuses,
);
export type NewsletterSubscriberStatus = z.infer<
  typeof newsletterSubscriberStatusSchema
>;

export const userStatuses = ['active', 'disabled'] as const;
export const userStatusSchema = z.enum(userStatuses);
export type UserStatus = z.infer<typeof userStatusSchema>;
