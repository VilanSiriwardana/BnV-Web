import { heartPoint } from '../canvas/heart-geometry';

const MARGIN = 14;
const SAMPLES = 720;

// Romance Additions F3. n stars on the heart outline in connect order, starting just right of the
// top-centre dip and going clockwise, mapped to the 0–100 SVG box (y down) with a margin.
// Spaced by arc length (equal parameters bunch up at the tip).
export function skyStarLayout(n: number): { x: number; y: number }[] {
  const pts = Array.from({ length: SAMPLES + 1 }, (_, i) =>
    heartPoint((i / SAMPLES) * 2 * Math.PI),
  );
  const cum = [0];
  for (let i = 1; i <= SAMPLES; i++)
    cum.push(
      cum[i - 1] +
        Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]),
    );
  const total = cum[SAMPLES];
  const span = 100 - 2 * MARGIN;
  // heartPoint spans about x ±0.95, y −1..0.9.
  const size = 1.9;
  let j = 0;
  return Array.from({ length: n }, (_, i) => {
    const target = ((i + 0.5) / n) * total;
    while (j < SAMPLES && cum[j + 1] < target) j++;
    const k = (target - cum[j]) / (cum[j + 1] - cum[j] || 1);
    const x = pts[j][0] + (pts[j + 1][0] - pts[j][0]) * k;
    const y = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * k;
    return {
      x: MARGIN + ((x + 0.95) / size) * span,
      y: MARGIN + ((0.9 - y) / size) * span,
    };
  });
}
