// Prepares the Dance Reel frames (blueprints 080, 081) from the source clip. Uses system ffmpeg (dev-time only)
// and sharp from Next's dependency tree.
// Usage: node scripts/prepare-dance-video.mjs [src] [--matte] [--preview]  (default public/dance-reel/dance-vid.mp4)
// → public/dance-reel/{desktop,mobile}/0001.webp…, posters/reel-start.webp, posters/reel-dip.webp and
// src/features/love/canvas/dance-reel-manifest.json. Audio is dropped. Set FFMPEG / PYTHON to override binaries.
// Default: the clip's backdrop is remapped to the page colour (opaque). --matte: alpha frames from
// scripts/matte-dance-video.py (Robust Video Matting in private/matte-venv). --preview (with --matte): writes
// three composites over the page colour to private/dance-matte-preview/ and leaves public/ untouched.
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

import { backgroundOf, levels, PAGE } from './lib/dance-levels.mjs';

const root = process.cwd();
const args = process.argv.slice(2);
const matte = args.includes('--matte');
const preview = matte && args.includes('--preview');
const src = path.resolve(
  args.find((a) => !a.startsWith('--')) ??
    path.join('public', 'dance-reel', 'dance-vid.mp4'),
);
const tmpDir = path.join(root, 'private', 'dance-video-frames');
const alphaDir = path.join(root, 'private', 'dance-video-alpha');
const previewDir = path.join(root, 'private', 'dance-matte-preview');
const outDir = path.join(root, 'public', 'dance-reel');
const manifestFile = path.join(
  root,
  'src',
  'features',
  'love',
  'canvas',
  'dance-reel-manifest.json',
);

const FPS = 24;
const DIP = 0.85;
const QUALITY = 74;
const ALPHA_QUALITY = 50;
const SETS = { desktop: 720, mobile: 480 };
const PREVIEW = { hold: 0.25, spin: 0.55, dip: DIP };

// FFMPEG env → winget package install (PATH is stale until the shell restarts) → PATH.
function findFfmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  const packages = path.join(
    process.env.LOCALAPPDATA ?? '',
    'Microsoft',
    'WinGet',
    'Packages',
  );
  if (existsSync(packages)) {
    for (const pkg of readdirSync(packages)) {
      if (!pkg.startsWith('Gyan.FFmpeg')) continue;
      for (const build of readdirSync(path.join(packages, pkg))) {
        const exe = path.join(packages, pkg, build, 'bin', 'ffmpeg.exe');
        if (existsSync(exe)) return exe;
      }
    }
  }
  return 'ffmpeg';
}

const pad = (i) => String(i).padStart(4, '0');
const pngs = (dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith('.png'))
        .sort()
    : [];

rmSync(tmpDir, { recursive: true, force: true });
mkdirSync(tmpDir, { recursive: true });
const ffmpeg = findFfmpeg();
const run = spawnSync(
  ffmpeg,
  [
    '-v',
    'error',
    '-i',
    src,
    '-an',
    '-fps_mode',
    'passthrough',
    path.join(tmpDir, '%04d.png'),
  ],
  { stdio: 'inherit' },
);
if (run.error || run.status !== 0) {
  console.error(
    `ffmpeg failed (${ffmpeg}). Install it (winget install Gyan.FFmpeg) or set FFMPEG.`,
  );
  process.exit(1);
}

const frames = pngs(tmpDir);
const bg = await backgroundOf(path.join(tmpDir, frames[0]));

if (matte && pngs(alphaDir).length !== frames.length) {
  const python =
    process.env.PYTHON ??
    path.join(root, 'private', 'matte-venv', 'Scripts', 'python.exe');
  const matting = spawnSync(
    python,
    [path.join('scripts', 'matte-dance-video.py'), src, alphaDir],
    { stdio: 'inherit' },
  );
  if (matting.error || matting.status !== 0) {
    console.error(
      `Matting failed (${python}). Create private/matte-venv (blueprint 081) or set PYTHON.`,
    );
    process.exit(1);
  }
}

