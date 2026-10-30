'use client';

import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';

import { focusRing } from '@/components/ui/styles';
import { cn } from '@/lib/utils/cn';

const Tabs = TabsPrimitive.Root;

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'bg-primary-soft inline-flex items-center gap-1 rounded-md p-1 font-sans',
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-primary-text inline-flex min-h-9 items-center rounded-sm px-4 text-sm font-semibold transition-[color,background-color,box-shadow] duration-150 data-[state=active]:shadow-sm',
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'data-[state=active]:animate-in data-[state=active]:fade-in-0 mt-4 duration-250 outline-none',
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
