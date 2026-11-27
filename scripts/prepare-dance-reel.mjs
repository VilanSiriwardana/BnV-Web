// Prepares the Dance still (blueprint 079: shown in Calm, reduced motion and the low/static tiers;
// the particle couple dances everywhere else). Uses sharp from Next's dependency tree.
// Usage: node scripts/prepare-dance-reel.mjs [sourceDir]  (default private/dance-keyframes, git-ignored)
// → public/dance-reel/posters/dip.webp. The still is scaled by his head-to-floor height, set on the
// floor line, its background remapped to the page night color, and its edges feathered to alpha.
// The other reference stills (k1-standing, k2-hold, k3-twirl) guide the particle poses only.
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

import { backgroundOf, levels } from './lib/dance-levels.mjs';

const sourceDir = path.resolve(process.argv[2] ?? 'private/dance-keyframes');
const outDir = path.join(process.cwd(), 'public', 'dance-reel');

// Anchors in source pixels: his head top, the floor, the pair's centre; `size` nudges the scale.
const DIP = { file: 'k4-dip.jpg', head: 25, floor: 1226, cx: 635, size: 1 };
const SIZE = { width: 768, height: 960 };
const HIS_HEIGHT = 0.78;
const FLOOR = 0.95;

const feather = (w, h) => {
  const m = Math.round(Math.min(w, h) * 0.06);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <filter id="f"><feGaussianBlur stdDeviation="${m / 2}"/></filter>
      <rect x="${m}" y="${Math.round(m / 3)}" width="${w - 2 * m}" height="${h - m}" rx="${m}" fill="#fff" filter="url(#f)"/>
    </svg>`,
  );
};

async function frame(key, { width, height }) {
  const input = path.join(sourceDir, key.file);
  const meta = await sharp(input).metadata();
  const scale = (HIS_HEIGHT * height * key.size) / (key.floor - key.head);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  const { a, b } = levels(await backgroundOf(input));
  const scaled = await sharp(input)
    .resize(w, h)
    .linear(a, b)
    .ensureAlpha()
    .composite([{ input: feather(w, h), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Place: floor anchor on the shared floor line, pair centre on the frame centre; crop what spills over.
  const x = Math.round(width / 2 - key.cx * scale);
  const y = Math.round(FLOOR * height - key.floor * scale);
  const left = Math.max(0, -x);
  const top = Math.max(0, -y);
  const visible = await sharp(scaled)
    .extract({
      left,
      top,
      width: Math.min(w - left, width - Math.max(0, x)),
      height: Math.min(h - top, height - Math.max(0, y)),
    })
    .toBuffer();
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: visible, left: Math.max(0, x), top: Math.max(0, y) }])
    .webp({ quality: 76, alphaQuality: 80 });
}

mkdirSync(path.join(outDir, 'posters'), { recursive: true });
const file = path.join(outDir, 'posters', 'dip.webp');
const info = await (await frame(DIP, SIZE)).toFile(file);
console.log(JSON.stringify({ 'posters/dip.webp': info.size }, null, 2));
