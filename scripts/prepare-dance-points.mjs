// Blueprint 088: traces the couple's silhouettes out of the Dance reference stills and samples them
// into particles that the page morphs between. Only the models are kept; the backdrop never ships.
// Usage: node scripts/prepare-dance-points.mjs [sourceDir] [--debug dir]
//   sourceDir defaults to private/dance-keyframes (git-ignored): k*.jpg, sorted, one pose each, plus an
//   optional k*-mask.png (white = model) that overrides the automatic cut-out for that pose.
// → public/dance-reel/points.bin + src/features/love/canvas/dance-manifest.json
import { mkdirSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const debugAt = args.indexOf('--debug');
const debugDir = debugAt >= 0 ? path.resolve(args[debugAt + 1]) : null;
const sourceDir = path.resolve(
  args.find((a, i) => !a.startsWith('--') && i !== debugAt + 1) ??
    'private/dance-keyframes',
);

export const COUNT = 20000;
const HEIGHT = 640; // working resolution
const EDGE_SHARE = 0.3;
const FIGURE = 2; // head-to-floor height in scene units
export const X_RANGE = 1.2; // x ∈ [−1.2, 1.2]
export const Y_RANGE = 2.2; // y ∈ [0, 2.2]
const CHUNK = 200;

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lum = (d, i) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];

// Connected components of `mask` (4-neighbour); keeps the ones not touching the top or sides and
// larger than `minArea`, then fills their holes.
function clean(mask, w, h, minArea) {
  const label = new Int32Array(w * h).fill(-1);
  const keep = new Uint8Array(w * h);
  const stack = [];
  for (let s = 0; s < w * h; s++) {
    if (!mask[s] || label[s] >= 0) continue;
    const pixels = [];
    let border = false;
    stack.push(s);
    label[s] = s;
    while (stack.length) {
      const p = stack.pop();
      pixels.push(p);
      const x = p % w;
      const y = (p / w) | 0;
      if (x === 0 || y === 0 || x === w - 1) border = true;
      for (const q of [p - 1, p + 1, p - w, p + w]) {
        if (q < 0 || q >= w * h) continue;
        if (Math.abs((q % w) - x) > 1) continue;
        if (mask[q] && label[q] < 0) {
          label[q] = s;
          stack.push(q);
        }
      }
    }
    if (!border && pixels.length >= minArea)
      for (const p of pixels) keep[p] = 1;
  }
  // Hole fill: flood the outside from the border; anything unreached is inside.
  const outside = new Uint8Array(w * h);
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const p = stack.pop();
    if (outside[p] || keep[p]) continue;
    outside[p] = 1;
    const x = p % w;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (p >= w) stack.push(p - w);
    if (p < w * (h - 1)) stack.push(p + w);
  }
  for (let p = 0; p < w * h; p++) keep[p] = outside[p] ? 0 : 1;
  return keep;
}

// One open + close pass (3×3) to smooth the outline.
function morph(mask, w, h, grow) {
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let any = 0;
      let all = 1;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const v =
            mask[
              Math.min(h - 1, Math.max(0, y + dy)) * w +
                Math.min(w - 1, Math.max(0, x + dx))
            ];
          any |= v;
          all &= v;
        }
      out[y * w + x] = grow ? any : all;
    }
  return out;
}

