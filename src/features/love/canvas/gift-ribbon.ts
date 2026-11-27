import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Vector3,
} from 'three';

// Flat satin ribbon: a strip of quads that follows a curve, its width held along a fixed side axis.
// Points are rewritten in place each time the untie progress changes (no per-frame allocation).
export type Ribbon = {
  geometry: BufferGeometry;
  curve: CatmullRomCurve3;
  side: Vector3;
  width: number;
  segments: number;
};

export function createRibbon(
  points: Vector3[],
  side: Vector3,
  width: number,
  segments = 40,
): Ribbon {
  const geometry = new BufferGeometry();
  const verts = (segments + 1) * 2;
  geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(verts * 3), 3),
  );
  const uv = new Float32Array(verts * 2);
  const index: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const v = i / segments;
    uv.set([0, v, 1, v], i * 4);
    if (i < segments) {
      const a = i * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  geometry.setAttribute('uv', new BufferAttribute(uv, 2));
  geometry.setIndex(index);
  const ribbon: Ribbon = {
    geometry,
    curve: new CatmullRomCurve3(
      points.map((p) => p.clone()),
      false,
      'centripetal',
    ),
    side: side.clone().normalize(),
    width,
    segments,
  };
  updateRibbon(ribbon);
  return ribbon;
}

const p = new Vector3();
const offset = new Vector3();

/** Rebuild the strip from `ribbon.curve.points` (mutate those first). */
export function updateRibbon(ribbon: Ribbon) {
  const pos = ribbon.geometry.getAttribute('position') as BufferAttribute;
  offset.copy(ribbon.side).multiplyScalar(ribbon.width / 2);
  for (let i = 0; i <= ribbon.segments; i++) {
    ribbon.curve.getPoint(i / ribbon.segments, p);
    pos.setXYZ(i * 2, p.x - offset.x, p.y - offset.y, p.z - offset.z);
    pos.setXYZ(i * 2 + 1, p.x + offset.x, p.y + offset.y, p.z + offset.z);
  }
  pos.needsUpdate = true;
  ribbon.geometry.computeVertexNormals();
  ribbon.geometry.computeBoundingSphere();
}

export const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * A band draped from the lid centre, over the lid edge and down the box face, sliding outward by
 * `slide` (0..1). Once a point passes the lid edge it falls and settles on the table beyond the box.
 * Profile entries are [distance from centre, height]; `dir` is the outward unit direction (x, z).
 */
export function drapeBand(
  out: Vector3[],
  profile: readonly (readonly [number, number])[],
  dir: readonly [number, number],
  slide: number,
  edge: number,
  floor: number,
) {
  const s = smooth(0, 1, slide);
  profile.forEach(([r, y], i) => {
    const r2 = r + s * 1.15;
    const fall = smooth(edge - 0.02, edge + 0.3, r2) * smooth(0, 0.6, s);
    const rest = floor + 0.012 + Math.sin(i * 1.7) * 0.012 * fall;
    const y2 = y + (rest - y) * fall;
    out[i].set(dir[0] * r2, Math.max(floor + 0.008, y2), dir[1] * r2);
  });
}
