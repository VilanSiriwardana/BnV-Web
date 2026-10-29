import type { FeaturedType, Shoot, ShootCategory } from './types';

export * from './types';

// Real B&V shoots only (D-10, Brand-Identity §42). Empty until the first shoots are ready.
export const shoots: Shoot[] = [];

export function getShoot(slug: string) {
  return shoots.find((s) => s.slug === slug) ?? null;
}

export function filterShoots(filters: {
  featured?: FeaturedType;
  category?: ShootCategory;
}) {
  return shoots.filter(
    (s) =>
      (!filters.featured || s.featured === filters.featured) &&
      (!filters.category || s.categories.includes(filters.category)),
  );
}

export function relatedShoots(shoot: Shoot, limit = 3) {
  return shoots
    .filter(
      (s) =>
        s.slug !== shoot.slug &&
        (s.featured === shoot.featured ||
          s.categories.some((c) => shoot.categories.includes(c))),
    )
    .slice(0, limit);
}

// Local paths work today; Cloudinary IDs need the cloud name and a next.config remotePattern (deferred with uploads).
export function mediaSrc(id: string, kind: 'image' | 'video' = 'image') {
  if (id.startsWith('/')) return id;
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return cloud
    ? `https://res.cloudinary.com/${cloud}/${kind}/upload/${id}`
    : id;
}
