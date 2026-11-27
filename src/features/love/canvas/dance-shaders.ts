// Experience §19.6, blueprint 088: the traced couple. Each particle morphs from its spot in one pose
// to its spot in the next (staggered, so the shape flows), her half turns about her centre during the
// twirl, and colour comes from the art toned toward the palette.
export const danceVertex = /* glsl */ `
attribute vec2 aFrom;
attribute vec2 aTo;
attribute vec3 aColFrom;
attribute vec3 aColTo;
attribute vec2 aFlagFrom;
attribute vec2 aFlagTo;
attribute vec4 aRand;
uniform float uK;
uniform float uSwirl;
uniform float uHerX;
uniform float uTime;
uniform float uPR;
varying vec3 vCol;
varying float vHim;
varying float vEdge;

void main() {
  float k = smoothstep(0.0, 1.0, clamp((uK - aRand.x * 0.2) / 0.8, 0.0, 1.0));
  vec2 p = mix(aFrom, aTo, k);
  vec2 flag = mix(aFlagFrom, aFlagTo, k);
  // A small arc mid-morph, so crossing particles part instead of sliding through each other.
  p += vec2(aRand.w - 0.5, aRand.z - 0.5) * sin(k * 3.14159265) * 0.08;
  float z = (aRand.z - 0.5) * 0.05;
  float a = uSwirl * (1.0 - flag.y);
  float dx = p.x - uHerX;
  p.x = uHerX + dx * cos(a);
  z += dx * sin(a);
  p.x += 0.006 * sin(uTime * 1.1 + p.y * 2.0 + aRand.w * 2.0);
  p += 0.004 * vec2(sin(uTime * 0.9 + aRand.w * 6.28), cos(uTime * 0.8 + aRand.x * 6.28));

  vec4 mv = modelViewMatrix * vec4(p, z, 1.0);
  gl_PointSize = (0.7 + aRand.y * 0.6) * uPR * (12.0 / -mv.z) * mix(1.0, 1.2, flag.x);
  gl_Position = projectionMatrix * mv;
  vCol = mix(aColFrom, aColTo, k);
  vHim = flag.y;
  vEdge = flag.x;
}
`;

export const danceFragment = /* glsl */ `
uniform vec3 uColorLav;
uniform vec3 uColorGold;
uniform float uGlow;
uniform float uVisible;
varying vec3 vCol;
varying float vHim;
varying float vEdge;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.0, d);
  alpha *= alpha;
  vec3 tone = mix(uColorGold, uColorLav, vHim);
  // Art colour toned 40 % toward the palette; dark suit pixels are lifted so he still glows.
  vec3 col = max(mix(vCol * 1.25, tone, 0.4), tone * 0.35);
  col *= (0.55 + 0.45 * uGlow) * (1.0 + 0.3 * vEdge);
  gl_FragColor = vec4(min(col, vec3(0.9)), alpha * 0.7 * uVisible);
}
`;
