'use client';

import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel } from '@/components/ui/carousel';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
import { CountrySelect } from '@/components/ui/country-select';
import { DataTable } from '@/components/ui/data-table';
import {
  DatePicker,
  DateRangePicker,
  type DateRange,
} from '@/components/ui/date-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip } from '@/components/ui/tooltip';

const occasions = [
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'just-because', label: 'Just because' },
];

const orders = [
  { id: 'BNV-1042', customer: 'Nethmi', total: 18500, status: 'Paid' },
  { id: 'BNV-1043', customer: 'Kasun', total: 7200, status: 'Pending' },
  { id: 'BNV-1044', customer: 'Ayesha', total: 32900, status: 'Shipped' },
];

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

export function ComponentsShowcase({
  section,
}: {
  section: 'buttons' | 'cards' | 'inputs' | 'data' | 'overlays';
}) {
  const [single, setSingle] = React.useState<string | null>(null);
  const [multi, setMulti] = React.useState<string[]>(['anniversary']);
  const [country, setCountry] = React.useState<string | null>('LK');
  const [date, setDate] = React.useState<Date>();
  const [range, setRange] = React.useState<DateRange>();
  const [price, setPrice] = React.useState([5000, 25000]);
  const [selected, setSelected] = React.useState<string[]>([]);

  if (section === 'buttons') {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="gradient">Gradient</Button>
        <Button variant="soft">Soft lavender</Button>
      </div>
    );
  }

  if (section === 'cards') {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {(
          ['gradient', 'glass', 'interactive', 'outline-gradient'] as const
        ).map((v) => (
          <Card key={v} variant={v}>
            <CardHeader>
              <CardTitle className="text-h4 font-display">{v}</CardTitle>
            </CardHeader>
            <CardContent className="text-small text-muted-foreground font-sans">
              Card variant=&quot;{v}&quot;
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (section === 'inputs') {
    return (
      <div className="grid max-w-3xl gap-6 md:grid-cols-2">
        <Field label="Single select" htmlFor="sg-single">
          <Combobox
            id="sg-single"
            options={occasions}
            value={single}
            onValueChange={setSingle}
            placeholder="Choose an occasion"
            searchable={false}
          />
        </Field>
        <Field label="Multi select (searchable)" htmlFor="sg-multi">
          <Combobox
            id="sg-multi"
            mode="multi"
            options={occasions}
            value={multi}
            onValueChange={setMulti}
            placeholder="Choose occasions"
          />
        </Field>
        <Field label="Country" htmlFor="sg-country">
          <CountrySelect
            id="sg-country"
            value={country}
            onValueChange={setCountry}
          />
        </Field>
        <Field label="Delivery date" htmlFor="sg-date">
          <DatePicker
            id="sg-date"
            value={date}
            onValueChange={setDate}
            disabled={{ before: new Date() }}
          />
        </Field>
        <Field label="Date range" htmlFor="sg-range">
          <DateRangePicker
            id="sg-range"
            value={range}
            onValueChange={setRange}
          />
        </Field>
        <Field label={`Price: LKR ${price[0]} – ${price[1]}`}>
          <Slider
            value={price}
            onValueChange={setPrice}
            min={0}
            max={50000}
            step={500}
            aria-label="Price range"
          />
        </Field>
        <div className="flex items-center gap-6 font-sans text-sm">
          <label className="flex items-center gap-2">
            <Checkbox defaultChecked /> Gift wrap
          </label>
          <label className="flex items-center gap-2">
            <Switch defaultChecked /> Notify me
          </label>
        </div>
      </div>
    );
  }

  if (section === 'data') {
    return (
      <div className="flex flex-col gap-10">
        <DataTable
          rows={orders}
          getRowKey={(o) => o.id}
          selectable
          selected={selected}
          onSelectedChange={setSelected}
          columns={[
            {
              key: 'id',
              header: 'Order',
              cell: (o) => o.id,
              sortValue: (o) => o.id,
            },
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
              cell: (o) => <Badge>{o.status}</Badge>,
            },
          ]}
        />
        <Carousel label="Sample carousel">
          {Array.from({ length: 6 }, (_, i) => (
            <Card key={i} variant="gradient" className="h-40 justify-center">
              <CardContent className="font-display text-h3">
                Slide {i + 1}
              </CardContent>
            </Card>
          ))}
        </Carousel>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Gift note</DialogTitle>
            <DialogDescription>Dialog surface sample.</DialogDescription>
          </DialogContent>
        </Dialog>
        <Tooltip content="Soft tooltip">
          <Button variant="soft">Hover me</Button>
        </Tooltip>
      </div>
      <Tabs defaultValue="her" className="max-w-xl">
        <TabsList>
          <TabsTrigger value="her">For her</TabsTrigger>
          <TabsTrigger value="him">For him</TabsTrigger>
          <TabsTrigger value="two">For two</TabsTrigger>
        </TabsList>
        <TabsContent value="her">Lavender silk, soft knits.</TabsContent>
        <TabsContent value="him">Linen shirts, leather goods.</TabsContent>
        <TabsContent value="two">Matching sets and keepsakes.</TabsContent>
      </Tabs>
    </div>
  );
}
