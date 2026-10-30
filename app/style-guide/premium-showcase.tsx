'use client';

import * as React from 'react';
import { Gift, HeartHandshake, Package, Sparkles } from 'lucide-react';

import { CollectionCard } from '@/components/cards/collection-card';
import { FeatureCard } from '@/components/cards/feature-card';
import { ProductCard } from '@/components/cards/product-card';
import { StatCard } from '@/components/cards/stat-card';
import { TestimonialCard } from '@/components/cards/testimonial-card';
import type { CardStyle } from '@/components/cards/variants';
import { Divider } from '@/components/marketing/divider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/components/ui/currency-select';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { ImageFrame } from '@/components/ui/image-frame';
import { Lightbox } from '@/components/ui/lightbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { TagsInput } from '@/components/ui/tags-input';
import { TimePicker } from '@/components/ui/time-picker';
import { toast } from '@/components/ui/toaster';

const img = (name: string) =>
  `/images/prototype/banner-${name}-light-mobile.webp`;
const gallery = ['care-guide', 'contact', 'care-guide', 'contact'].map(
  (n, i) => ({ src: img(n), alt: `Sample image ${i + 1}` }),
);

type Order = { id: string; customer: string; total: number; status: string };
const names = ['Nethmi', 'Kasun', 'Ayesha', 'Dilan', 'Sanduni', 'Ravi'];
const orders: Order[] = Array.from({ length: 23 }, (_, i) => ({
  id: `BNV-${1040 + i}`,
  customer: names[i % names.length],
  total: 4500 + ((i * 3170) % 30000),
  status: ['Paid', 'Pending', 'Shipped'][i % 3],
}));
const orderColumns: DataTableColumn<Order>[] = [
  { key: 'id', header: 'Order', cell: (o) => o.id, sortValue: (o) => o.id },
  {
    key: 'customer',
    header: 'Customer',
    cell: (o) => o.customer,
    sortValue: (o) => o.customer,
  },
  {
    key: 'total',
    header: 'Total',
    cell: (o) => `LKR ${o.total.toLocaleString()}`,
    sortValue: (o) => o.total,
    className: 'tabular-nums',
  },
  {
    key: 'status',
    header: 'Status',
    cell: (o) => <Badge variant="outline">{o.status}</Badge>,
  },
];
const noOrders: Order[] = [];

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-small font-sans font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

