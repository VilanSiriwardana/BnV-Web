import { mulberry32 } from '../canvas/heart-geometry';

// Blueprint 053: the glass case's front pane breaks into triangles (a jittered grid, two triangles
// per cell) that fly out from the hammer's impact. Pure and deterministic per seed.
export type Point2 = { x: number; y: number };
export type Shard = { a: Point2; b: Point2; c: Point2; centroid: Point2 };

export function fracturePane(w: number, h: number, count: number, seed = 7) {
  const rand = mulberry32(seed);
  const cells = Math.max(1, Math.round(count / 2));
  const cols = Math.max(1, Math.round(Math.sqrt((cells * w) / h)));
  const rows = Math.max(1, Math.ceil(cells / cols));
  const dx = w / cols;
  const dy = h / rows;
  const grid: Point2[][] = [];
  for (let j = 0; j <= rows; j++) {
    const row: Point2[] = [];
    for (let i = 0; i <= cols; i++) {
      const edgeX = i === 0 || i === cols;
      const edgeY = j === 0 || j === rows;
      row.push({
        x: -w / 2 + i * dx + (edgeX ? 0 : (rand() - 0.5) * dx * 0.6),
        y: -h / 2 + j * dy + (edgeY ? 0 : (rand() - 0.5) * dy * 0.6),
      });
    }
    grid.push(row);
  }
  const shards: Shard[] = [];
  const tri = (a: Point2, b: Point2, c: Point2) =>
    shards.push({
      a,
      b,
      c,
      centroid: { x: (a.x + b.x + c.x) / 3, y: (a.y + b.y + c.y) / 3 },
    });
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const p = grid[j][i];
      const q = grid[j][i + 1];
      const r = grid[j + 1][i + 1];
      const s = grid[j + 1][i];
      if ((i + j) % 2) {
        tri(p, q, r);
        tri(p, r, s);
      } else {
        tri(p, q, s);
        tri(q, r, s);
      }
    }
  return shards;
}

export const triangleArea = ({ a, b, c }: Shard) =>
  Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;

export const SHATTER_DURATION = 1.6;
const GRAVITY = 9.8;

export type ShardPose = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  opacity: number;
};

/** Where a shard is `t` seconds after the strike (pane-local metres, +z out of the case). */
export function shardMotion(
  shard: Shard,
  index: number,
  t: number,
  impact: Point2,
  out: ShardPose,
) {
  const rand = mulberry32(index * 97 + 13);
  const ox = shard.centroid.x - impact.x;
  const oy = shard.centroid.y - impact.y;
  const d = Math.hypot(ox, oy) || 1;
  const burst = 0.6 + rand() * 0.9;
  const vx = (ox / d) * burst;
  const vy = (oy / d) * burst + 0.4 * rand();
  const vz = 0.9 + rand() * 1.1;
  out.x = shard.centroid.x + vx * t;
  out.y = shard.centroid.y + vy * t - 0.5 * GRAVITY * t * t;
  out.z = vz * t;
  out.rx = (rand() - 0.5) * 14 * t;
  out.ry = (rand() - 0.5) * 14 * t;
  out.opacity =
    t < 0.9 ? 1 : Math.max(0, 1 - (t - 0.9) / (SHATTER_DURATION - 0.9));
  return out;
}
