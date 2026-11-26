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
  petalRelease: 0, // 0..1 petals present (Blueprint 062: director owns this)
  petalGather: 0, // 0 = falling free, 1 = pulled into the heart
  petalShiver: 0, // 0..1 vibration (arrow flight)
  petalDim: 0, // 0..1 dim petals in busy sections
  petalAbsorb: 0, // 0..1 petals fly out of the screen toward the viewer (Memories)
  petalBurstId: 0, // Blueprint 065: bumped on each burst; petals spray from the heart
  petalBurstAt: { x: 0, y: 0 }, // heart NDC at that burst
  burstScale: 1, // Blueprint 067: how far burst hearts scatter (arrow strike blasts wider)
  ambientIn: 0, // 0..1 ambient hearts allowed (eases in after the hero intro)
  cameraZ: 6, // scrubbed camera dolly
  cameraShake: 0, // camera jitter amplitude (world units), arrow hit
  lean: { x: 0, y: 0 }, // additive NDC offset toward a hovered/focused orb (≤ 0.15)
  arrow: 0, // arrow flight progress 0..1 (arrowStrike)
  star: 0, // wish star visibility 0..1
  starHold: 0, // wish hold progress 0..1
  sealRim: 0, // extra gold while docked on the letter seal
  spell: 0, // 0 = heart, 1 = particles spell text A (Finale, F1)
  spellB: 0, // 0 = text A, 1 = text B
};
export type HeartState = typeof heart;
