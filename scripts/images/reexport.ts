// Re-exports placeholder images from the originals in ../BnV Docs/Images using
// docs/references/assets/image-mapping.csv. Never upscales products beyond the source crop.
// Run: npx tsx scripts/images/reexport.ts
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import sharp from 'sharp';

const ROOT = process.cwd();
const SOURCE_DIR = path.resolve(ROOT, '../BnV Docs/Images');
const CSV = path.join(ROOT, 'docs/references/assets/image-mapping.csv');

type Target = {
  width: number;
  height: number;
  quality: number;
  upscale: boolean;
};

function targetFor(newPath: string): Target {
  if (newPath.includes('-desktop.'))
    return { width: 1920, height: 650, quality: 85, upscale: true };
  if (newPath.includes('-mobile.'))
    return { width: 1080, height: 1080, quality: 85, upscale: true };
  return { width: 1200, height: 1500, quality: 82, upscale: false };
}

function parseCsv(text: string) {
  return text
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) =>
      [...line.matchAll(/"([^"]*)"|([^,]+)/g)].map((m) => m[1] ?? m[2]),
    );
}

async function main() {
  const rows = parseCsv(readFileSync(CSV, 'utf8')).filter(
    (r) => r[2] === 'exported',
  );
  let before = 0;
  let after = 0;
  let capped = 0;

  for (const [oldPath, newPath] of rows) {
    const src = path.join(SOURCE_DIR, oldPath);
    const dest = path.join(ROOT, newPath);
    if (!existsSync(src)) {
      console.warn(`missing source: ${oldPath}`);
      continue;
    }

    const target = targetFor(newPath);
    const meta = await sharp(src).metadata();
    const aspect = target.width / target.height;
    const cropWidth = Math.min(meta.width!, Math.round(meta.height! * aspect));
    let { width, height } = target;
    if (!target.upscale && cropWidth < width) {
      width = cropWidth;
      height = Math.round(cropWidth / aspect);
      capped++;
    }

    before += existsSync(dest) ? statSync(dest).size : 0;
    await sharp(src)
      .resize(width, height, {
        fit: 'cover',
        position: sharp.strategy.attention,
      })
      .webp({ quality: target.quality, effort: 6 })
      .toFile(dest);
    after += statSync(dest).size;
  }

  const mb = (n: number) => (n / 1024 / 1024).toFixed(1);
  console.log(
    `${rows.length} files: ${mb(before)} MB -> ${mb(after)} MB; ${capped} products capped below 1200px`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
