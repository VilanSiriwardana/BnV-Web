import Link from 'next/link';

type Props = { label: string; links: { name: string; href: string }[] };

export function CategoryLinks({ label, links }: Props) {
  if (links.length === 0) return null;
  return (
    <nav aria-label={label} className="mt-6">
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="border-border text-small hover:bg-muted rounded-full border px-4 py-1.5 transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
