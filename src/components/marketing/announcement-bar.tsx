import { Heart } from 'lucide-react';
import { Fragment } from 'react';

type Props = {
  text: string;
};

export function AnnouncementBar({ text }: Props) {
  const parts = text.split('·').map((part) => part.trim());

  return (
    <div className="bg-primary/60 dark:bg-primary-soft text-foreground">
      <p className="text-caption mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center font-sans tracking-widest uppercase md:px-8">
        {parts.map((part, i) => (
          <Fragment key={part}>
            {i > 0 && (
              <Heart
                aria-hidden
                className="fill-gold text-gold hidden size-3 sm:inline-block"
              />
            )}
            <span className={i > 0 ? 'hidden sm:inline' : undefined}>
              {part}
            </span>
          </Fragment>
        ))}
      </p>
    </div>
  );
}
