import type { Metadata } from 'next';

import { brand } from '@/config/brand';
import { siteConfig } from '@/config/seo';

type PageMeta = {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
  noindex?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  image,
  noindex,
}: PageMeta): Metadata {
  const desc = description?.slice(0, 160) ?? undefined;
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: brand.name,
      locale: siteConfig.locale,
      title,
      description: desc,
      url: path,
      ...(image && { images: [image] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      ...(image && { images: [image] }),
    },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}
