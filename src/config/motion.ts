// Mirrors Brand-Identity §25.1 and the --ease-* tokens in app/globals.css (seconds for Framer Motion).
export const duration = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
} as const;

export const ease = {
  standard: [0.2, 0, 0, 1],
  exit: [0.4, 0, 1, 1],
} as const;

export const revealOffset = 16;
export const hoverScale = 1.03;
