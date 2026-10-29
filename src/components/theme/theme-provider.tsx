'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { themes } from '@/config/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      themes={[...themes]}
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
