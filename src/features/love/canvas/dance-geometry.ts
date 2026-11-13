import { mulberry32 } from './heart-geometry';
import {
  DANCE_FRAMES,
  DANCE_PARTS,
  type Frame,
  type Shape,
  type Vec,
} from './dance-silhouettes';

// A point on a shape from fixed parameters (u along, v across, both 0..1), so the same
// parameters land on the same spot of that body part in every frame.
export function pointOn(shape: Shape, u: number, v: number): Vec {
  if (shape.kind === 'circle') {
    const r = shape.r * Math.sqrt(u);
    const a = v * Math.PI * 2;
    return [shape.c[0] + Math.cos(a) * r, shape.c[1] + Math.sin(a) * r];
  }
  if (shape.kind === 'capsule') {
    const dx = shape.b[0] - shape.a[0];
    const dy = shape.b[1] - shape.a[1];
    const len = Math.hypot(dx, dy) || 1e-6;
    const r = shape.ra + (shape.rb - shape.ra) * u;
    const w = (v * 2 - 1) * r;
    return [
      shape.a[0] + dx * u - (dy / len) * w,
      shape.a[1] + dy * u + (dx / len) * w,
    ];
  }
  const [p0, p1, p2, p3] = shape.p;
  const top: Vec = [p0[0] + (p1[0] - p0[0]) * v, p0[1] + (p1[1] - p0[1]) * v];
  const bottom: Vec = [
    p2[0] + (p3[0] - p2[0]) * v,
    p2[1] + (p3[1] - p2[1]) * v,
  ];
  const sag = Math.sin(v * Math.PI) * shape.bulge * u * u;
  return [
    top[0] + (bottom[0] - top[0]) * u,
    top[1] + (bottom[1] - top[1]) * u - sag,
  ];
}

const shapeArea = (s: Shape) => {
  if (s.kind === 'circle') return Math.PI * s.r * s.r;
  if (s.kind === 'capsule')
    return Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]) * (s.ra + s.rb);
  const [a, b, c, d] = s.p;
  return Math.abs(
    (a[0] * b[1] -
      b[0] * a[1] +
      b[0] * c[1] -
      c[0] * b[1] +
      c[0] * d[1] -
      d[0] * c[1] +
      d[0] * a[1] -
      a[0] * d[1]) /
      2,
  );
};

export type DanceAttributes = {
  positions: Float32Array;
  width: number;
  height: number;
  rowsPerFrame: number;
  index: Float32Array;
  rand: Float32Array; // vec4
  info: Float32Array; // vec2: owner (0 him, 1 her), sway
  part: Uint8Array;
};

// Parts are drawn per particle (not in blocks), so any draw-range prefix covers the whole couple.
// Shape choice inside a part uses frame-0 areas, fixed for every frame. A quarter of the points
// sit on the outline so the silhouette edge reads clearly.
export function buildDanceAttributes(
  count: number,
  seed = 5,
  frames: Frame[] = DANCE_FRAMES,
): DanceAttributes {
  const rand = mulberry32(seed);
  const width = 2048;
  const rowsPerFrame = Math.ceil(count / width);
  const height = rowsPerFrame * frames.length;
  const out: DanceAttributes = {
    positions: new Float32Array(width * height * 4),
    width,
    height,
    rowsPerFrame,
    index: new Float32Array(count),
    rand: new Float32Array(count * 4),
    info: new Float32Array(count * 2),
    part: new Uint8Array(count),
  };
  const cumulative = DANCE_PARTS.map(
    (
      (sum) => (p: (typeof DANCE_PARTS)[number]) =>
        (sum += p.weight)
    )(0),
  );
  const shapeWeights = DANCE_PARTS.map((p) => {
    const areas = frames[0][p.id].map(shapeArea);
    const total = areas.reduce((a, b) => a + b, 0);
    let acc = 0;
    return areas.map((a) => (acc += a / total));
  });

  for (let i = 0; i < count; i++) {
    const pr = rand() * cumulative[cumulative.length - 1];
    const pi = Math.max(
      0,
      cumulative.findIndex((c) => pr <= c),
    );
    const part = DANCE_PARTS[pi];
    const sr = rand();
    const si = Math.max(
      0,
      shapeWeights[pi].findIndex((c) => sr <= c),
    );
    const u = rand();
    const edge = rand() < 0.25;
    const v = edge ? (rand() < 0.5 ? 0.02 : 0.98) : rand();
    frames.forEach((frame, f) => {
      const [x, y] = pointOn(frame[part.id][si], u, v);
      const offset =
        ((f * rowsPerFrame + Math.floor(i / width)) * width + (i % width)) * 4;
      out.positions[offset] = x;
      out.positions[offset + 1] = y;
    });
    out.index[i] = i;
    out.rand.set([rand(), 0.5 + rand() * 0.8, rand(), rand()], i * 4);
    out.info.set([part.owner, part.sway], i * 2);
    out.part[i] = pi;
  }
  return out;
}
