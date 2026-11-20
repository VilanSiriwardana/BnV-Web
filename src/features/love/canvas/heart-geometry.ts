// Experience §3.4. Pure functions: no React, no three.

// t in [0, 2π). Returns a point of the heart outline, normalised to about [-1, 1].
export function heartPoint(t: number): [number, number] {
  const x = 16 * Math.sin(t) ** 3;
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);
  return [x / 17, y / 17];
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type HeartAttributes = {
  aHeart: Float32Array;
  aRibbon: Float32Array;
  aScatter: Float32Array;
  aRand: Float32Array;
};

const RIBBON = { W: 7, r0: 1.1, r1: 0.06, turns: 3.5 };
const SCATTER_RADIUS = 2.2;

// Sides alternate (even = left, odd = right) so any setDrawRange prefix draws both ribbons.
export function ribbonSide(i: number): -1 | 1 {
  return i % 2 === 0 ? -1 : 1;
}

export function buildHeartAttributes(count: number, seed = 7): HeartAttributes {
  const rand = mulberry32(seed);
  const aHeart = new Float32Array(count * 3);
  const aRibbon = new Float32Array(count * 3);
  const aScatter = new Float32Array(count * 3);
  const aRand = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const side = ribbonSide(i);
    // s: position along this ribbon / half outline (seeded random, so any prefix spans the whole
    // outline). Left half of the heart is t ∈ [π, 2π].
    const s = rand();
    const outlineT = side < 0 ? Math.PI + s * Math.PI : s * Math.PI;
    const onOutline = rand() < 0.7;
    let radius: number;
    let t: number;
    if (onOutline) {
      t = outlineT;
      radius = 1 + (rand() - 0.5) * 0.08;
    } else {
      t = side < 0 ? Math.PI + rand() * Math.PI : rand() * Math.PI;
      radius = Math.sqrt(rand());
    }
    const [hx, hy] = heartPoint(t);
    const o = i * 3;
    aHeart[o] = hx * radius;
    aHeart[o + 1] = hy * radius;
    aHeart[o + 2] = (rand() - 0.5) * 0.45 * (1 - (onOutline ? 0.85 : radius));

    const { W, r0, r1, turns } = RIBBON;
    const r = r0 * (1 - s) ** 0.6 + r1;
    const theta = turns * 2 * Math.PI * s + rand() * 0.4;
    aRibbon[o] = side * (1 - s) * W + hx * s;
    aRibbon[o + 1] = r * Math.sin(theta) + hy * s;
    aRibbon[o + 2] = r * Math.cos(theta);

    const u = rand() * 2 - 1;
    const phi = rand() * Math.PI * 2;
    const sr = SCATTER_RADIUS * Math.cbrt(rand());
    const sq = Math.sqrt(1 - u * u);
    aScatter[o] = sr * sq * Math.cos(phi);
    aScatter[o + 1] = sr * sq * Math.sin(phi);
    aScatter[o + 2] = sr * u;

    const q = i * 4;
    aRand[q] = rand();
    aRand[q + 1] = 0.6 + rand() * 0.9;
    aRand[q + 2] = rand();
    aRand[q + 3] = rand();
  }
  return { aHeart, aRibbon, aScatter, aRand };
}
