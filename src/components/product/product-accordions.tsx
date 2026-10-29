import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { policyCopy } from '@/config/brand';
import { routes } from '@/config/routes';
import type { SizeGuide } from '@/data/size-guides';

import { SizeGuideSheet } from './size-guide-sheet';

type Props = { description: string | null; sizeGuide?: SizeGuide };

// Material/care copy is per product and owner-supplied; until then it points to contact.
export function ProductAccordions({ description, sizeGuide }: Props) {
  const sections = [
    description && {
      id: 'description',
      title: 'Description',
      body: description,
    },
    {
      id: 'care',
      title: 'Material & care',
      body: (
        <>
          Care details for this piece are coming soon.{' '}
          <Link href={routes.contact} className="underline underline-offset-4">
            Ask us
          </Link>{' '}
          if you need them now.
        </>
      ),
    },
    sizeGuide && {
      id: 'size-guide',
      title: 'Size guide',
      body: <SizeGuideSheet guide={sizeGuide} />,
    },
    { id: 'gift', title: 'Gift packaging', body: policyCopy.giftPackaging },
    {
      id: 'delivery',
      title: 'Delivery, returns & payment',
      body: (
        <div className="flex flex-col gap-2">
          <p>{policyCopy.delivery}</p>
          <p>{policyCopy.payment}</p>
          <p>{policyCopy.returns}</p>
        </div>
      ),
    },
    {
      id: 'faq',
      title: 'Questions',
      body: (
        <>
          See our{' '}
          <Link href={routes.faq} className="underline underline-offset-4">
            FAQ
          </Link>{' '}
          or{' '}
          <Link href={routes.contact} className="underline underline-offset-4">
            contact us
          </Link>
          .
        </>
      ),
    },
  ].filter((section) => Boolean(section)) as {
    id: string;
    title: string;
    body: React.ReactNode;
  }[];

  return (
    <Accordion type="multiple" defaultValue={['description']}>
      {sections.map((section) => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger className="text-body">
            {section.title}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground whitespace-pre-line">
            {section.body}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
