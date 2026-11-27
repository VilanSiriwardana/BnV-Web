import gsap from 'gsap';

import manifest from '../canvas/dance-reel-manifest.json';
import { damp } from './dance-state';
import {
  frameAt,
  loadOrder,
  REEL_WINDOW,
  windowAround,
} from './dance-reel-math';

export type ReelSet = 'desktop' | 'mobile';
export type DanceReel = {
  start: () => void;
  setProgress: (p: number) => void;
  destroy: () => void;
};

const CONCURRENCY = 4;
const RATE = 8;
const MAX_DPR = 1.5;
const COUNT = manifest.frames;
const pad4 = (i: number) => String(i).padStart(4, '0');

// Blueprint 080: blobs for every frame, ImageBitmaps only inside a sliding window; one draw per frame change.
export function createDanceReel(
  canvas: HTMLCanvasElement,
  { set, onFirstFrame }: { set: ReelSet; onFirstFrame?: () => void },
): DanceReel {
  const ctx = canvas.getContext('2d');
  const radius = REEL_WINDOW[set];
  const blobs: (Blob | undefined)[] = new Array(COUNT);
  const bitmaps: (ImageBitmap | undefined)[] = new Array(COUNT);
  const decoding = new Set<number>();
  const abort = new AbortController();
  let started = false;
  let destroyed = false;
  let firstShown = false;
  let target = 0;
  let current = 0;
  let index = -1;
  let shown = -1;
  let dirty = true;

  const inWindow = (i: number) => Math.abs(i - index) <= radius;

  const syncWindow = () => {
    const { from, to } = windowAround(index, radius, COUNT);
    bitmaps.forEach((b, i) => {
      if (b && !inWindow(i)) {
        b.close();
        bitmaps[i] = undefined;
      }
    });
    for (let i = from; i <= to; i++) {
      const blob = blobs[i];
      if (!blob || bitmaps[i] || decoding.has(i)) continue;
      decoding.add(i);
      createImageBitmap(blob)
        .then((b) => {
          decoding.delete(i);
          if (destroyed || !inWindow(i)) return b.close();
          bitmaps[i] = b;
          dirty = true;
        })
        .catch(() => decoding.delete(i));
    }
  };

  const nearest = () => {
    for (let d = 0; d <= radius; d++) {
      if (bitmaps[index - d]) return index - d;
      if (bitmaps[index + d]) return index + d;
    }
    return -1;
  };

  const draw = (i: number) => {
    const b = bitmaps[i];
    if (!ctx || !b) return;
    const { width: w, height: h } = canvas;
    const s = Math.min(w / b.width, h / b.height);
    const dw = b.width * s;
    const dh = b.height * s;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(b, (w - dw) / 2, (h - dh) / 2, dw, dh);
    shown = i;
    if (!firstShown) {
      firstShown = true;
      onFirstFrame?.();
    }
  };

  const tick = (_time: number, deltaTime: number) => {
    if (!started) return;
    current = damp(current, target, deltaTime / 1000, RATE);
    if (Math.abs(current - target) < 1e-4) current = target;
    const next = frameAt(current, COUNT);
    if (next !== index) {
      index = next;
      dirty = true;
    }
    if (!dirty) return;
    dirty = false;
    syncWindow();
    const best = nearest();
    if (best >= 0 && (best !== shown || shown === -2)) draw(best);
  };

  const resize = new ResizeObserver(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    shown = -2;
    dirty = true;
  });
  resize.observe(canvas);
  gsap.ticker.add(tick);

  const fetchFrame = async (i: number) => {
    const res = await fetch(`/dance-reel/${set}/${pad4(i + 1)}.webp`, {
      signal: abort.signal,
    });
    if (!res.ok) return;
    blobs[i] = await res.blob();
    if (inWindow(i)) dirty = true;
  };

  const start = () => {
    if (started || destroyed) return;
    started = true;
    current = target;
    const queue = loadOrder(COUNT);
    const worker = async () => {
      while (queue.length && !destroyed) {
        await fetchFrame(queue.shift()!).catch(() => undefined);
      }
    };
    for (let w = 0; w < CONCURRENCY; w++) void worker();
  };

  return {
    start,
    setProgress: (p) => {
      target = p;
    },
    destroy: () => {
      destroyed = true;
      abort.abort();
      gsap.ticker.remove(tick);
      resize.disconnect();
      bitmaps.forEach((b) => b?.close());
      bitmaps.fill(undefined);
      blobs.fill(undefined);
    },
  };
}
