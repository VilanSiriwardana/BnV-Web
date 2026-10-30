'use client';

import * as React from 'react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils/cn';

function DrawerContent({
  className,
  ...props
}: React.ComponentProps<typeof SheetContent>) {
  return <SheetContent className={cn('glass', className)} {...props} />;
}

export {
  Sheet as Drawer,
  SheetTrigger as DrawerTrigger,
  SheetClose as DrawerClose,
  DrawerContent,
  SheetHeader as DrawerHeader,
  SheetFooter as DrawerFooter,
  SheetTitle as DrawerTitle,
  SheetDescription as DrawerDescription,
};
