// Experience §8: orb i sits along a corridor the camera flies through.
export const ORB_SPACING = 4.5;
export const ORB_START_Z = -6;

export function orbPosition(i: number, mobile: boolean) {
  return {
    x: Math.sin(i * 1.3) * 2.4 * (mobile ? 0.6 : 1),
    y: Math.cos(i * 0.9) * 1.2,
    z: ORB_START_Z - i * ORB_SPACING,
  };
}

// Camera z at the end of the rail: the last orb + 4.
export function railEndZ(count: number) {
  return ORB_START_Z - Math.max(0, count - 1) * ORB_SPACING + 4;
}

export const RAIL_START_Z = 6;

// Rail progress (0..1) at which the camera sits 4 units in front of orb i.
export function orbRailProgress(i: number, count: number) {
  const end = railEndZ(count);
  const z = orbPosition(i, false).z + 4;
  return Math.min(1, Math.max(0, (RAIL_START_Z - z) / (RAIL_START_Z - end)));
}
