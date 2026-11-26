// Experience §19.6: the dancing couple as 2D side-view silhouettes (units ≈ metres, floor y = 0,
// he on the left facing +x, she on the right facing −x). Arms are solved with 2-bone IK so the
// joined hands and his hand on her waist always meet. Each body part is a fixed list of shapes,
// so a particle keeps the same spot on the same part in every frame.

export type Vec = readonly [number, number];
export type Shape =
  | { kind: 'circle'; c: Vec; r: number }
  | { kind: 'capsule'; a: Vec; b: Vec; ra: number; rb: number }
  | { kind: 'quad'; p: readonly [Vec, Vec, Vec, Vec]; bulge: number };

export const DANCE_PARTS = [
  { id: 'hisHead', owner: 0, weight: 0.05, sway: 0 },
  { id: 'hisTorso', owner: 0, weight: 0.17, sway: 0 },
  { id: 'hisArmJoined', owner: 0, weight: 0.06, sway: 0 },
  { id: 'hisArmWaist', owner: 0, weight: 0.06, sway: 0 },
  { id: 'hisLegs', owner: 0, weight: 0.15, sway: 0 },
  { id: 'herHead', owner: 1, weight: 0.04, sway: 0 },
  { id: 'herHair', owner: 1, weight: 0.07, sway: 1 },
  { id: 'herTorso', owner: 1, weight: 0.09, sway: 0 },
  { id: 'herArmJoined', owner: 1, weight: 0.05, sway: 0 },
  { id: 'herArmFree', owner: 1, weight: 0.05, sway: 0.3 },
  { id: 'herSkirt', owner: 1, weight: 0.17, sway: 1 },
  { id: 'herLeg', owner: 1, weight: 0.04, sway: 0 },
] as const;
export type PartId = (typeof DANCE_PARTS)[number]['id'];
export type Frame = Record<PartId, Shape[]>;

const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]];
const scale = (a: Vec, k: number): Vec => [a[0] * k, a[1] * k];
// Unit direction at `angle` from straight up, turned toward `face` (+1 right, −1 left).
const dir = (angle: number, face: number): Vec => [
  Math.sin(angle) * face,
  Math.cos(angle),
];
const from = (p: Vec, angle: number, face: number, len: number) =>
  add(p, scale(dir(angle, face), len));

// Two-bone IK: the elbow/knee that reaches `target`. `bend` picks a fixed side of the shoulder→target
// line (blueprint 079), so the elbow never flips when the hand passes overhead.
export function solveLimb(
  s: Vec,
  target: Vec,
  l1: number,
  l2: number,
  bend = 1,
) {
  const dx = target[0] - s[0];
  const dy = target[1] - s[1];
  const dist = Math.hypot(dx, dy) || 1e-6;
  const d = Math.min(Math.max(dist, Math.abs(l1 - l2) + 1e-4), l1 + l2 - 1e-4);
  const u: Vec = [dx / dist, dy / dist];
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const base = add(s, scale(u, a));
  const e1 = add(base, [-u[1] * h, u[0] * h]);
  const e2 = add(base, [u[1] * h, -u[0] * h]);
  const elbow = bend > 0 ? e1 : e2;
  return { elbow, hand: add(s, scale(u, d)) };
}

const limb = (
  s: Vec,
  target: Vec,
  l1: number,
  l2: number,
  r: [number, number, number],
  bend: number,
): Shape[] => {
  const reach = Math.max(
    1,
    Math.hypot(target[0] - s[0], target[1] - s[1]) / (l1 + l2) + 0.001,
  );
  const { elbow, hand } = solveLimb(s, target, l1 * reach, l2 * reach, bend);
  return [
    { kind: 'capsule', a: s, b: elbow, ra: r[0], rb: r[1] },
    { kind: 'capsule', a: elbow, b: hand, ra: r[1], rb: r[2] },
  ];
};

type Leg = readonly [number, number]; // thigh, shin angles from straight down (+ = forward)
const down = (angle: number) => Math.PI - angle;

type HimPose = {
  x: number;
  drop?: number;
  lean: number;
  tilt?: number;
  front: Leg;
  back: Leg;
};
type HerPose = {
  x: number;
  y?: number;
  turn?: number;
  legUp?: number;
  lean: number;
  tilt?: number;
  hair: number; // hair angle from straight down (+ = behind her)
  hem: Vec; // skirt hem centre relative to the hip
  flare: number;
};
type FrameSpec = {
  him: HimPose;
  her: HerPose;
  hisHand: Vec | 'joined';
  herHand: Vec | 'joined';
  joined: Vec;
  waist: Vec | 'back';
  free: Vec | 'shoulder';
};

