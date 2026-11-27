import { useSyncExternalStore } from 'react';

import { loveKey, readJSON, removeJSON, writeJSON } from './persist';

// Romance Additions F9 (+ F7/F8 opened state): a device-persisted set of ids. Works for the
// session when storage is blocked (persist.ts never throws).
export type PersistedSet = {
  has: (id: string) => boolean;
  add: (id: string) => void;
  count: () => number;
  ids: () => readonly string[];
  subscribe: (fn: () => void) => () => void;
  clear: () => void;
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
    clear() {
      loaded = true;
      ids = [];
      writeJSON(key, []);
      listeners.forEach((fn) => fn());
    },
  };
}

/** Blueprint 085: one device-persisted string (her sealed wish). */
export type PersistedValue = {
  get: () => string;
  set: (v: string) => void;
  subscribe: (fn: () => void) => () => void;
};

const values = new Map<string, PersistedValue>();
export function progressValue(slug: string, name: 'wish') {
  const key = loveKey(slug, name);
  let v = values.get(key);
  if (v) return v;
  let value: string | null = null;
  const listeners = new Set<() => void>();
  v = {
    get: () => (value ??= readJSON<string>(key, '')),
    set(next) {
      value = next;
      if (next) writeJSON(key, next);
      else removeJSON(key);
      listeners.forEach((fn) => fn());
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
  values.set(key, v);
  return v;
}

export function usePersistedValue(v: PersistedValue) {
  return useSyncExternalStore(v.subscribe, v.get, () => '');
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

export const huntIntroKey = (slug: string) => loveKey(slug, 'huntIntro');

/** Blueprint 085: back to closed gifts, no hearts, no wish, intro unseen. */
export function resetProgress(slug: string) {
  for (const n of ['gifts', 'notes', 'hearts'] as const)
    progressSet(slug, n).clear();
  progressValue(slug, 'wish').set('');
  removeJSON(huntIntroKey(slug));
}

const MARKER_CACHE = 'love-progress';

/** Cleared browser cache (Cache Storage marker gone) → fresh progress. No-ops without Cache Storage. */
export async function ensureFreshProgress(slug: string) {
  try {
    if (!('caches' in globalThis)) return;
    const c = await caches.open(MARKER_CACHE);
    const url = `/__love-progress/${slug}`;
    if (await c.match(url)) return;
    resetProgress(slug);
    await c.put(url, new Response('1'));
  } catch {
    // Cache Storage blocked (http, private mode): progress persists as before.
  }
}
