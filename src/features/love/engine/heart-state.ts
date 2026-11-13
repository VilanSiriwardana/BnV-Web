// Tech Stack §7.3: the single source of truth for the heart. GSAP and the audio engine write;
// the canvas reads in useFrame. Never React state.
export const heart = {
  ndc: { x: 0, y: 0 }, // where the heart should be on screen, -1..1 (responsive)
  depth: 0, // world-units toward/away from the camera
  scale: 1,
  form: 0, // 0 = ribbons, 1 = heart
  burst: 0, // 0 = whole, 1 = fully scattered into small hearts
  glow: 0.4, // base glow; also drives bloom intensity
  shine: 0, // 0..1 highlight sweep progress
  gold: 0, // 0..1 extra gold in the particle colours (rises section by section)
  beat: 0, // audio pulse, written by the audio engine
  flinch: 0, // arrow-hit recoil
  ring: 0, // shockwave ring progress
  yaw: 0, // pointer parallax rotation
  roll: 0, // scrubbed hero tilt (radians)
  idleScale: 0, // additive idle breathing (kept apart from director tweens)
  idleGlow: 0,
  petalRelease: 0, // 0..1 petal spawn progress (Bloom)
  cameraZ: 6, // scrubbed camera dolly
  cameraShake: 0, // camera jitter amplitude (world units), arrow hit
  lean: { x: 0, y: 0 }, // additive NDC offset toward a hovered/focused orb (≤ 0.15)
  arrow: 0, // arrow flight progress 0..1 (arrowStrike)
  star: 0, // wish star visibility 0..1
  starHold: 0, // wish hold progress 0..1
  sealRim: 0, // extra gold while docked on the letter seal
};
export type HeartState = typeof heart;
