import { site as main } from './sites/p4cw7rctk4bacw4gvsz4qer46afg';
import type { LoveSiteConfig } from './types';

const sites: Record<string, LoveSiteConfig> = { [main.slug]: main };

export function getLoveSite(slug: string): LoveSiteConfig | undefined {
  return Object.hasOwn(sites, slug) ? sites[slug] : undefined;
}

export type { LoveSiteConfig, PhotoRef } from './types';
