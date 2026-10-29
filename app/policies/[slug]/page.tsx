import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { whatsappUrl } from '@/config/brand';
import { routes } from '@/config/routes';
import { getPolicy, policies } from '@/data/policies';
import { pageMetadata } from '@/lib/seo/metadata';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

// Pending policies stay noindex until the owner supplies the text (Business-Facts.md).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return {};
  return pageMetadata({
    title: policy.title,
    description: policy.summary,
    path: routes.policy(slug),
    noindex: !policy.body,
  });
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  const whatsapp = whatsappUrl(
    `Hi B&V, I have a question about your ${policy.title.toLowerCase()}.`,
  );

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-16">
      <h1 className="font-display text-h2">{policy.title}</h1>
      <p className="text-muted-foreground mt-3">{policy.summary}</p>

      {policy.body ? (
        <div className="mt-8 flex flex-col gap-4">
          {policy.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {policy.updatedAt && (
            <p className="text-small text-muted-foreground">
              Last updated {policy.updatedAt}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-muted mt-8 rounded-lg p-6 md:p-8">
          <p className="font-display text-h4">This policy is being finalised</p>
          <p className="text-muted-foreground mt-2">
            We are preparing the full text. Until it is published, we are happy
            to answer any question before you order.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {whatsapp && (
              <Button asChild variant="whatsapp">
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  Ask on WhatsApp
                </a>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href={routes.contact}>Contact us</Link>
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}
