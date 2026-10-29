import type { Metadata } from 'next';

import { routes } from '@/config/routes';
import { CustomRequestForm } from '@/features/custom-request/custom-request-form';
import { pageMetadata } from '@/lib/seo/metadata';

// Landing and inquiry only in Phase 1; the builder comes in Phase 3 (D-09).
export const metadata: Metadata = pageMetadata({
  title: 'Love Websites',
  description:
    'A personal website for your love story: your photos, your moments and your words, made by B&V for an anniversary, proposal or birthday.',
  path: routes.loveWebsites,
});

const steps = [
  {
    title: 'Share your story',
    body: 'Tell us about the two of you and the occasion.',
  },
  {
    title: 'Send your photos',
    body: 'Share the pictures and moments you want included.',
  },
  {
    title: 'We design it',
    body: 'We build a private page and refine it with you.',
  },
];

export default function LoveWebsitesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-16">
      <h1 className="font-display text-h2">Love websites</h1>
      <p className="text-muted-foreground mt-3">
        A small website made only for the person you love: your story, your
        photos and the words you want them to keep.
      </p>
      <ol className="my-10 grid gap-4 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="bg-muted rounded-lg p-5">
            <p className="text-caption text-primary-text">Step {i + 1}</p>
            <p className="font-display text-h4 mt-1">{s.title}</p>
            <p className="text-small text-muted-foreground mt-1">{s.body}</p>
          </li>
        ))}
      </ol>
      <CustomRequestForm presetType="love_website" />
    </div>
  );
}
