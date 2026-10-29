import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { formatLkr, formatStatus } from '@/lib/utils/format';

import type { InquiryKind } from './config';

export type InquiryRow = {
  id: string;
  name: string;
  contact: string;
  summary: string;
  status: string;
  createdAt: Date;
};

export type InquiryDetail = InquiryRow & {
  phone: string | null;
  email: string | null;
  fields: { label: string; value: string }[];
  message: string | null;
  images: string[];
};

type ListArgs = { status?: string; q?: string; skip: number; take: number };

const contains = (q: string) => ({ contains: q, mode: 'insensitive' as const });
const joinContact = (...values: (string | null)[]) =>
  values.filter(Boolean).join(' · ');
const day = (d: Date | null) => d?.toISOString().slice(0, 10) ?? '';
const label = (v: string | null) => (v ? formatStatus(v) : '');

export async function listInquiries(
  kind: InquiryKind,
  { status, q, skip, take }: ListArgs,
): Promise<{ rows: InquiryRow[]; total: number }> {
  const order = { createdAt: 'desc' as const };

  if (kind === 'custom') {
    const where: Prisma.CustomRequestWhereInput = {
      status,
      OR: q
        ? [
            { customerName: contains(q) },
            { customerPhone: contains(q) },
            { customerEmail: contains(q) },
          ]
        : undefined,
    };
    const [items, total] = await prisma.$transaction([
      prisma.customRequest.findMany({ where, orderBy: order, skip, take }),
      prisma.customRequest.count({ where }),
    ]);
    return {
      total,
      rows: items.map((r) => ({
        id: r.id,
        name: r.customerName,
        contact: joinContact(r.customerPhone, r.customerEmail),
        summary: label(r.requestType),
        status: r.status,
        createdAt: r.createdAt,
      })),
    };
  }

  if (kind === 'collaboration') {
    const where: Prisma.CollaborationInquiryWhereInput = {
      status,
      OR: q
        ? [
            { name: contains(q) },
            { brandName: contains(q) },
            { email: contains(q) },
            { phone: contains(q) },
          ]
        : undefined,
    };
    const [items, total] = await prisma.$transaction([
      prisma.collaborationInquiry.findMany({
        where,
        orderBy: order,
        skip,
        take,
      }),
      prisma.collaborationInquiry.count({ where }),
    ]);
    return {
      total,
      rows: items.map((r) => ({
        id: r.id,
        name: r.brandName ? `${r.name} (${r.brandName})` : r.name,
        contact: joinContact(r.phone, r.email),
        summary: label(r.inquiryType),
        status: r.status,
        createdAt: r.createdAt,
      })),
    };
  }

  const where: Prisma.ContactMessageWhereInput = {
    status,
    OR: q
      ? [
          { name: contains(q) },
          { email: contains(q) },
          { phone: contains(q) },
          { subject: contains(q) },
        ]
      : undefined,
  };
  const [items, total] = await prisma.$transaction([
    prisma.contactMessage.findMany({ where, orderBy: order, skip, take }),
    prisma.contactMessage.count({ where }),
  ]);
  return {
    total,
    rows: items.map((r) => ({
      id: r.id,
      name: r.name,
      contact: joinContact(r.phone, r.email),
      summary: r.subject ?? r.message.slice(0, 60),
      status: r.status,
      createdAt: r.createdAt,
    })),
  };
}

const filled = (fields: { label: string; value: string }[]) =>
  fields.filter((f) => f.value);

export async function getInquiry(
  kind: InquiryKind,
  id: string,
): Promise<InquiryDetail | null> {
  if (kind === 'custom') {
    const r = await prisma.customRequest.findUnique({ where: { id } });
    if (!r) return null;
    const budget = [r.budgetMin, r.budgetMax]
      .map((v) => (v == null ? null : formatLkr(Number(v))))
      .filter(Boolean)
      .join(' – ');
    return {
      id: r.id,
      name: r.customerName,
      contact: joinContact(r.customerPhone, r.customerEmail),
      summary: label(r.requestType),
      status: r.status,
      createdAt: r.createdAt,
      phone: r.customerPhone,
      email: r.customerEmail,
      message: r.message,
      images: r.referenceImageUrls,
      fields: filled([
        { label: 'Request type', value: label(r.requestType) },
        { label: 'Product type', value: r.productType ?? '' },
        { label: 'Occasion', value: r.occasion ?? '' },
        { label: 'Customisation', value: r.customizationType ?? '' },
        { label: 'Personalisation text', value: r.personalizationText ?? '' },
        { label: 'Preferred colour', value: r.preferredColor ?? '' },
        { label: 'Preferred material', value: r.preferredMaterial ?? '' },
        { label: 'Budget', value: budget },
        { label: 'Needed by', value: day(r.requiredDate) },
      ]),
    };
  }

  if (kind === 'collaboration') {
    const r = await prisma.collaborationInquiry.findUnique({ where: { id } });
    if (!r) return null;
    const links = Array.isArray(r.referenceLinks)
      ? (r.referenceLinks as string[]).join('\n')
      : '';
    return {
      id: r.id,
      name: r.brandName ? `${r.name} (${r.brandName})` : r.name,
      contact: joinContact(r.phone, r.email),
      summary: label(r.inquiryType),
      status: r.status,
      createdAt: r.createdAt,
      phone: r.phone,
      email: r.email,
      message: r.message,
      images: [],
      fields: filled([
        { label: 'Inquiry type', value: label(r.inquiryType) },
        { label: 'Project type', value: r.projectType ?? '' },
        { label: 'People needed', value: r.requiredPeople ?? '' },
        { label: 'Preferred date', value: day(r.preferredDate) },
        { label: 'Preferred time', value: r.preferredTime ?? '' },
        { label: 'Meeting mode', value: label(r.meetingMode) },
        { label: 'Location', value: r.location ?? '' },
        { label: 'Budget range', value: r.budgetRange ?? '' },
        { label: 'Expected audience', value: r.expectedAudience ?? '' },
        { label: 'Requested role', value: r.requestedRole ?? '' },
        { label: 'Reference links', value: links },
      ]),
    };
  }

  const r = await prisma.contactMessage.findUnique({ where: { id } });
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    contact: joinContact(r.phone, r.email),
    summary: r.subject ?? '',
    status: r.status,
    createdAt: r.createdAt,
    phone: r.phone,
    email: r.email,
    message: r.message,
    images: [],
    fields: filled([
      { label: 'Subject', value: r.subject ?? '' },
      { label: 'Source', value: label(r.source) },
    ]),
  };
}
