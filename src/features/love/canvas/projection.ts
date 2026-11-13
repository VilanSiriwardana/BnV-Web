import { type Camera, type Object3D, Vector3 } from 'three';

const v = new Vector3();
const edge = new Vector3();

type Size = { width: number; height: number };

// World position → CSS pixels (origin top-left) for DOM overlays.
export function projectToScreen(
  target: Object3D | Vector3,
  camera: Camera,
  size: Size,
) {
  if (target instanceof Vector3) v.copy(target);
  else target.getWorldPosition(v);
  v.project(camera);
  return {
    x: ((v.x + 1) / 2) * size.width,
    y: ((1 - v.y) / 2) * size.height,
    ndc: { x: v.x, y: v.y },
    visible: v.z < 1,
  };
}

// Projected radius in pixels of a sphere of world `radius` at `center`.
export function projectRadius(
  center: Vector3,
  radius: number,
  camera: Camera,
  size: Size,
) {
  v.copy(center).project(camera);
  edge.copy(center);
  edge.y += radius;
  edge.project(camera);
  return (Math.abs(edge.y - v.y) / 2) * size.height;
}
