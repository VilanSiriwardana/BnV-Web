// Token names from Brand-Identity §32.1; values live in app/globals.css.
export const themes = ['light', 'dark'] as const;
export type Theme = (typeof themes)[number];

export const themeTokens = [
  'background',
  'foreground',
  'surface',
  'surface-elevated',
  'primary',
  'primary-hover',
  'primary-foreground',
  'primary-text',
  'secondary',
  'secondary-foreground',
  'gold',
  'gold-foreground',
  'gold-text',
  'accent',
  'accent-foreground',
  'border',
  'input',
  'ring',
  'muted',
  'muted-foreground',
  'destructive',
  'destructive-foreground',
  'success',
  'success-foreground',
] as const;
export type ThemeToken = (typeof themeTokens)[number];
