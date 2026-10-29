import type { PrismaClient } from '@prisma/client';
import { SITE_SETTINGS } from '../data/site-settings';

export async function seedSiteSettings(prisma: PrismaClient) {
  for (const setting of SITE_SETTINGS) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log(`site settings: ${SITE_SETTINGS.length}`);
}
