import { Color } from 'three';

const ROLES = [
  'primary',
  'primary-hover',
  'gold',
  'secondary',
  'background',
  'surface',
  'foreground',
] as const;
export type TokenRole = (typeof ROLES)[number];
export type TokenColors = Record<TokenRole, { night: Color }>;

// Accepts #rgb / #rrggbb and rgb()/rgba(). Returns null for anything else (e.g. color-mix()).
export function parseCssColor(value: string): [number, number, number] | null {
  const v = value.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(v);
  if (hex) {
    const h =
      hex[1].length === 3
        ? hex[1]
            .split('')
            .map((c) => c + c)
            .join('')
        : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [
      number,
      number,
      number,
    ];
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(v);
  if (rgb) {
    return [rgb[1], rgb[2], rgb[3]].map((n) => Number(n) / 255) as [
      number,
      number,
      number,
    ];
  }
  return null;
}

function toColor(value: string) {
  const rgb = parseCssColor(value);
  // sRGB token values → three's linear working space.
  return rgb ? new Color().setRGB(rgb[0], rgb[1], rgb[2], 'srgb') : new Color();
}

// Reads the night alias tokens once (Tech Stack §5.8); the derived roles are color-mix() strings.
export function readTokenColors(root: HTMLElement): TokenColors {
  const style = getComputedStyle(root);
  return Object.fromEntries(
    ROLES.map((role) => [
      role,
      {
        night: toColor(style.getPropertyValue(`--night-${role}`)),
      },
    ]),
  ) as TokenColors;
}
