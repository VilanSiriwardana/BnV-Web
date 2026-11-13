// Experience §3.4. Uniforms only; no per-frame CPU work over particles.
export const heartVertex = /* glsl */ `
attribute vec3 aRibbon;
attribute vec3 aHeart;
attribute vec3 aScatter;
attribute vec4 aRand;
uniform float uForm;
uniform float uBurst;
uniform float uTime;
uniform float uPR;
uniform float uBeat;
uniform float uBeatScale;
varying vec4 vRand;
varying float vSide;
varying float vDiag;
varying float vForm;

void main() {
  float f = smoothstep(0.0, 1.0, clamp((uForm - aRand.x * 0.35) / 0.65, 0.0, 1.0));
  float b = smoothstep(0.0, 1.0, clamp((uBurst - aRand.x * 0.30) / 0.70, 0.0, 1.0));

  // Ribbons stay alive: the helix phase turns with time until the weave takes over.
  vec3 r = aRibbon;
  float spin = uTime * 0.8 * (1.0 - f);
  float c = cos(spin), s = sin(spin);
  r.yz = mat2(c, -s, s, c) * r.yz;

  vec3 p = mix(r, aHeart, f);
  p = mix(p, aScatter, b);
  p += 0.02 * vec3(sin(uTime * 0.7 + aRand.w * 6.28), cos(uTime * 0.6 + aRand.w * 4.0), 0.0);
  p *= 1.0 + uBeat * 0.04 * uBeatScale;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = aRand.y * uPR * (28.0 / -mv.z) * (1.0 + uBeat * 0.3 * uBeatScale);
  gl_Position = projectionMatrix * mv;

  vRand = aRand;
  vSide = clamp(aHeart.x * 0.5 + 0.5, 0.0, 1.0);
  vDiag = (aHeart.x + aHeart.y) * 0.5;
  vForm = f;
}
`;

export const heartFragment = /* glsl */ `
uniform vec3 uColorLav;
uniform vec3 uColorLilac;
uniform vec3 uColorGold;
uniform vec3 uColorRose;
uniform float uGlow;
uniform float uShine;
uniform float uBeat;
uniform float uGold;
varying vec4 vRand;
varying float vSide;
varying float vDiag;
varying float vForm;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.0, d);
  alpha *= alpha;

  // 55 % lavender, 15 % lilac, 22 % gold, 8 % rose.
  float m = vRand.z;
  vec3 col = m < 0.55 ? uColorLav : m < 0.70 ? uColorLilac : m < 0.92 ? uColorGold : uColorRose;
  // Two lights become one: left lavender, right gold, soft blend in the middle.
  vec3 side = mix(uColorLav, uColorGold, smoothstep(0.25, 0.75, vSide));
  col = mix(col, side, 0.35 + 0.35 * (1.0 - vForm));

  // Shine: a diagonal band sweeping from -1.4 to 1.4 as uShine goes 0 -> 1.
  float band = 1.0 - smoothstep(0.0, 0.18, abs(vDiag - (uShine * 2.8 - 1.4)));
  float shine = band * step(0.001, uShine) * step(uShine, 0.999);

  col = mix(col, uColorGold, uGold * 0.35);

  float glow = min(uGlow + uBeat * 0.12, 1.1);
  vec3 outCol = col * (0.35 + 0.55 * glow) + vec3(0.25) * shine;
  // Additive: keep each sprite dim so overlap never clips to white.
  gl_FragColor = vec4(min(outCol, vec3(0.9)), alpha * 0.55);
}
`;
