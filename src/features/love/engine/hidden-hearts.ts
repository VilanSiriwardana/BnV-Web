import { useSyncExternalStore } from 'react';

import { loveKey, readJSON, writeJSON } from './persist';

// Romance Additions F9 (+ F7/F8 opened state): a device-persisted set of ids. Works for the
// session when storage is blocked (persist.ts never throws).
export type PersistedSet = {
  has: (id: string) => boolean;
  add: (id: string) => void;
  count: () => number;
  ids: () => readonly string[];
  subscribe: (fn: () => void) => () => void;
};

export function createPersistedSet(key: string): PersistedSet {
  let ids: readonly string[] = [];
  let loaded = false;
  const listeners = new Set<() => void>();
  const load = () => {
    if (loaded) return;
    loaded = true;
    const saved = readJSON<unknown>(key, []);
    ids = Array.isArray(saved)
      ? saved.filter((v): v is string => typeof v === 'string')
      : [];
  };
  return {
    has: (id) => (load(), ids.includes(id)),
    count: () => (load(), ids.length),
    ids: () => (load(), ids),
    add(id) {
      load();
      if (ids.includes(id)) return;
      ids = [...ids, id];
      writeJSON(key, ids);
      listeners.forEach((fn) => fn());
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

const sets = new Map<string, PersistedSet>();
export function progressSet(slug: string, name: 'gifts' | 'notes' | 'hearts') {
  const key = loveKey(slug, name);
  let set = sets.get(key);
  if (!set) sets.set(key, (set = createPersistedSet(key)));
  return set;
}

const EMPTY: readonly string[] = [];
export function usePersistedSet(set: PersistedSet) {
  return useSyncExternalStore(set.subscribe, set.ids, () => EMPTY);
}

export const HIDDEN_HEART_IDS = [
  'hero',
  'memories',
  'timeline',
  'gallery',
  'letter',
] as const;
export type HiddenHeartId = (typeof HIDDEN_HEART_IDS)[number];

export const hiddenHearts = (slug: string) => progressSet(slug, 'hearts');
