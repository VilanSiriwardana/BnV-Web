import type { Metadata } from 'next';

import { routes } from '@/config/routes';
import { CustomRequestForm } from '@/features/custom-request/custom-request-form';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Custom Orders',
  description:
    'Custom outfits, jewelry, engraving, embroidery and gift boxes made for your moment. Tell B&V your idea and get a quote.',
  path: routes.custom,
});

export default function CustomPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-16">
      <h1 className="font-display text-h2">Custom orders</h1>
      <p className="text-muted-foreground mt-3 mb-10">
        Something made only for you or for them. Share your idea, and we will
        reply with a quote before anything is made.
      </p>
      <CustomRequestForm />
    </div>
  );
}
