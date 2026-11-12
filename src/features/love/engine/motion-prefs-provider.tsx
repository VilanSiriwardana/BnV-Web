'use client';

import {
  type ReactNode,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';

import {
  MotionPrefsContext,
  REDUCED_MOTION_QUERY,
  readSaveData,
  readStoredCalm,
  resolveCalm,
  storeCalm,
} from './motion-prefs';

const calmListeners = new Set<() => void>();

function subscribeCalm(listener: () => void) {
  calmListeners.add(listener);
  return () => calmListeners.delete(listener);
}

function subscribeReducedMotion(listener: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener('change', listener);
  return () => mq.removeEventListener('change', listener);
}

const noSubscribe = () => () => {};
const serverFalse = () => false;
const readReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;

// Server snapshots are `false` (motion), so hydration matches; real preferences apply right after.
export function MotionPrefsProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribeCalm, readStoredCalm, serverFalse);
  const os = useSyncExternalStore(
    subscribeReducedMotion,
    readReducedMotion,
    serverFalse,
  );
  const saveData = useSyncExternalStore(noSubscribe, readSaveData, serverFalse);
  // Set when the user switches Calm off while the OS or Save-Data asks for it.
  const [override, setOverride] = useState(false);

  const setCalm = useCallback((calm: boolean) => {
    storeCalm(calm);
    setOverride(!calm);
    calmListeners.forEach((listener) => listener());
  }, []);

  const value = useMemo(
    () => ({
      ...resolveCalm({
        user,
        os: os && !override,
        saveData: saveData && !override,
      }),
      setCalm,
    }),
    [user, os, saveData, override, setCalm],
  );

  return (
    <MotionPrefsContext.Provider value={value}>
      {children}
    </MotionPrefsContext.Provider>
  );
}