export function PremiumShowcase({
  section,
}: {
  section: 'buttons' | 'inputs' | 'table' | 'feedback' | 'media' | 'cards';
}) {
  const [currency, setCurrency] = React.useState<string | null>('LKR');
  const [time, setTime] = React.useState<string>();
  const [tags, setTags] = React.useState(['Gift ready', 'Anniversary']);
  const [files, setFiles] = React.useState<File[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [lightbox, setLightbox] = React.useState<number | null>(null);

  if (section === 'buttons') {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Button size="lg">Shimmer + spotlight</Button>
        <Button variant="gold">Gold (luxury)</Button>
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
        >
          {loading ? 'Saving…' : 'Loading state'}
        </Button>
        <Button variant="outline" size="icon" aria-label="Gift">
          <Gift />
        </Button>
      </div>
    );
  }

  if (section === 'inputs') {
    return (
      <div className="grid max-w-3xl gap-6 md:grid-cols-2">
        <Field label="Currency" htmlFor="sg-currency">
          <CurrencySelect
            id="sg-currency"
            value={currency}
            onValueChange={setCurrency}
          />
        </Field>
        <Field label="Delivery time" htmlFor="sg-time">
          <TimePicker id="sg-time" value={time} onValueChange={setTime} />
        </Field>
        <Field label="Payment (RadioGroup)">
          <RadioGroup name="sg-pay" defaultValue="cod">
            <RadioGroupItem value="cod" description="Pay when it arrives">
              Cash on delivery
            </RadioGroupItem>
            <RadioGroupItem value="bank" description="Confirmed on WhatsApp">
              Bank transfer
            </RadioGroupItem>
          </RadioGroup>
        </Field>
        <Field label="Tags" htmlFor="sg-tags">
          <TagsInput
            id="sg-tags"
            value={tags}
            onValueChange={setTags}
            max={6}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Reference photos">
            <FileDropzone value={files} onValueChange={setFiles} />
          </Field>
        </div>
      </div>
    );
  }

  if (section === 'table') {
    return (
      <div className="flex flex-col gap-6">
        <label className="flex items-center gap-2 font-sans text-sm">
          <Switch checked={loading} onCheckedChange={setLoading} /> Loading
        </label>
        <DataTable
          rows={orders}
          columns={orderColumns}
          getRowKey={(o) => o.id}
          loading={loading}
          selectable
          selected={selected}
          onSelectedChange={setSelected}
          pageSize={8}
        />
        <DataTable
          rows={noOrders}
          columns={orderColumns}
          getRowKey={(o) => o.id}
          empty="No orders match these filters."
        />
      </div>
    );
  }

  if (section === 'feedback') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              toast.success('Added to your bag', {
                description: 'Lavender Silk Slip Dress',
              })
            }
          >
            Success toast
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.error('Could not save your note')}
          >
            Error toast
          </Button>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="soft">Open glass drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Your bag</DrawerTitle>
                <DrawerDescription>Glass drawer surface.</DrawerDescription>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="flex max-w-sm items-center gap-4">
          <Skeleton className="size-14 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <Divider />
      </div>
    );
  }

  if (section === 'media') {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {gallery.map((g, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightbox(i)}
            className="group focus-ring cursor-zoom-in rounded-lg"
            aria-label={`Open ${g.alt}`}
          >
            <ImageFrame
              src={g.src}
              alt={g.alt}
              aspect={i % 2 ? 'square' : 'portrait'}
              overlay
            />
          </button>
        ))}
        <Lightbox
          images={gallery}
          open={lightbox !== null}
          onOpenChange={(o) => !o && setLightbox(null)}
          startIndex={lightbox ?? 0}
        />
      </div>
    );
  }

  const styles: CardStyle[] = ['solid', 'glass', 'gradient-border'];
  return (
    <div className="flex flex-col gap-10">
      <div className="bg-surface grid gap-6 rounded-lg p-6 sm:grid-cols-3">
        {(['shadow-sm', 'shadow-md', 'shadow-lg'] as const).map((s) => (
          <div key={s} className={`bg-card rounded-md p-6 font-sans text-sm`}>
            {s}
          </div>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {styles.map((v) => (
          <ProductCard
            key={v}
            variant={v}
            product={{
              id: v,
              slug: 'sample',
              name: `Lavender Silk Slip Dress (${v})`,
              priceLkr: 12500,
              imageUrl: img('care-guide'),
              imageAlt: 'Sample product',
              isNew: v === 'solid',
              badge: v === 'gradient-border' ? 'Limited Drop' : undefined,
            }}
          />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {styles.map((v, i) => (
          <FeatureCard
            key={v}
            variant={v}
            icon={[Sparkles, Package, HeartHandshake][i]}
            title={`Feature (${v})`}
            text="Made to order and wrapped with care."
            link={{ label: 'Learn more', href: '#' }}
          />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {styles.map((v) => (
          <CollectionCard
            key={v}
            variant={v}
            label={`Collection (${v})`}
            subtitle="Soft pieces for two"
            href="#"
            image={{ light: img('contact'), dark: img('contact') }}
          />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {styles.map((v) => (
          <TestimonialCard
            key={v}
            variant={v}
            quote="Sample quote for layout only."
            name="Sample name"
            detail="Placeholder"
          />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {styles.map((v, i) => (
          <StatCard
            key={v}
            variant={v}
            label="Orders this month"
            value={['128', '42', '96%'][i]}
            hint={`StatCard (${v})`}
            icon={Package}
          />
        ))}
      </div>
    </div>
  );
}
