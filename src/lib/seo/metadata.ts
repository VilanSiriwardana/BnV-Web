import type { Metadata } from 'next';

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
      title,
      description: desc,
      url: path,
      ...(image && { images: [image] }),
    },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}
