// next/image presets (Phase-1-UX-Spec §8). Every quality must be listed in next.config.ts `images.qualities`.
export const imageSizes = {
  card: '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw',
  categoryCard: '(min-width: 1024px) 14vw, (min-width: 640px) 25vw, 50vw',
  gallery: '(min-width: 1024px) 50vw, 100vw',
  hero: '100vw',
  portfolioCover: '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  videoPoster: '(min-width: 1024px) 50vw, 100vw',
  cartThumb: '96px',
} as const;

export const imageQuality = {
  default: 75,
  hero: 85,
} as const;
