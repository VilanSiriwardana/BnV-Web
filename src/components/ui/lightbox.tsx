'use client';

import * as React from 'react';
import Image from 'next/image';
import { Dialog as DialogPrimitive } from 'radix-ui';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  animate,
} from 'framer-motion';
import { RotateCcwIcon, XIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';

import { Carousel } from '@/components/ui/carousel';
import { focusRing } from '@/components/ui/styles';
import { imageQuality } from '@/config/images';
import { cn } from '@/lib/utils/cn';

export type LightboxImage = { src: string; alt: string };

const MIN = 1;
const MAX = 4;
const STEP = 0.5;
const clamp = (s: number) => Math.min(MAX, Math.max(MIN, s));

const control = cn(
  'glass text-foreground hover:shadow-glow grid size-10 cursor-pointer place-items-center rounded-full border transition-shadow disabled:cursor-not-allowed disabled:opacity-40',
  focusRing,
);

// Scales and pans one image: buttons, wheel, pinch, double-click, and drag while zoomed.
function ZoomStage({
  image,
  scale,
  setScale,
}: {
  image: LightboxImage;
  scale: number;
  setScale: (s: number | ((s: number) => number)) => void;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reduce = useReducedMotion();
  const pointers = React.useRef(new Map<number, { x: number; y: number }>());
  const pinch = React.useRef<{ dist: number; scale: number } | null>(null);
  const [bounds, setBounds] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const rect = box.current?.getBoundingClientRect();
    const next = rect
      ? {
          x: (rect.width * (scale - 1)) / 2,
          y: (rect.height * (scale - 1)) / 2,
        }
      : { x: 0, y: 0 };
    setBounds(next);
    const opts = reduce ? { duration: 0 } : { duration: 0.2 };
    animate(x, Math.max(-next.x, Math.min(next.x, x.get())), opts);
    animate(y, Math.max(-next.y, Math.min(next.y, y.get())), opts);
  }, [scale, reduce, x, y]);

  const distance = () => {
    const [a, b] = [...pointers.current.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  return (
    <div
      ref={box}
      className="relative h-[70svh] touch-none overflow-hidden rounded-lg"
      onWheel={(e) => setScale((s) => clamp(s + (e.deltaY < 0 ? 0.25 : -0.25)))}
      onDoubleClick={() => setScale((s) => (s > 1 ? 1 : 2.5))}
      onPointerDown={(e) => {
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.current.size === 2) {
          pinch.current = { dist: distance(), scale };
        }
        if (scale > 1 || pointers.current.size > 1) e.stopPropagation();
      }}
      onPointerMove={(e) => {
        if (!pointers.current.has(e.pointerId)) return;
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pinch.current && pointers.current.size === 2) {
          setScale(
            clamp((pinch.current.scale * distance()) / pinch.current.dist),
          );
        }
      }}
      onPointerUp={(e) => {
        pointers.current.delete(e.pointerId);
        if (pointers.current.size < 2) pinch.current = null;
      }}
      onPointerCancel={(e) => {
        pointers.current.delete(e.pointerId);
        pinch.current = null;
      }}
    >
      <motion.div
        className={cn(
          'absolute inset-0',
          scale > 1 && 'cursor-grab active:cursor-grabbing',
        )}
        style={{ x, y }}
        animate={{ scale }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: 'spring', stiffness: 400, damping: 40 }
        }
        drag={scale > 1}
        dragConstraints={{
          left: -bounds.x,
          right: bounds.x,
          top: -bounds.y,
          bottom: bounds.y,
        }}
        dragElastic={0.05}
        dragMomentum={false}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          quality={imageQuality.hero}
          draggable={false}
          className="object-contain select-none"
        />
      </motion.div>
    </div>
  );
}

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
  const [index, setIndex] = React.useState(startIndex);
  const [scale, setScaleState] = React.useState(1);
  const setScale = React.useCallback(
    (s: number | ((s: number) => number)) =>
      setScaleState((prev) => clamp(typeof s === 'function' ? s(prev) : s)),
    [],
  );

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) setScale(1);
        onOpenChange(next);
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="bg-scrim/80 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 z-50 backdrop-blur-md" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed inset-0 z-50 flex flex-col justify-center px-4 py-12 md:px-16"
          onKeyDown={(e) => {
            if (e.key === '+' || e.key === '=') setScale((s) => s + STEP);
            if (e.key === '-') setScale((s) => s - STEP);
            if (e.key === '0') setScale(1);
          }}
        >
          <DialogPrimitive.Title className="sr-only">
            {label}
          </DialogPrimitive.Title>
          <Carousel
            label={label}
            startIndex={startIndex}
            slideClassName="basis-full"
            className="text-chrome-foreground mx-auto w-full max-w-5xl"
            draggable={scale === 1}
            onIndexChange={(i) => {
              setIndex(i);
              setScale(1);
            }}
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
            {images.map((img, i) =>
              i === index ? (
                <ZoomStage
                  key={img.src}
                  image={img}
                  scale={scale}
                  setScale={setScale}
                />
              ) : (
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
              ),
            )}
          </Carousel>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              type="button"
              aria-label="Zoom out"
              disabled={scale <= MIN}
              onClick={() => setScale((s) => s - STEP)}
              className={control}
            >
              <ZoomOutIcon className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              disabled={scale >= MAX}
              onClick={() => setScale((s) => s + STEP)}
              className={control}
            >
              <ZoomInIcon className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Reset zoom"
              disabled={scale === 1}
              onClick={() => setScale(1)}
              className={control}
            >
              <RotateCcwIcon className="size-5" />
            </button>
            <DialogPrimitive.Close className={control}>
              <XIcon className="size-5" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
          <p aria-live="polite" className="sr-only">
            Zoom {Math.round(scale * 100)}%
          </p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
