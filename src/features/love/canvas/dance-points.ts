// Blueprint 088: the traced couple, one particle cloud per pose (scripts/prepare-dance-points.mjs).
// Layout per pose: Uint16 x, y (count·4 bytes), then Uint8 r, g, b, flags (count·4 bytes);
// flags bit 0 = on the outline, bit 1 = him.
export type DanceManifest = { count: number; xRange: number; yRange: number };
export type DancePoints = {
  count: number;
  positions: Float32Array[]; // xy per pose, scene units (floor y = 0)
  colors: Float32Array[]; // rgb 0..1 per pose
  flags: Float32Array[]; // vec2 per pose: outline, him
};

export function decodeDancePoints(
  buffer: ArrayBuffer,
  { count, xRange, yRange }: DanceManifest,
): DancePoints {
  const poseCount = Math.floor(buffer.byteLength / (count * 8));
  const out: DancePoints = { count, positions: [], colors: [], flags: [] };
  for (let k = 0; k < poseCount; k++) {
    const xy = new Uint16Array(buffer, k * count * 8, count * 2);
    const rgbf = new Uint8Array(buffer, k * count * 8 + count * 4, count * 4);
    const pos = new Float32Array(count * 2);
    const col = new Float32Array(count * 3);
    const flag = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      pos[i * 2] = (xy[i * 2] / 65535) * xRange * 2 - xRange;
      pos[i * 2 + 1] = (xy[i * 2 + 1] / 65535) * yRange;
      for (let c = 0; c < 3; c++) col[i * 3 + c] = rgbf[i * 4 + c] / 255;
      flag[i * 2] = rgbf[i * 4 + 3] & 1;
      flag[i * 2 + 1] = (rgbf[i * 4 + 3] >> 1) & 1;
    }
    out.positions.push(pos);
    out.colors.push(col);
    out.flags.push(flag);
  }
  return out;
}

export async function loadDancePoints(
  manifest: DanceManifest,
  url = '/dance-reel/points.bin',
): Promise<DancePoints> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`dance points: ${res.status}`);
  return decodeDancePoints(await res.arrayBuffer(), manifest);
}
