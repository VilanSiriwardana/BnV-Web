export const focusRing = 'focus-ring';

export const interactive =
  'transition-[box-shadow,transform,border-color] duration-250 ease-standard hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-glow motion-reduce:hover:translate-y-0';

export const fieldTrigger =
  'border-input dark:bg-muted flex h-11 w-full min-w-0 cursor-pointer items-center gap-2 rounded-sm border bg-transparent px-3 py-1 text-left font-sans text-base shadow-sm transition-[color,border-color,box-shadow] duration-150 outline-none hover:border-primary focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] data-[state=open]:border-primary data-[state=open]:shadow-glow aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground md:text-sm';

export const popoverSurface =
  'glass text-popover-foreground z-50 rounded-md border shadow-glow outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2';

export const optionRow =
  'spotlight relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm transition-colors duration-150 data-[selected=true]:text-primary-text data-[checked=true]:font-semibold before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-primary-text before:opacity-0 before:transition-opacity data-[checked=true]:before:opacity-100 animate-in fade-in-0 slide-in-from-top-1 fill-mode-both';
