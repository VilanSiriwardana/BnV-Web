import { siteConfig } from '@/config/seo';

export const absoluteUrl = (path: string) =>
  new URL(path, siteConfig.siteUrl).toString();
