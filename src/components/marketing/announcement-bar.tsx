import Link from 'next/link';

type Props = {
  text: string;
  link?: { label: string; href: string };
};

export function AnnouncementBar({ text, link }: Props) {
  return (
    <div className="bg-primary text-primary-foreground">
      <p className="text-small mx-auto max-w-[1440px] px-4 py-2 text-center md:px-8">
        {text}
        {link && (
          <>
            {' '}
            <Link
              href={link.href}
              className="font-semibold underline underline-offset-4"
            >
              {link.label}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
