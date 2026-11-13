// Experience §3.7. Pure helpers so they can be unit-tested.

export function band(data: Uint8Array, from: number, to: number) {
  let sum = 0;
  for (let i = from; i <= to; i++) sum += data[i];
  return sum / ((to - from + 1) * 255);
}

// Fast attack, slow decay.
export function smoothFastAttack(prev: number, next: number, decay = 0.9) {
  return Math.max(next, prev * decay);
}

const bump = (x: number, centre: number, width: number) =>
  Math.exp(-(((x - centre) / width) ** 2));

// Synthetic "lub-dub" envelope (0..1) at `bpm`, used when there is no audio.
export function lubDub(seconds: number, bpm = 72) {
  const phase = ((seconds * bpm) / 60) % 1;
  return Math.min(1, bump(phase, 0.06, 0.05) + 0.6 * bump(phase, 0.24, 0.05));
}