// He faces +x, she faces −x: each keeps one elbow side (down and out for both).
const HIS_BEND = -1;
const HER_BEND = 1;

export function buildPose(spec: FrameSpec): Frame {
  const m = spec.him;
  const hip: Vec = [m.x, 0.95 - (m.drop ?? 0)];
  const neck = from(hip, m.lean, 1, 0.56);
  const head = from(neck, m.lean + (m.tilt ?? 0), 1, 0.16);
  const shoulder = from(neck, m.lean, 1, -0.05);
  const knee = (l: Leg) => from(hip, down(l[0]), 1, 0.46);
  const foot = (l: Leg) => from(knee(l), down(l[1]), 1, 0.46);

  const w = spec.her;
  const face = -(w.turn ?? 1);
  const herHip: Vec = [w.x, w.y ?? 0.92];
  const herNeck = from(herHip, w.lean, face, 0.5);
  const herHead = from(herNeck, w.lean + (w.tilt ?? 0), face, 0.14);
  const herShoulder = from(herNeck, w.lean, face, -0.04);
  const herWaist = from(herHip, w.lean, face, 0.14);
  const backOfWaist = add(
    herWaist,
    scale(dir(w.lean - Math.PI / 2, face), 0.1),
  );
  const across = dir(w.lean + Math.PI / 2, face);
  const hem = add(herHip, w.hem);
  const legUp = w.legUp ?? 0;
  const legKnee: Vec = [
    herHip[0] + 0.25 * legUp,
    herHip[1] - 0.43 + 0.85 * legUp,
  ];
  const legFoot: Vec = [
    herHip[0] + 0.58 * legUp,
    herHip[1] - 0.86 + 1.61 * legUp,
  ];

  const joined = spec.joined;
  const hisJ = spec.hisHand === 'joined' ? joined : spec.hisHand;
  const herJ = spec.herHand === 'joined' ? joined : spec.herHand;
  const waist = spec.waist === 'back' ? backOfWaist : spec.waist;
  const free =
    spec.free === 'shoulder' ? add(shoulder, [0.02, 0.02]) : spec.free;

  return {
    hisHead: [{ kind: 'circle', c: head, r: 0.11 }],
    hisTorso: [
      {
        kind: 'capsule',
        a: from(neck, m.lean, 1, -0.02),
        b: hip,
        ra: 0.17,
        rb: 0.13,
      },
      { kind: 'capsule', a: neck, b: head, ra: 0.06, rb: 0.06 },
    ],
    hisArmJoined: limb(
      shoulder,
      hisJ,
      0.31,
      0.29,
      [0.055, 0.045, 0.035],
      HIS_BEND,
    ),
    hisArmWaist: limb(
      shoulder,
      waist,
      0.31,
      0.29,
      [0.055, 0.045, 0.035],
      HIS_BEND,
    ),
    hisLegs: [
      { kind: 'capsule', a: hip, b: knee(m.front), ra: 0.085, rb: 0.06 },
      {
        kind: 'capsule',
        a: knee(m.front),
        b: foot(m.front),
        ra: 0.06,
        rb: 0.045,
      },
      { kind: 'capsule', a: hip, b: knee(m.back), ra: 0.085, rb: 0.06 },
      {
        kind: 'capsule',
        a: knee(m.back),
        b: foot(m.back),
        ra: 0.06,
        rb: 0.045,
      },
      {
        kind: 'capsule',
        a: foot(m.front),
        b: add(foot(m.front), [0.12, 0]),
        ra: 0.04,
        rb: 0.03,
      },
      {
        kind: 'capsule',
        a: foot(m.back),
        b: add(foot(m.back), [0.12, 0]),
        ra: 0.04,
        rb: 0.03,
      },
    ],
    herHead: [{ kind: 'circle', c: herHead, r: 0.095 }],
    herHair: [
      {
        kind: 'capsule',
        a: add(herHead, scale(dir(w.lean + Math.PI / 2, -face), 0.04)),
        b: add(herHead, scale(dir(Math.PI - w.hair, -face), 0.42)),
        ra: 0.1,
        rb: 0.05,
      },
    ],
    herTorso: [
      { kind: 'capsule', a: herNeck, b: herWaist, ra: 0.11, rb: 0.075 },
      { kind: 'capsule', a: herWaist, b: herHip, ra: 0.075, rb: 0.1 },
      { kind: 'capsule', a: herNeck, b: herHead, ra: 0.045, rb: 0.045 },
    ],
    herArmJoined: limb(
      herShoulder,
      herJ,
      0.28,
      0.26,
      [0.04, 0.033, 0.026],
      HER_BEND,
    ),
    herArmFree: limb(
      herShoulder,
      free,
      0.28,
      0.26,
      [0.04, 0.033, 0.026],
      HER_BEND,
    ),
    herSkirt: [
      {
        kind: 'quad',
        p: [
          add(herWaist, scale(across, -0.08)),
          add(herWaist, scale(across, 0.08)),
          add(hem, [-w.flare * face, 0]),
          add(hem, [w.flare * face, 0]),
        ],
        bulge: 0.06,
      },
    ],
    herLeg: [
      { kind: 'capsule', a: herHip, b: legKnee, ra: 0.07, rb: 0.05 },
      { kind: 'capsule', a: legKnee, b: legFoot, ra: 0.05, rb: 0.035 },
      {
        kind: 'capsule',
        a: legFoot,
        b: add(legFoot, [0.1, 0]),
        ra: 0.035,
        rb: 0.02,
      },
    ],
  };
}

