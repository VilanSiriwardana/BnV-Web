// Romance Additions F5. Uniforms only; candle-state writes them once per frame.
export const quadVertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

// Soft teardrop with noise flicker. uBlow bends it sideways and shrinks it; uOut snuffs it.
export const flameFragment = /* glsl */ `
uniform vec3 uGold;
uniform vec3 uIvory;
uniform vec3 uRose;
uniform float uTime;
uniform float uBlow;
uniform float uOut;
uniform float uVisible;
varying vec2 vUv;

float hash(float n) { return fract(sin(n) * 43758.5453); }
float noise(float x) { float i = floor(x); float f = fract(x); return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f)); }

void main() {
  vec2 p = vUv - vec2(0.5, 0.2);
  float h = clamp(p.y / 0.7, 0.0, 1.0);
  float flick = noise(uTime * 9.0) - 0.5;
  // Bend: the tip leans away from her breath, more the higher up the flame.
  p.x -= (uBlow * 0.28 + flick * 0.03) * h * h;
  float shrink = mix(1.0, 0.45, uBlow) * (1.0 - uOut);
  p /= max(shrink, 0.001);
  float width = 0.16 * (1.0 - h) * sqrt(max(h, 0.0) + 0.08) * 2.2;
  float d = abs(p.x) / max(width, 0.001);
  float body = smoothstep(1.0, 0.2, d) * smoothstep(-0.05, 0.02, p.y) * smoothstep(0.75, 0.3, p.y);
  float core = smoothstep(0.5, 0.0, length((p - vec2(0.0, 0.12)) * vec2(3.2, 1.6)));
  vec3 col = mix(uRose, uGold, smoothstep(0.0, 0.35, p.y));
  col = mix(col, uIvory, core * 0.8);
  float halo = smoothstep(0.5, 0.0, length(vUv - vec2(0.5, 0.35))) * 0.25 * shrink;
  float a = clamp(body + halo, 0.0, 1.0) * (0.85 + 0.15 * flick) * uVisible * (1.0 - uOut);
  gl_FragColor = vec4(col, a);
}
`;

// A thin wisp that rises and fades as uOut goes 0 → 1.
export const smokeFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uTime;
uniform float uOut;
uniform float uVisible;
varying vec2 vUv;
void main() {
  float rise = uOut;
  float y = vUv.y;
  float x = vUv.x - 0.5 - sin(y * 9.0 - uTime * 2.0) * 0.06 * y;
  float wisp = smoothstep(0.06, 0.0, abs(x)) * smoothstep(0.0, 0.1, y) * smoothstep(rise, rise - 0.3, y);
  float fade = (1.0 - smoothstep(0.6, 1.0, uOut)) * step(0.001, uOut);
  gl_FragColor = vec4(uColor, wisp * 0.45 * fade * uVisible);
}
`;

// Cake particles: the heart's soft sprite style.
export const cakeVertex = /* glsl */ `
attribute vec4 aRand;
uniform float uPR;
uniform float uTime;
varying vec4 vRand;
void main() {
  vec3 p = position;
  p.y += 0.01 * sin(uTime * 1.3 + aRand.w * 6.28);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = min(aRand.y * uPR * (20.0 / -mv.z), 5.0 * uPR);
  gl_Position = projectionMatrix * mv;
  vRand = aRand;
}
`;

export const cakeFragment = /* glsl */ `
uniform vec3 uColorLav;
uniform vec3 uColorGold;
uniform vec3 uColorRose;
uniform float uVisible;
varying vec4 vRand;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d);
  // vRand.z: 0 = lower tier (lavender), 1 = upper tier (gold), 2 = rim trim (rose).
  vec3 col = vRand.z < 0.5 ? uColorLav : vRand.z < 1.5 ? uColorGold : uColorRose;
  gl_FragColor = vec4(min(col * 0.9, vec3(0.75)), a * a * 0.5 * uVisible);
}
`;
