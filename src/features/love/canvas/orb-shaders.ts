// Glass shell (Experience §3.6): cheap fresnel, no transmission.
export const shellVertex = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

export const shellFragment = /* glsl */ `
uniform vec3 uColorLav;
uniform vec3 uColorGold;
uniform float uHover;
uniform float uEmissive;
uniform float uFade;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.5);
  vec3 col = mix(uColorLav, uColorGold, smoothstep(0.65, 1.0, fres));
  float a = (0.06 + fres * 0.8) * (0.65 + 0.55 * uHover) * uEmissive * uFade;
  gl_FragColor = vec4(col * a, a);
}`;

export const photoVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const photoFragment = /* glsl */ `
uniform sampler2D uMap;
uniform float uSaturation;
uniform float uFade;
varying vec2 vUv;
void main() {
  vec4 tex = texture2D(uMap, vUv);
  float l = dot(tex.rgb, vec3(0.2126, 0.7152, 0.0722));
  vec3 col = mix(vec3(l), tex.rgb, uSaturation);
  float edge = 1.0 - smoothstep(0.42, 0.5, distance(vUv, vec2(0.5)));
  float a = edge * uFade * (0.55 + 0.45 * uSaturation);
  gl_FragColor = vec4(col, a);
  #include <colorspace_fragment>
}`;