async function silhouette(file) {
  const input = path.join(sourceDir, file);
  const { data, info } = await sharp(input)
    .resize({ height: HEIGHT })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const maskFile = path.join(sourceDir, file.replace(/\.\w+$/, '-mask.png'));
  let mask = new Uint8Array(w * h);
  if (existsSync(maskFile)) {
    const m = await sharp(maskFile).resize(w, h).greyscale().raw().toBuffer();
    for (let p = 0; p < w * h; p++) mask[p] = m[p] > 127 ? 1 : 0;
  } else {
    // The backdrop darkens to the sides and glows near the floor, so it is measured per row from
    // the side margins (smoothed over neighbouring rows) on a slightly blurred copy.
    const soft = await sharp(input)
      .resize({ height: HEIGHT })
      .removeAlpha()
      .blur(1.2)
      .raw()
      .toBuffer();
    const margin = Math.round(w * 0.03);
    const rowBg = [];
    for (let y = 0; y < h; y++) {
      const s = [0, 0, 0];
      let n = 0;
      for (let yy = Math.max(0, y - 6); yy <= Math.min(h - 1, y + 6); yy++)
        for (const x0 of [0, w - margin])
          for (let x = x0; x < x0 + margin; x++) {
            const i = (yy * w + x) * 3;
            for (let c = 0; c < 3; c++) s[c] += soft[i + c];
            n++;
          }
      rowBg.push(s.map((v) => v / n));
    }
    for (let p = 0; p < w * h; p++) {
      const i = p * 3;
      const bg = rowBg[(p / w) | 0];
      const dist = Math.hypot(
        soft[i] - bg[0],
        soft[i + 1] - bg[1],
        soft[i + 2] - bg[2],
      );
      const bgLum = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2];
      const l = lum(soft, i);
      // Floor shadows are darker than the backdrop; feet are not (shoes shine, skin and gown are lit).
      const shadow = ((p / w) | 0) > h * 0.9 && l < bgLum + 2;
      mask[p] = !shadow && (dist > 13 || l > bgLum + 9) ? 1 : 0;
    }
    mask = morph(morph(mask, w, h, false), w, h, true);
    // Close gaps (dark curls, suit folds) by growing then shrinking the outline by 3 px.
    for (let i = 0; i < 3; i++) mask = morph(mask, w, h, true);
    for (let i = 0; i < 3; i++) mask = morph(mask, w, h, false);
  }
  mask = clean(mask, w, h, w * h * 0.004);
  return { data, mask, w, h };
}

// Particles for one pose: positions (scene units), colours, flags (bit 0 outline, bit 1 him).
function sample({ data, mask, w, h }, rand) {
  let floor = 0;
  let cx = 0;
  let area = 0;
  for (let p = 0; p < w * h; p++)
    if (mask[p]) {
      floor = Math.max(floor, (p / w) | 0);
      cx += p % w;
      area++;
    }
  cx /= area;
  // Head top: first row wide enough to be a head, so raised hands don't shrink the figure.
  let top = 0;
  for (let y = 0; y < h; y++) {
    let n = 0;
    for (let x = 0; x < w; x++) n += mask[y * w + x];
    if (n > w * 0.06) {
      top = y;
      break;
    }
  }
  const scale = FIGURE / Math.max(1, floor - top);

  const edge = [];
  const inside = [];
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      if (!mask[p]) continue;
      if (!mask[p - 1] || !mask[p + 1] || !mask[p - w] || !mask[p + w])
        edge.push(p);
      else inside.push(p);
    }
  // Detail weight: brightness gradient, so faces, hair and folds get more points.
  const weight = inside.map((p) => {
    const i = p * 3;
    const g =
      Math.abs(lum(data, i + 3) - lum(data, i - 3)) +
      Math.abs(lum(data, i + w * 3) - lum(data, i - w * 3));
    return 1 + Math.min(g, 60) / 12;
  });
  const cumulative = new Float64Array(weight.length);
  weight.reduce((s, v, i) => (cumulative[i] = s + v), 0);
  const total = cumulative[cumulative.length - 1];
  const pick = () => {
    const r = rand() * total;
    let lo = 0;
    let hi = cumulative.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cumulative[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    return inside[lo];
  };

  const points = [];
  for (let n = 0; n < COUNT; n++) {
    const onEdge = n < COUNT * EDGE_SHARE;
    const p = onEdge ? edge[(rand() * edge.length) | 0] : pick();
    const px = (p % w) + rand() - 0.5;
    const py = ((p / w) | 0) + rand() - 0.5;
    const i = p * 3;
    points.push({
      x: (px - cx) * scale,
      y: (floor - py) * scale,
      rgb: [data[i], data[i + 1], data[i + 2]],
      flags: (onEdge ? 1 : 0) | (px > cx ? 2 : 0),
    });
  }
  // Pairing order: by height, then left to right in equal-count bands, so index i sits at the same
  // place in the figure in every pose and only travels locally between poses.
  points.sort((a, b) => b.y - a.y);
  const ordered = [];
  for (let c = 0; c < COUNT; c += CHUNK)
    ordered.push(...points.slice(c, c + CHUNK).sort((a, b) => a.x - b.x));
  return { points: ordered, coverage: area / (w * h) };
}

