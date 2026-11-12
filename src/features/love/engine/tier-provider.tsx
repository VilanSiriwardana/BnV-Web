'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react';

import { readSaveData } from './motion-prefs';
import { guessTier, stepTier, type Tier } from './tiers';

let current: Tier | null = null;
const listeners = new Set<() => void>();

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function readTier(): Tier {
  current ??= guessTier({
    webgl: hasWebGL(),
    touch: window.matchMedia('(pointer: coarse)').matches,
    cores: navigator.hardwareConcurrency,
    memory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
    saveData: readSaveData(),
    width: window.innerWidth,
  });
  return current;
}

function writeTier(tier: Tier) {
  if (tier === current) return;
  current = tier;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// The server renders no canvas, so `static` keeps hydration identical.
const serverTier = (): Tier => 'static';

type TierContextValue = {
  tier: Tier;
  setTier: (tier: Tier) => void;
  stepDown: () => void;
  stepUp: () => void;
};

const TierContext = createContext<TierContextValue>({
  tier: 'static',
  setTier: () => {},
  stepDown: () => {},
  stepUp: () => {},
});

export function TierProvider({ children }: { children: ReactNode }) {
  const tier = useSyncExternalStore(subscribe, readTier, serverTier);
  const value = useMemo(
    () => ({
      tier,
      setTier: writeTier,
      stepDown: () => writeTier(stepTier(readTier(), -1)),
      stepUp: () => writeTier(stepTier(readTier(), 1)),
    }),
    [tier],
  );
  return <TierContext.Provider value={value}>{children}</TierContext.Provider>;
}

export function useTier() {
  return useContext(TierContext);
}
