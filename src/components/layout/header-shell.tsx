'use client';

import { useEffect, useRef, useState } from 'react';

// Sets data-scrolled once the page moves, so the header can condense with CSS.
export function HeaderShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    const update = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() =>
        setScrolled(window.scrollY > 8),
      );
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <header className={className} data-scrolled={scrolled || undefined}>
      {children}
    </header>
  );
}
