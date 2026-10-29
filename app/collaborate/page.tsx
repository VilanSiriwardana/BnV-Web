import type { Metadata } from 'next';

import { routes } from '@/config/routes';
import { collaborationInquiryTypeSchema } from '@/constants/statuses';
import { CollaborateForms } from '@/features/collaboration/collaborate-forms';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Work With Us',
  description:
    'Invite Buwi and Vila to model for your brand, appear at your event or create a visual story together. Send a collaboration inquiry.',
  path: routes.collaborate,
});

export default async function CollaboratePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { type } = await searchParams;
  const parsed = collaborationInquiryTypeSchema.safeParse(type);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-16">
      <h1 className="font-display text-h2">Work with us</h1>
      <p className="text-muted-foreground mt-3 mb-10">
        Buwi and Vila work as models, lifestyle creators and collaborators for
        brands, restaurants, events and campaigns. Tell us what you are
        planning.
      </p>
      <CollaborateForms
        initialType={parsed.success ? parsed.data : 'collaboration'}
      />
    </div>
  );
}
