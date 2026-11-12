'use client';

import { createContext, useContext } from 'react';

export type CalmReason = 'user' | 'os' | 'save-data' | null;

export type MotionPrefs = {
  calm: boolean;
  reason: CalmReason;
  setCalm: (calm: boolean) => void;
};

export const CALM_STORAGE_KEY = 'love:calm';
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function resolveCalm(input: {
  user: boolean;
  os: boolean;
  saveData: boolean;
}): { calm: boolean; reason: CalmReason } {
  if (input.user) return { calm: true, reason: 'user' };
  if (input.os) return { calm: true, reason: 'os' };
  if (input.saveData) return { calm: true, reason: 'save-data' };
  return { calm: false, reason: null };
}

export function readStoredCalm(): boolean {
  try {
    return sessionStorage.getItem(CALM_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function storeCalm(calm: boolean) {
  try {
    if (calm) sessionStorage.setItem(CALM_STORAGE_KEY, '1');
    else sessionStorage.removeItem(CALM_STORAGE_KEY);
  } catch {
    // Storage blocked (private mode, previews); Calm still works for this render.
  }
}

export function readSaveData(): boolean {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return connection?.saveData === true;
}

export const MotionPrefsContext = createContext<MotionPrefs>({
  calm: false,
  reason: null,
  setCalm: () => {},
});

export function useMotionPrefs() {
  return useContext(MotionPrefsContext);
}
