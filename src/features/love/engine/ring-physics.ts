// Romance Additions F4. Pure: angles in radians, the ring turns by rotateY(angle).
export type Ring = { angle: number; vel: number };

const DECAY_PER_16MS = 0.92;
const SPRING_BELOW = 1.5; // rad/s: below this the snap spring takes over from momentum
const K = 60;
const C = 14;
const REST = 1e-4;

export function stepRing(
  s: Ring,
  dtSec: number,
  step: number,
  dragging: boolean,
): Ring {
  if (dragging || dtSec <= 0) return s;
  const dt = Math.min(dtSec, 0.05);
  let { angle, vel } = s;
  if (Math.abs(vel) >= SPRING_BELOW) {
    angle += vel * dt;
    vel *= DECAY_PER_16MS ** ((dt * 1000) / 16);
    return { angle, vel };
  }
  const target = Math.round(angle / step) * step;
  vel += (K * (target - angle) - C * vel) * dt;
  angle += vel * dt;
  if (Math.abs(target - angle) < REST && Math.abs(vel) < REST * 10)
    return { angle: target, vel: 0 };
  return { angle, vel };
}

export const frontIndex = (angle: number, step: number, n: number) =>
  ((Math.round(-angle / step) % n) + n) % n;

export const isSettled = (s: Ring) => s.vel === 0;
