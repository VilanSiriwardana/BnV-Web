import { mulberry32 } from './heart-geometry';

const GRID = 2;
const ALPHA_MIN = 128;
const Z_JITTER = 0.06;
const REUSE_OFFSET = 0.012;

// Romance Additions F1. Pure: RGBA pixels of drawn text → `count` points (xyz), centred, the text
// width mapped to `worldWidth`. Deterministic for a seed; short samples are reused with an offset.
export function textToPoints(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  count: number,
  worldWidth: number,
  seed: number,
): Float32Array {
  const out = new Float32Array(count * 3);
  const xs: number[] = [];
  const ys: number[] = [];
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let y = 0; y < height; y += GRID) {
    for (let x = 0; x < width; x += GRID) {
      if (pixels[(y * width + x) * 4 + 3] <= ALPHA_MIN) continue;
      xs.push(x);
      ys.push(y);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (xs.length === 0) return out;
  const rand = mulberry32(seed);
  const unit = worldWidth / Math.max(1, maxX - minX);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  // Seeded shuffle of the first `count` samples (partial Fisher–Yates).
  const order = Array.from({ length: xs.length }, (_, i) => i);
  const picks = Math.min(count, order.length);
  for (let i = 0; i < picks; i++) {
    const j = i + Math.floor(rand() * (order.length - i));
    [order[i], order[j]] = [order[j], order[i]];
  }
  for (let i = 0; i < count; i++) {
    const k = order[i % picks];
    const reuse = i >= picks;
    const o = i * 3;
    out[o] =
      (xs[k] - cx) * unit + (reuse ? (rand() - 0.5) * REUSE_OFFSET * 2 : 0);
    out[o + 1] =
      (cy - ys[k]) * unit + (reuse ? (rand() - 0.5) * REUSE_OFFSET * 2 : 0);
    out[o + 2] = (rand() - 0.5) * Z_JITTER;
  }
  return out;
}

// Browser-only: draws `text` in Cinzel on an offscreen canvas and samples it.
export function sampleText(
  text: string,
  count: number,
  worldWidth: number,
  seed: number,
  weight = 600,
): Float32Array {
  const W = 1024;
  const H = 256;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return new Float32Array(count * 3);
  const family = displayFamily();
  let size = 150;
  const font = () => `${weight} ${size}px ${family}`;
  ctx.font = font();
  // Long names shrink to fit.
  while (size > 40 && ctx.measureText(text).width > W * 0.92) {
    size -= 6;
    ctx.font = font();
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(text, W / 2, H / 2);
  const { data } = ctx.getImageData(0, 0, W, H);
  return textToPoints(data, W, H, count, worldWidth, seed);
}

// The resolved Cinzel stack (next/font hashes the family name), with the Sinhala fallback.
export function displayFamily() {
  const root = document.querySelector<HTMLElement>('[data-love-root]');
  return (
    (root &&
      getComputedStyle(root).getPropertyValue('--font-display').trim()) ||
    'Georgia, serif'
  );
}
