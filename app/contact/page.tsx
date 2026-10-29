import type { Metadata } from 'next';

import { brand, whatsappUrl } from '@/config/brand';
import { routes } from '@/config/routes';
import { ContactForm } from '@/features/contact/contact-form';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description:
    'Questions about an order, a custom piece or a collaboration? Write to B&V or message us on WhatsApp.',
  path: routes.contact,
});

export default function ContactPage() {
  const whatsapp = whatsappUrl('Hi B&V, I have a question.');
  const email = brand.contact.email as string | null;

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 md:grid-cols-[2fr_1fr] md:px-8 md:py-16">
      <div>
        <h1 className="font-display text-h2">Contact us</h1>
        <p className="text-muted-foreground mt-3 mb-8">
          Tell us what you have in mind. We read every message personally.
        </p>
        <ContactForm />
      </div>
      <aside className="flex flex-col gap-4">
        <h2 className="font-display text-h4">Other ways to reach us</h2>
        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-text underline underline-offset-4"
          >
            WhatsApp {brand.contact.whatsapp}
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="text-primary-text underline underline-offset-4"
          >
            {email}
          </a>
        )}
      </aside>
    </div>
  );
}
