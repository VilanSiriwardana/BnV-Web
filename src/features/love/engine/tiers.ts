export type Tier = 'high' | 'mid' | 'low' | 'static';

export const TIER_ORDER: readonly Tier[] = ['high', 'mid', 'low', 'static'];

// Tech Stack §8.2. `static` = no canvas (DOM-only path).
export const TIERS = {
  high: {
    particles: 18000,
    dpr: 1.75,
    bloom: 'on',
    orbs: 8,
    confetti: 300,
    miniHearts: 40,
    petals: 120,
  },
  mid: {
    particles: 8000,
    dpr: 1.5,
    bloom: 'reduced',
    orbs: 8,
    confetti: 160,
    miniHearts: 28,
    petals: 70,
  },
  low: {
    particles: 3000,
    dpr: 1,
    bloom: 'off',
    orbs: 6,
    confetti: 80,
    miniHearts: 18,
    petals: 40,
  },
  static: {
    particles: 0,
    dpr: 1,
    bloom: 'off',
    orbs: 0,
    confetti: 0,
    miniHearts: 0,
    petals: 0,
  },
} as const satisfies Record<
  Tier,
  {
    particles: number;
    dpr: number;
    bloom: 'on' | 'reduced' | 'off';
    orbs: number;
    confetti: number;
    miniHearts: number;
    petals: number;
  }
>;

export type DeviceHints = {
  webgl: boolean;
  touch: boolean;
  cores?: number;
  memory?: number;
  saveData: boolean;
  width: number;
};

// First guess only; PerformanceMonitor refines it at runtime.
export function guessTier(d: DeviceHints): Tier {
  if (!d.webgl) return 'static';
  if (d.saveData) return 'low';
  if (d.memory !== undefined && d.memory <= 4) return 'low';
  if (d.cores !== undefined && d.cores <= 4) return 'low';
  if (d.touch || d.width < 768) return 'mid';
  if (d.cores !== undefined && d.cores >= 8) return 'high';
  return 'mid';
}

export function stepTier(tier: Tier, dir: 1 | -1): Tier {
  if (tier === 'static') return tier;
  const i = TIER_ORDER.indexOf(tier) - dir;
  // Never step into `static` at runtime (that removes the canvas); never above `high`.
  return TIER_ORDER[Math.min(Math.max(i, 0), TIER_ORDER.length - 2)];
}
