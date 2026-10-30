import { Gift, MessageCircle } from 'lucide-react';
import type { Metadata } from 'next';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { brand } from '@/config/brand';
import { themeTokens } from '@/config/theme';

import { ComponentsShowcase } from './components-showcase';

export const metadata: Metadata = {
  title: 'Style Guide',
  robots: { index: false, follow: false },
};

const typeScale = [
  ['display', 'font-display text-display md:text-[4rem]', 'Style for you.'],
  ['h1', 'font-display text-h1 md:text-[3rem]', 'Gifts for them.'],
  ['h2', 'font-display text-h2 md:text-[2.25rem]', 'Moments for two.'],
  ['h3', 'font-display text-h3 md:text-[1.75rem]', 'Discover the Collection'],
  ['h4', 'text-h4 font-semibold md:text-[1.25rem]', 'Lavender Silk Slip Dress'],
  [
    'body-lg',
    'text-body-lg',
    'Crafted with care, for you and the people you love.',
  ],
  ['body', 'text-body', 'Soft, premium everyday pieces made to be lived in.'],
  ['small', 'text-small text-muted-foreground', 'Ships in 3–5 days'],
  ['caption', 'text-caption font-medium', 'GIFT READY'],
] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border flex flex-col gap-6 border-t py-12">
      <h2 className="text-h2">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleGuidePage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
        <div>
          <p className="text-caption text-gold-text font-semibold tracking-widest uppercase">
            Design system
          </p>
          <h1 className="text-h1">Style Guide</h1>
        </div>
        <ThemeToggle />
      </div>

      <Section title="Color tokens">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {themeTokens.map((token) => (
            <li key={token} className="flex flex-col gap-2">
              <span
                className="border-border h-16 rounded-md border shadow-sm"
                style={{ backgroundColor: `var(--${token})` }}
              />
              <code className="text-caption">{token}</code>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Typography">
        <ul className="flex flex-col gap-4">
          {typeScale.map(([name, className, sample]) => (
            <li
              key={name}
              className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-8"
            >
              <code className="text-caption text-muted-foreground w-20 shrink-0">
                {name}
              </code>
              <span className={className}>{sample}</span>
            </li>
          ))}
        </ul>
        <p className="font-display text-h3 italic">
          “Moments for two, made to remember.”
        </p>
        <p className="text-small">
          <a href="#" className="text-primary-text underline">
            Primary text link
          </a>
          {' · '}
          <span className="text-gold-text">Gold text accent</span>
        </p>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Shop the Drop</Button>
          <Button variant="secondary">Explore Our Story</Button>
          <Button variant="outline">Discover the Collection</Button>
          <Button variant="ghost">Make It Personal</Button>
          <Button variant="link">Work With Us</Button>
          <Button variant="luxury">
            <Gift />
            Premium Box
          </Button>
          <Button variant="destructive">Remove</Button>
          <Button variant="whatsapp" disabled={!brand.contact.whatsapp}>
            <MessageCircle />
            Chat on WhatsApp
          </Button>
          <Button disabled>Disabled</Button>
        </div>
        {!brand.contact.whatsapp && (
          <p className="text-small text-muted-foreground">
            WhatsApp number pending (Business-Facts). The button is hidden on
            public pages until it is confirmed.
          </p>
        )}
        <ComponentsShowcase section="buttons" />
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-3">
          <Badge>New Arrival</Badge>
          <Badge variant="rose">Couple Favorite</Badge>
          <Badge variant="gold">Limited Drop</Badge>
          <Badge variant="outline">Gift Ready</Badge>
          <Badge variant="destructive">Sold Out</Badge>
        </div>
      </Section>

      <Section title="Form">
        <div className="flex max-w-md flex-col gap-2">
          <label htmlFor="sg-email" className="text-small font-medium">
            Email
          </label>
          <Input id="sg-email" type="email" placeholder="you@example.com" />
          <Input
            aria-invalid
            placeholder="Invalid field"
            aria-label="Invalid field example"
          />
        </div>
      </Section>

      <Section title="Cards & surfaces">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-h4 font-sans">Card</CardTitle>
              <CardDescription>surface-elevated with border</CardDescription>
            </CardHeader>
            <CardContent className="text-body">
              Gift something meaningful.
            </CardContent>
          </Card>
          <div className="bg-surface rounded-md p-6">
            <p className="text-h4 font-semibold">Surface</p>
            <p className="text-small text-muted-foreground">
              Soft blush / deep plum section
            </p>
          </div>
          <div className="bg-muted rounded-md p-6">
            <p className="text-h4 font-semibold">Muted</p>
            <p className="text-small text-muted-foreground">
              Muted UI background
            </p>
          </div>
        </div>
        <ComponentsShowcase section="cards" />
        <div className="bg-chrome text-chrome-foreground rounded-lg p-6">
          <p className="text-h4 font-semibold">Chrome gradient</p>
          <p className="text-small opacity-70">Footer band</p>
        </div>
      </Section>

      <Section title="Selects, dates & controls">
        <ComponentsShowcase section="inputs" />
      </Section>

      <Section title="Data table & carousel">
        <ComponentsShowcase section="data" />
      </Section>

      <Section title="Dialog, tooltip & tabs">
        <ComponentsShowcase section="overlays" />
      </Section>

      <Section title="Sheet & accordion">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-fit">
              Open sheet
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Your bag</SheetTitle>
              <SheetDescription>Drawer surface sample.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <Accordion type="single" collapsible className="max-w-xl">
          <AccordionItem value="delivery">
            <AccordionTrigger>Delivery</AccordionTrigger>
            <AccordionContent>
              Contact us on WhatsApp for delivery details.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="care">
            <AccordionTrigger>Care</AccordionTrigger>
            <AccordionContent>Sample accordion content.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>
    </div>
  );
}
