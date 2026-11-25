import { CatmullRomCurve3, MathUtils, Vector3 } from 'three';

// Gallery walk (Phase 12): one gentle left sweep. Local space: floor at y 0, walking toward -z,
// left is -x. Starting values to tune with the debug panel, not fixed.
export const GALLERY_DIMS = { width: 2.4, height: 3, eye: 1.6 } as const;
/** World offset of the corridor: far behind the story camera so the heart scene never shows. */
export const GALLERY_ORIGIN = new Vector3(0, -GALLERY_DIMS.eye, -400);
/** The entrance door stands this far along the curve (about 2.6 m ahead of the start). */
export const DOOR_T = 0.09;
/** The camera stops this far along the curve so the end frame stays ahead of it. */
export const WALK_END = 0.92;
const LOOK_AHEAD = 0.04;

const CONTROL = [
  [0, 0, 0],
  [0, 0, -4],
  [-0.3, 0, -9],
  [-1.6, 0, -14],
  [-4, 0, -18.5],
  [-7.5, 0, -22],
  [-11.5, 0, -24.5],
] as const;

export function createGalleryCurve() {
  return new CatmullRomCurve3(
    CONTROL.map(([x, y, z]) => new Vector3(x, y, z)),
    false,
    'centripetal',
  );
}

const UP = new Vector3(0, 1, 0);

/** Point and left-pointing horizontal normal at arc-length t (a fixed up vector, no Frenet flips). */
export function frameAt(
  curve: CatmullRomCurve3,
  t: number,
  point: Vector3,
  left: Vector3,
) {
  curve.getPointAt(t, point);
  curve.getTangentAt(t, left);
  left.y = 0;
  left.normalize();
  left.crossVectors(UP, left).normalize();
}

export type SlotKind = 'photo' | 'decor' | 'end';
export type FrameSlot = {
  kind: SlotKind;
  /** Photo index into config.gallery; -1 for decor and the end frame. */
  photo: number;
  t: number;
  side: 1 | -1; // 1 left wall, -1 right wall, 0 never (end frame faces back along the path)
};

// 16 wall slots alternate sides; four of them are decor, spread so neither wall clusters them.
const DECOR_AT = new Set([3, 7, 10, 14]);
const SLOT_START = 0.15; // first frame sits past the entrance door (DOOR_T)
const SLOT_END = 0.88;

export function createSlots(photos = 12): FrameSlot[] {
  const wall = photos + DECOR_AT.size;
  let photo = 0;
  const slots: FrameSlot[] = [];
  for (let i = 0; i < wall; i++) {
    const decor = DECOR_AT.has(i) || photo >= photos;
    slots.push({
      kind: decor ? 'decor' : 'photo',
      photo: decor ? -1 : photo++,
      t: SLOT_START + ((SLOT_END - SLOT_START) * i) / (wall - 1),
      side: i % 2 === 0 ? 1 : -1,
    });
  }
  slots.push({ kind: 'end', photo: -1, t: 1, side: 1 });
  return slots;
}

/** Camera position and look target for walk progress 0..1. Writes into the given vectors. */
export function walkPose(
  curve: CatmullRomCurve3,
  progress: number,
  position: Vector3,
  target: Vector3,
) {
  const t = Math.min(Math.max(progress, 0), 1) * WALK_END;
  curve.getPointAt(t, position);
  curve.getPointAt(Math.min(t + LOOK_AHEAD, 1), target);
  position.y = GALLERY_DIMS.eye;
  target.y = GALLERY_DIMS.eye;
}

/** Longest side of a photo frame and of the end portrait, metres. */
export const PHOTO_MAX = 1.1;
export const END_MAX = 1.6;

/** Height of a frame's centre above the floor. */
export const HANG_Y = 1.62;
/** Inspect stand-off limits, metres: never closer than this, never past the opposite wall. */
const INSPECT_MIN = 1.3;
const INSPECT_MAX = GALLERY_DIMS.width - 0.2;
/** Frame + margin share of the view, and how far below centre the camera aims (room for controls). */
const FIT_MARGIN = 1.3;
const AIM_DROP = 0.1;
const END_INSET = 0.04;
const tmp = new Vector3();

/** Photo slots in walk order, then the end frame: the order Previous/Next and the twins use. */
export function inspectOrder(slots: FrameSlot[]) {
  return slots.filter((s) => s.kind !== 'decor');
}

/**
 * Where a frame hangs: centre on the wall (or the end wall) and the unit vector it faces
 * (into the corridor).
 */
export function hangAt(
  curve: CatmullRomCurve3,
  slot: FrameSlot,
  center: Vector3,
  facing: Vector3,
) {
  if (slot.kind === 'end') {
    curve.getPointAt(1, center);
    curve.getTangentAt(1, facing);
    facing.y = 0;
    facing.normalize().negate();
    center.addScaledVector(facing, END_INSET);
  } else {
    frameAt(curve, slot.t, center, facing);
    center.addScaledVector(facing, slot.side * (GALLERY_DIMS.width / 2 - 0.03));
    facing.multiplyScalar(-slot.side);
  }
  center.y = HANG_Y;
}

/** Photo frame size in metres from its pixel aspect; the longest side is `max`. */
export function frameSize(
  photo: { width: number; height: number } | undefined,
  max: number,
) {
  if (!photo) return { w: 0.9, h: 0.7 };
  const aspect = photo.width / photo.height;
  return aspect >= 1
    ? { w: max, h: max / aspect }
    : { w: max * aspect, h: max };
}

/** Distance at which a w × h frame fits the view (vertical fov in degrees, viewport aspect). */
export function fitDistance(w: number, h: number, fov: number, aspect: number) {
  const tanV = Math.tan(MathUtils.degToRad(fov) / 2);
  const d = FIT_MARGIN * Math.max(h / 2 / tanV, w / 2 / (tanV * aspect));
  return Math.min(Math.max(d, INSPECT_MIN), INSPECT_MAX);
}

/** Camera pose for looking straight at a frame from `distance` metres. */
export function inspectPose(
  curve: CatmullRomCurve3,
  slot: FrameSlot,
  distance: number,
  position: Vector3,
  target: Vector3,
) {
  hangAt(curve, slot, target, tmp);
  position.copy(target).addScaledVector(tmp, distance);
  position.y = target.y;
  target.y -= AIM_DROP;
}

/** Walk progress at which the camera is a few metres short of a slot (focus scrolls here). */
export function progressForSlot(slot: FrameSlot, length: number) {
  const before = slot.kind === 'end' ? 0 : 2.2 / length;
  return Math.min(Math.max((slot.t - before) / WALK_END, 0), 1);
}

/** Blueprint 059: share of the gallery stage scroll spent opening the doors before the walk. */
export const GALLERY_DOOR_SPAN = 0.2;
/** Stage scroll progress (0..1) → walk progress; the door stretch maps to walk 0. */
export const walkFromStage = (p: number) =>
  MathUtils.clamp((p - GALLERY_DOOR_SPAN) / (1 - GALLERY_DOOR_SPAN), 0, 1);
/** Walk progress → stage scroll progress (inverse of walkFromStage). */
export const stageFromWalk = (w: number) =>
  GALLERY_DOOR_SPAN + MathUtils.clamp(w, 0, 1) * (1 - GALLERY_DOOR_SPAN);
