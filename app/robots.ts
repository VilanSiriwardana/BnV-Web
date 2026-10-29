import type { MetadataRoute } from 'next';

import { routes } from '@/config/routes';
import { absoluteUrl } from '@/lib/seo/canonical';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        routes.admin.dashboard,
        routes.cart,
        routes.checkout,
        routes.styleGuide,
      ],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
