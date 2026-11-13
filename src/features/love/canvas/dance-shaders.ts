// Experience §19.6: the couple's particles blend between silhouette frames on the GPU (heart style).
export const danceVertex = /* glsl */ `
attribute float aIndex;
attribute vec4 aRand;
attribute vec2 aInfo;
uniform sampler2D uFrames;
uniform float uFrame;
uniform int uRows;
uniform float uTime;
uniform float uPR;
varying vec4 vRand;
varying float vOwner;

void main() {
  int index = int(aIndex);
  int row = index / 2048;
  int column = index - row * 2048;
  int first = int(floor(uFrame));
  int second = min(first + 1, 31);
  vec2 a = texelFetch(uFrames, ivec2(column, first * uRows + row), 0).xy;
  vec2 b = texelFetch(uFrames, ivec2(column, second * uRows + row), 0).xy;
  vec2 p = mix(a, b, fract(uFrame));
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
