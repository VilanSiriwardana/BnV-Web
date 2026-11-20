// Romance Additions F2: music ducks under the voice note. Pure; audio-engine applies the result with
// linearRampToValueAtTime (no clicks).
export const DUCK_LEVEL = 0.18;
export const DUCK_IN_S = 0.4;
export const DUCK_OUT_S = 0.8;

export type DuckRamp = { to: number; seconds: number };

// volume: the music's normal gain. Returns null when there is nothing to change.
export function duckRamp(
  volume: number,
  voicePlaying: boolean,
  musicMuted: boolean,
): DuckRamp | null {
  if (musicMuted) return null;
  return voicePlaying
    ? { to: volume * DUCK_LEVEL, seconds: DUCK_IN_S }
    : { to: volume, seconds: DUCK_OUT_S };
}