const files = readdirSync(sourceDir)
  .filter((f) => /^k.*\.(jpe?g|png)$/i.test(f) && !/-mask\./.test(f))
  .sort();
const poses = [];
for (const file of files) {
  const shape = await silhouette(file);
  const { points, coverage } = sample(shape, mulberry32(11 + poses.length));
  poses.push({ file, points, coverage });
  if (debugDir) {
    mkdirSync(debugDir, { recursive: true });
    const img = Buffer.alloc(shape.w * shape.h * 3);
    for (let p = 0; p < shape.w * shape.h; p++)
      for (let c = 0; c < 3; c++)
        img[p * 3 + c] = shape.mask[p]
          ? shape.data[p * 3 + c]
          : 255 * (c === 1 ? 0.6 : 0.2);
    await sharp(img, { raw: { width: shape.w, height: shape.h, channels: 3 } })
      .png()
      .toFile(path.join(debugDir, file.replace(/\.\w+$/, '-cut.png')));
  }
}

// One shared shuffle so any draw-range prefix covers the whole couple in every pose.
const order = Array.from({ length: COUNT }, (_, i) => i);
const shuffle = mulberry32(5);
for (let i = COUNT - 1; i > 0; i--) {
  const j = (shuffle() * (i + 1)) | 0;
  [order[i], order[j]] = [order[j], order[i]];
}

// Per pose: Uint16 x,y (COUNT·4 bytes) then Uint8 r,g,b,flags (COUNT·4 bytes).
const bytes = new Uint8Array(poses.length * COUNT * 8);
poses.forEach(({ points }, k) => {
  const xy = new Uint16Array(bytes.buffer, k * COUNT * 8, COUNT * 2);
  const rgbf = new Uint8Array(
    bytes.buffer,
    k * COUNT * 8 + COUNT * 4,
    COUNT * 4,
  );
  order.forEach((src, i) => {
    const pt = points[src];
    const q = (v, range, lo) =>
      Math.round(Math.min(1, Math.max(0, (v - lo) / range)) * 65535);
    xy[i * 2] = q(pt.x, X_RANGE * 2, -X_RANGE);
    xy[i * 2 + 1] = q(pt.y, Y_RANGE, 0);
    rgbf.set([...pt.rgb, pt.flags], i * 4);
  });
});

const outDir = path.join(process.cwd(), 'public', 'dance-reel');
mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, 'points.bin'), bytes);
const beatOf = (f) =>
  /hold/.test(f)
    ? 'hold'
    : /twirl/.test(f)
      ? 'twirl'
      : /dip/.test(f)
        ? 'dip'
        : undefined;
const manifest = {
  count: COUNT,
  xRange: X_RANGE,
  yRange: Y_RANGE,
  poses: poses.map(({ file }) => ({
    name: file.replace(/\.\w+$/, ''),
    ...(beatOf(file) && { beat: beatOf(file) }),
  })),
};
writeFileSync(
  path.join(
    process.cwd(),
    'src',
    'features',
    'love',
    'canvas',
    'dance-manifest.json',
  ),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    {
      'points.bin': bytes.length,
      coverage: Object.fromEntries(
        poses.map((p) => [p.file, `${(p.coverage * 100).toFixed(1)}%`]),
      ),
    },
    null,
    2,
  ),
);
