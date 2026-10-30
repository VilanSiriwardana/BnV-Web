'use client';

import * as React from 'react';
import Image from 'next/image';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { XIcon } from 'lucide-react';

import { Carousel } from '@/components/ui/carousel';
import { focusRing } from '@/components/ui/styles';
import { imageQuality } from '@/config/images';
import { cn } from '@/lib/utils/cn';

export type LightboxImage = { src: string; alt: string };

export function Lightbox({
  images,
  open,
  onOpenChange,
  startIndex = 0,
  label = 'Image viewer',
}: {
  images: LightboxImage[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startIndex?: number;
  label?: string;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="bg-scrim/80 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 z-50 backdrop-blur-md" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed inset-0 z-50 flex flex-col justify-center px-4 py-12 md:px-16"
        >
          <DialogPrimitive.Title className="sr-only">
            {label}
          </DialogPrimitive.Title>
          <Carousel
            label={label}
            startIndex={startIndex}
            slideClassName="basis-full"
            className="text-chrome-foreground mx-auto w-full max-w-5xl"
            thumbnails={images.map((img) => (
              <Image
                key={img.src}
                src={img.src}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            ))}
          >
            {images.map((img) => (
              <div
                key={img.src}
                className="relative h-[70svh] overflow-hidden rounded-lg"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="100vw"
                  quality={imageQuality.hero}
                  className="object-contain"
                />
              </div>
            ))}
          </Carousel>
          <DialogPrimitive.Close
            className={cn(
              'glass text-foreground hover:shadow-glow absolute top-4 right-4 grid size-10 cursor-pointer place-items-center rounded-full border transition-shadow',
              focusRing,
            )}
          >
            <XIcon className="size-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
