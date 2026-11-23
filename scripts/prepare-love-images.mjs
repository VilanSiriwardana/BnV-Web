// Prepares Love Site images. Uses sharp from Next's dependency tree (ADR-0027 notes; pin it if this import ever fails).
// Usage: node scripts/prepare-love-images.mjs [sourceDir]  → writes public/images/prototype/love-*.webp and prints a JSON of sizes + blur.
// With sourceDir (e.g. private/love-photos, git-ignored), files are picked by prefix memory-*, timeline-*, gallery-*, portrait-* (jpg/jpeg/png/webp), sorted by name.
import { readdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.join(process.cwd(), 'public', 'images', 'prototype');
const sourceDir = process.argv[2] ? path.resolve(process.argv[2]) : null;

// Prototype placeholders (AI-generated), used when no sourceDir is given.
const prototypeSources = {
  memory: [
    'product-couple-outfit-01',
    'product-couple-outfit-02',
    'product-couple-outfit-03',
    'product-couple-outfit-04',
    'product-jewelry-01',
    'product-gift-box-01',
    'product-couple-outfit-05',
    'product-jewelry-02',
  ],
  timeline: [
    'product-couple-outfit-06',
    'product-gift-box-02',
    'product-couple-outfit-07',
    'product-jewelry-03',
    'product-couple-outfit-08',
  ],
  gallery: [
    'banner-couples-dark-mobile',
    'product-couple-outfit-09',
    'product-jewelry-04',
    'banner-couple-capsule-dark-mobile',
    'product-gift-box-03',
    'product-couple-outfit-10',
    'product-jewelry-05',
    'product-gift-box-04',
    'banner-couples-light-mobile',
    'product-jewelry-06',
    'product-gift-box-05',
    'banner-couple-capsule-light-mobile',
  ],
  // Gallery walk end frame (Phase 12). Prototype until the real portrait is supplied.
  portrait: ['banner-couples-dark-mobile'],
};

const imageExt = /\.(jpe?g|png|webp)$/i;
const sources = sourceDir
  ? Object.fromEntries(
      ['memory', 'timeline', 'gallery', 'portrait'].map((kind) => [
        kind,
        readdirSync(sourceDir)
          .filter((f) => f.startsWith(`${kind}-`) && imageExt.test(f))
          .sort(),
      ]),
    )
  : prototypeSources;

const widths = { memory: 1600, timeline: 1200, gallery: 1200, portrait: 1600 };
const result = {};

async function blurOf(input) {
  const buf = await sharp(input)
    .resize({ width: 16 })
    .webp({ quality: 40 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

for (const [kind, list] of Object.entries(sources)) {
  for (const [i, name] of list.entries()) {
    const nn = String(i + 1).padStart(2, '0');
    const input = sourceDir
      ? path.join(sourceDir, name)
      : path.join(dir, `${name}.webp`);
    const file = `love-${kind}-${nn}.webp`;
    const info = await sharp(input)
      .resize({ width: widths[kind], withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(dir, file));
    result[file] = {
      width: info.width,
      height: info.height,
      blur: await blurOf(input),
    };
    if (kind === 'memory') {
      await sharp(input)
        .resize(512, 512, { fit: 'cover', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(dir, `love-${kind}-${nn}-orb.webp`));
    }
    // 1024 px variant for the gallery walk on mid and low tiers.
    if (kind === 'gallery' || kind === 'portrait') {
      await sharp(input)
        .resize({ width: 1024, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(dir, `love-${kind}-${nn}-1024.webp`));
    }
  }
}

console.log(JSON.stringify(result, null, 2));