const LEG_STAND: Leg = [0.05, 0];

// Blueprint 079, after the reference stills: standing → hands join → close hold → hands rise →
// twirl → turn completes → close hold → lunge → dip (hands released, her foot on the floor).
export const KEYFRAMES: FrameSpec[] = [
  {
    him: { x: -0.2, lean: 0.02, front: [0.04, 0], back: [-0.02, 0] },
    her: { x: 0.2, lean: 0.02, hair: 0.1, hem: [0.02, -0.86], flare: 0.24 },
    hisHand: [-0.18, 0.56],
    herHand: [0.18, 0.54],
    joined: [0, 1.0],
    waist: [-0.24, 0.58],
    free: [0.24, 0.56],
  },
  {
    him: { x: -0.22, lean: 0.04, front: [0.08, 0], back: LEG_STAND },
    her: { x: 0.22, lean: 0.03, hair: 0.12, hem: [0.02, -0.86], flare: 0.25 },
    hisHand: 'joined',
    herHand: 'joined',
    joined: [0, 0.86],
    waist: [-0.24, 0.58],
    free: [0.24, 0.56],
  },
  {
    him: { x: -0.13, lean: 0.05, tilt: 0.12, front: [0.1, 0], back: LEG_STAND },
    her: {
      x: 0.13,
      lean: 0.03,
      tilt: -0.12,
      hair: 0.15,
      hem: [0.02, -0.86],
      flare: 0.26,
    },
    hisHand: 'joined',
    herHand: 'joined',
    joined: [0.02, 1.25],
    waist: 'back',
    free: 'shoulder',
  },
  {
    him: { x: -0.17, lean: 0.03, front: [0.1, 0], back: LEG_STAND },
    her: { x: 0.17, lean: 0.03, hair: 0.3, hem: [0, -0.85], flare: 0.32 },
    hisHand: 'joined',
    herHand: 'joined',
    joined: [0.05, 1.62],
    waist: 'back',
    free: 'shoulder',
  },
  {
    him: { x: -0.24, lean: 0.02, front: [0.1, 0], back: LEG_STAND },
    her: {
      x: 0.24,
      turn: -1,
      lean: 0.03,
      hair: 0.9,
      hem: [-0.12, -0.84],
      flare: 0.46,
    },
    hisHand: 'joined',
    herHand: 'joined',
    joined: [0.08, 1.88],
    waist: [-0.24, 0.6],
    free: [0.62, 0.95],
  },
  {
    him: { x: -0.24, lean: 0.02, front: [0.1, 0], back: LEG_STAND },
    her: { x: 0.22, lean: 0.03, hair: 0.4, hem: [0.04, -0.85], flare: 0.34 },
    hisHand: 'joined',
    herHand: 'joined',
    joined: [0.06, 1.5],
    waist: 'back',
    free: 'shoulder',
  },
  {
    him: {
      x: -0.12,
      lean: 0.06,
      tilt: 0.2,
      front: [0.12, 0.04],
      back: LEG_STAND,
    },
    her: {
      x: 0.12,
      lean: 0.02,
      tilt: -0.2,
      hair: 0.15,
      hem: [0.02, -0.86],
      flare: 0.27,
    },
    hisHand: 'joined',
    herHand: 'joined',
    joined: [0.02, 1.25],
    waist: 'back',
    free: 'shoulder',
  },
  {
    him: {
      x: -0.14,
      drop: 0.08,
      lean: 0.12,
      front: [0.45, -0.15],
      back: [-0.3, -0.3],
    },
    her: {
      x: 0.16,
      y: 0.89,
      lean: -0.25,
      tilt: -0.15,
      hair: -0.1,
      hem: [0.1, -0.82],
      flare: 0.32,
    },
    hisHand: 'joined',
    herHand: 'joined',
    joined: [0.1, 1.72],
    waist: 'back',
    free: 'shoulder',
  },
  {
    him: {
      x: -0.1,
      drop: 0.18,
      lean: 0.18,
      tilt: 0.15,
      front: [0.9, 0.1],
      back: [-0.55, -0.55],
    },
    her: {
      x: 0.2,
      y: 0.82,
      lean: -0.72,
      tilt: -0.4,
      hair: -0.4,
      hem: [0.28, -0.74],
      flare: 0.4,
      legUp: 0.08,
    },
    hisHand: [-0.78, 1.28],
    herHand: [0.95, 1.2],
    joined: [0.3, 1.3],
    waist: 'back',
    free: 'shoulder',
  },
];

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerpVec = (a: Vec, b: Vec, k: number): Vec => [
  lerp(a[0], b[0], k),
  lerp(a[1], b[1], k),
];
const optional = (a: number | undefined, b: number | undefined, k: number) =>
  lerp(a ?? 0, b ?? 0, k);
