export const focusRing = 'focus-ring';

export const interactive =
  'transition-[box-shadow,transform,border-color] duration-250 ease-standard hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-glow motion-reduce:hover:translate-y-0';

export const fieldTrigger =
  'border-input dark:bg-muted flex h-11 w-full min-w-0 cursor-pointer items-center gap-2 rounded-sm border bg-transparent px-3 py-1 text-left font-sans text-base shadow-sm transition-[color,border-color,box-shadow] duration-150 ease-standard outline-none hover:border-primary hover:bg-primary-soft/40 focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] data-[state=open]:border-primary data-[state=open]:shadow-glow aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground';

export const popoverSurface =
  'glass text-popover-foreground z-50 origin-(--radix-popover-content-transform-origin) rounded-md duration-150 border shadow-glow outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2';

export const optionRow =
  'spotlight relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm transition-colors duration-150 data-[selected=true]:bg-primary-soft/60 data-[selected=true]:text-primary-text data-[checked=true]:font-semibold before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-linear-to-b before:from-primary-text before:to-gold before:scale-y-0 before:transition-transform before:duration-250 before:ease-standard data-[selected=true]:before:scale-y-60 data-[checked=true]:before:scale-y-100 animate-in fade-in-0 slide-in-from-top-1 fill-mode-both';

// Sidebar and drawer links: an accent bar grows in on hover and stays on the current page.
export const navItem =
  'relative isolate flex items-center gap-2 rounded-md px-3 py-2 font-medium transition-colors duration-150 ease-standard hover:text-primary-text before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-linear-to-b before:from-primary-text before:to-gold before:scale-y-0 before:transition-transform before:duration-250 before:ease-standard hover:before:scale-y-100 focus-visible:before:scale-y-100 aria-[current=page]:text-primary-text aria-[current=page]:before:scale-y-100 focus-ring';