// Alpha path: remove the backdrop's share from soft edges, F = (C − (1 − a)·bg) / a.
async function matted(file) {
  const color = await sharp(path.join(tmpDir, file))
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const alpha = await sharp(path.join(alphaDir, file))
    .removeAlpha()
    .extractChannel(0)
    .resize(color.info.width, color.info.height)
    .raw()
    .toBuffer();
  const { width, height } = color.info;
  const out = Buffer.alloc(width * height * 4);
  for (let p = 0; p < width * height; p++) {
    const a = alpha[p] / 255;
    out[p * 4 + 3] = alpha[p];
    if (a <= 0.02) continue;
    for (let c = 0; c < 3; c++) {
      const f = (color.data[p * 3 + c] - (1 - a) * bg[c]) / a;
      out[p * 4 + c] = Math.max(0, Math.min(255, Math.round(f)));
    }
  }
  return sharp(out, { raw: { width, height, channels: 4 } });
}

const { a, b } = levels(bg);
const frameImage = (file) =>
  matte
    ? matted(file)
    : Promise.resolve(sharp(path.join(tmpDir, file)).linear(a, b));
const webp = (quality) =>
  matte
    ? { quality, alphaQuality: ALPHA_QUALITY, effort: 5 }
    : { quality, effort: 5 };
const frameAtShare = (p) => frames[Math.round(p * (frames.length - 1))];

if (preview) {
  rmSync(previewDir, { recursive: true, force: true });
  mkdirSync(previewDir, { recursive: true });
  const [r, g, bl] = PAGE;
  const tiles = [];
  for (const [name, p] of Object.entries(PREVIEW)) {
    const cut = await (
      await frameImage(frameAtShare(p))
    )
      .resize({ width: SETS.desktop })
      .png()
      .toBuffer({ resolveWithObject: true });
    const tile = await sharp({
      create: {
        width: cut.info.width,
        height: cut.info.height,
        channels: 3,
        background: { r, g, b: bl },
      },
    })
      .composite([{ input: cut.data }])
      .png()
      .toBuffer();
    await sharp(tile).toFile(path.join(previewDir, `${name}.png`));
    tiles.push({ input: tile, width: cut.info.width, height: cut.info.height });
  }
  await sharp({
    create: {
      width: tiles.reduce((w, t) => w + t.width, 0),
      height: Math.max(...tiles.map((t) => t.height)),
      channels: 3,
      background: { r, g, b: bl },
    },
  })
    .composite(
      tiles.map((t, i) => ({
        input: t.input,
        left: tiles.slice(0, i).reduce((w, s) => w + s.width, 0),
        top: 0,
      })),
    )
    .png()
    .toFile(path.join(previewDir, 'sheet.png'));
  console.log(`Preview written to ${previewDir}`);
  process.exit(0);
}

const manifest = { frames: frames.length, fps: FPS, dip: DIP, alpha: matte };
const bytes = {};

for (const [set, width] of Object.entries(SETS)) {
  const dir = path.join(outDir, set);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  let total = 0;
  for (const [i, file] of frames.entries()) {
    const out = path.join(dir, `${pad(i + 1)}.webp`);
    const info = await (
      await frameImage(file)
    )
      .resize({ width })
      .webp(webp(QUALITY))
      .toFile(out);
    total += info.size;
    if (i === 0) manifest[set] = { width: info.width, height: info.height };
  }
  bytes[set] = total;
}

mkdirSync(path.join(outDir, 'posters'), { recursive: true });
const posters = {
  'reel-start.webp': frames[0],
  'reel-dip.webp': frameAtShare(DIP),
};
for (const [name, file] of Object.entries(posters)) {
  const out = path.join(outDir, 'posters', name);
  await (
    await frameImage(file)
  )
    .resize({ width: SETS.desktop })
    .webp(webp(76))
    .toFile(out);
  bytes[`posters/${name}`] = statSync(out).size;
}

writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ manifest, bytes }, null, 2));
