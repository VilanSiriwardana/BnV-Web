import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getLoveSite } from '@/features/love/config';
import { LoveExperience } from '@/features/love/love-experience';

const title = 'A little something';

// Private page: neutral title, no names in previews, never indexed (ADR-0028).
export const metadata: Metadata = {
  title: { absolute: title },
  robots: { index: false, follow: false },
  openGraph: { title },
  twitter: { title },
};

export default async function LovePage(props: PageProps<'/love/[slug]'>) {
  const { slug } = await props.params;
  const site = getLoveSite(slug);
  if (!site) notFound();
  return <LoveExperience site={site} />;
}
