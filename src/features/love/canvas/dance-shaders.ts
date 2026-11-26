import { SHAPE_COUNT } from './dance-silhouettes';

// Experience §19.6, blueprint 079: each particle sits at a fixed (u, v) on one shape of the live pose
// (uShapes, packed by packShapes in dance-geometry.ts); pointOn mirrors the TypeScript version.
export const danceVertex = /* glsl */ `
attribute float aShape;
attribute vec2 aUV;
attribute vec4 aRand;
attribute vec2 aInfo;
uniform vec4 uShapes[${SHAPE_COUNT * 3}];
uniform float uTime;
uniform float uPR;
varying vec4 vRand;
varying float vOwner;

vec2 pointOn(int s, float u, float v) {
  vec4 h = uShapes[s];
  vec4 m = uShapes[s + 1];
  vec4 n = uShapes[s + 2];
  if (h.x < 0.5) {
    float a = v * 6.2831853;
    return h.yz + vec2(cos(a), sin(a)) * h.w * sqrt(u);
  }
  if (h.x < 1.5) {
    vec2 d = m.xy - h.yz;
    float len = max(length(d), 1e-6);
    float w = (v * 2.0 - 1.0) * mix(h.w, m.z, u);
    return h.yz + d * u + vec2(-d.y, d.x) / len * w;
  }
  vec2 top = mix(h.yz, m.xy, v);
  vec2 bottom = mix(m.zw, n.xy, v);
  vec2 p = mix(top, bottom, u);
  p.y -= sin(v * 3.14159265) * h.w * u * u;
  return p;
}

void main() {
  vec2 p = pointOn(int(aShape + 0.5) * 3, aUV.x, aUV.y);
  // Hair and skirt sway; everything shimmers a little like the heart.
  p.x += aInfo.y * 0.018 * sin(uTime * 1.6 + p.y * 4.0 + aRand.w * 2.0);
  p += 0.006 * vec2(sin(uTime * 0.9 + aRand.w * 6.28), cos(uTime * 0.8 + aRand.x * 6.28));

  vec4 mv = modelViewMatrix * vec4(p, (aRand.z - 0.5) * 0.06, 1.0);
  gl_PointSize = aRand.y * uPR * (14.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
  vRand = aRand;
  vOwner = aInfo.x;
}
`;

export const danceFragment = /* glsl */ `
uniform vec3 uColorLav;
uniform vec3 uColorLilac;
uniform vec3 uColorGold;
uniform vec3 uColorRose;
uniform float uGlow;
uniform float uVisible;
varying vec4 vRand;
varying float vOwner;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.0, d);
  alpha *= alpha;
  vec3 him = mix(uColorLav, uColorLilac, step(0.7, vRand.z));
  vec3 her = mix(uColorGold, uColorRose, step(0.85, vRand.z));
  vec3 col = mix(him, her, vOwner) * (0.4 + 0.5 * uGlow);
  gl_FragColor = vec4(min(col, vec3(0.9)), alpha * 0.6 * uVisible);
}
`;
