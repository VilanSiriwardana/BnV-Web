export const focusRing =
  'outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export const interactive =
  'transition-[box-shadow,transform,border-color] duration-250 ease-standard hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md motion-reduce:hover:translate-y-0';

export const fieldTrigger =
  'border-input dark:bg-muted flex h-11 w-full min-w-0 items-center gap-2 rounded-sm border bg-transparent px-3 py-1 text-left font-sans text-base shadow-sm transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] aria-invalid:border-destructive disabled:pointer-events-none disabled:opacity-50 data-[placeholder]:text-muted-foreground md:text-sm';

export const popoverSurface =
  'bg-popover text-popover-foreground border-border z-50 rounded-md border shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2';
