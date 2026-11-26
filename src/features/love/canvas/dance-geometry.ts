import { mulberry32 } from './heart-geometry';
import {
  buildPose,
  DANCE_PARTS,
  type Frame,
  KEYFRAMES,
  type Shape,
  SHAPE_COUNT,
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

export type DanceParticles = {
  shape: Float32Array; // global shape index (DANCE_PARTS order, then shape order)
  uv: Float32Array; // vec2: fixed (u, v) on that shape
  rand: Float32Array; // vec4
  info: Float32Array; // vec2: owner (0 him, 1 her), sway
  part: Uint8Array;
};

// Blueprint 079: each particle keeps a fixed spot (shape, u, v) on one body part; the GPU places it on
// the live pose every frame. Parts are mixed per particle, so any draw-range prefix covers the couple.
// Shape choice inside a part uses the first pose's areas. A quarter of the points sit on the outline.
export function buildDanceParticles(count: number, seed = 5): DanceParticles {
  const rand = mulberry32(seed);
  const out: DanceParticles = {
    shape: new Float32Array(count),
    uv: new Float32Array(count * 2),
    rand: new Float32Array(count * 4),
    info: new Float32Array(count * 2),
    part: new Uint8Array(count),
  };
  const first = buildPose(KEYFRAMES[0]);
  const cumulative = DANCE_PARTS.map(
    (
      (sum) => (p: (typeof DANCE_PARTS)[number]) =>
        (sum += p.weight)
    )(0),
  );
  const offsets = DANCE_PARTS.map(
    (
      (sum) => (p: (typeof DANCE_PARTS)[number]) =>
        (sum += first[p.id].length) - first[p.id].length
    )(0),
  );
  const shapeWeights = DANCE_PARTS.map((p) => {
    const areas = first[p.id].map(shapeArea);
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
    out.shape[i] = offsets[pi] + si;
    out.uv.set([u, v], i * 2);
    out.rand.set([rand(), 0.5 + rand() * 0.8, rand(), rand()], i * 4);
    out.info.set([part.owner, part.sway], i * 2);
    out.part[i] = pi;
  }
  return out;
}

// 12 floats (3 vec4) per shape, global order; layout mirrored by danceVertex in dance-shaders.ts.
export const SHAPE_FLOATS = 12;
export const packedShapes = () => new Float32Array(SHAPE_COUNT * SHAPE_FLOATS);

export function packShapes(frame: Frame, out: Float32Array) {
  let o = 0;
  for (const p of DANCE_PARTS)
    for (const s of frame[p.id]) {
      out.fill(0, o, o + SHAPE_FLOATS);
      if (s.kind === 'circle') out.set([0, s.c[0], s.c[1], s.r], o);
      else if (s.kind === 'capsule')
        out.set([1, s.a[0], s.a[1], s.ra, s.b[0], s.b[1], s.rb], o);
      else {
        const [p0, p1, p2, p3] = s.p;
        out.set([2, ...p0, s.bulge, ...p1, ...p2, ...p3], o);
      }
      o += SHAPE_FLOATS;
    }
  return out;
}

export function unpackShape(packed: Float32Array, index: number): Shape {
  const f = (k: number) => packed[index * SHAPE_FLOATS + k];
  if (f(0) === 0) return { kind: 'circle', c: [f(1), f(2)], r: f(3) };
  if (f(0) === 1)
    return {
      kind: 'capsule',
      a: [f(1), f(2)],
      b: [f(4), f(5)],
      ra: f(3),
      rb: f(6),
    };
  return {
    kind: 'quad',
    p: [
      [f(1), f(2)],
      [f(4), f(5)],
      [f(6), f(7)],
      [f(8), f(9)],
    ],
    bulge: f(3),
  };
}
