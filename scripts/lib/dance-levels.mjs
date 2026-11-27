// Blueprint 081: shared backdrop → page colour helpers for the dance scripts (used by prepare-dance-video.mjs).
import sharp from 'sharp';

// --night-depth-background at the Dance depth (≈ 0.5 between --night-background and --night-surface).
export const PAGE = [29, 22, 37];

// Mean of the plain backdrop (side edges at mid-height, top centre); the lighter floor glow is left out.
export async function backgroundOf(input) {
  const { data, info } = await sharp(input)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const spots = [
    [0.02, 0.4],
    [0.02, 0.6],
    [0.98, 0.4],
    [0.98, 0.6],
    [0.5, 0.01],
  ];
  const sums = [0, 0, 0];
  for (const [fx, fy] of spots) {
    const x = Math.round(fx * (info.width - 1));
    const y = Math.round(fy * (info.height - 1));
    const i = (y * info.width + x) * 3;
    for (let c = 0; c < 3; c++) sums[c] += data[i + c] / spots.length;
  }
  return sums;
}

// Per-channel levels that move the still's background onto the page color and keep white white.
export const levels = (bg) => ({
  a: bg.map((b, c) => (255 - PAGE[c]) / (255 - b)),
  b: bg.map((b, c) => PAGE[c] - (b * (255 - PAGE[c])) / (255 - b)),
});
