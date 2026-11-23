import {
  BoxGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  Path,
  Shape,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { heartPoint } from './heart-geometry';

// Blueprint 053: the gold key. Tip at the origin, shaft along +z, a heart-shaped bow at the far
// end in the y–z plane (so it reads as a key from the front and turns about z in the lock).
export const KEY_LENGTH = 0.17;

function heartOutline(scale: number, into: Shape | Path) {
  for (let i = 0; i <= 40; i++) {
    const [x, y] = heartPoint((i / 40) * Math.PI * 2);
    if (i === 0) into.moveTo(x * scale, y * scale);
    else into.lineTo(x * scale, y * scale);
  }
  return into;
}

export function createKeyGeometry() {
  const bowShape = heartOutline(0.034, new Shape()) as Shape;
  bowShape.holes.push(heartOutline(0.018, new Path()) as Path);
  const bow = new ExtrudeGeometry(bowShape, {
    depth: 0.008,
    bevelEnabled: true,
    bevelSize: 0.003,
    bevelThickness: 0.003,
    bevelSegments: 2,
    curveSegments: 4,
  });
  bow.center();
  bow.rotateY(Math.PI / 2);
  bow.translate(0, 0, KEY_LENGTH - 0.03);

  const shaft = new CylinderGeometry(0.0065, 0.0065, 0.12, 12);
  shaft.rotateX(Math.PI / 2);
  shaft.translate(0, 0, 0.06);

  const collar = new CylinderGeometry(0.011, 0.011, 0.008, 16);
  collar.rotateX(Math.PI / 2);
  collar.translate(0, 0, 0.118);

  const bit1 = new BoxGeometry(0.004, 0.022, 0.012);
  bit1.translate(0, -0.014, 0.012);
  const bit2 = new BoxGeometry(0.004, 0.014, 0.008);
  bit2.translate(0, -0.01, 0.03);

  const parts = [bow, shaft, collar, bit1, bit2].map((g) =>
    g.index ? g.toNonIndexed() : g,
  );
  const key = mergeGeometries(parts);
  [bow, shaft, collar, bit1, bit2, ...parts].forEach((g) => g.dispose());
  return key;
}