function resolve(spec: FrameSpec, value: Vec | string): Vec {
  if (typeof value !== 'string') return value;
  if (value === 'joined') return spec.joined;
  if (value === 'shoulder') {
    const hip: Vec = [spec.him.x, 0.95 - (spec.him.drop ?? 0)];
    const neck = from(hip, spec.him.lean, 1, 0.56);
    return add(from(neck, spec.him.lean, 1, -0.05), [0.02, 0.02]);
  }
  const w = spec.her;
  const face = -(w.turn ?? 1);
  const hip: Vec = [w.x, w.y ?? 0.92];
  const waist = from(hip, w.lean, face, 0.14);
  return add(waist, scale(dir(w.lean - Math.PI / 2, face), 0.1));
}

export function interpolateSpec(
  a: FrameSpec,
  b: FrameSpec,
  k: number,
): FrameSpec {
  return {
    him: {
      x: lerp(a.him.x, b.him.x, k),
      drop: optional(a.him.drop, b.him.drop, k),
      lean: lerp(a.him.lean, b.him.lean, k),
      tilt: optional(a.him.tilt, b.him.tilt, k),
      front: lerpVec(a.him.front, b.him.front, k),
      back: lerpVec(a.him.back, b.him.back, k),
    },
    her: {
      x: lerp(a.her.x, b.her.x, k),
      y: lerp(a.her.y ?? 0.92, b.her.y ?? 0.92, k),
      turn: lerp(a.her.turn ?? 1, b.her.turn ?? 1, k),
      legUp: optional(a.her.legUp, b.her.legUp, k),
      lean: lerp(a.her.lean, b.her.lean, k),
      tilt: optional(a.her.tilt, b.her.tilt, k),
      hair: lerp(a.her.hair, b.her.hair, k),
      hem: lerpVec(a.her.hem, b.her.hem, k),
      flare: lerp(a.her.flare, b.her.flare, k),
    },
    hisHand: lerpVec(resolve(a, a.hisHand), resolve(b, b.hisHand), k),
    herHand: lerpVec(resolve(a, a.herHand), resolve(b, b.herHand), k),
    joined: lerpVec(a.joined, b.joined, k),
    waist: lerpVec(resolve(a, a.waist), resolve(b, b.waist), k),
    free: lerpVec(resolve(a, a.free), resolve(b, b.free), k),
  };
}

// Every pose has the same shapes in the same order (the GPU indexes them globally).
export const SHAPE_COUNT = Object.values(buildPose(KEYFRAMES[0])).reduce(
  (n, shapes) => n + shapes.length,
  0,
);
