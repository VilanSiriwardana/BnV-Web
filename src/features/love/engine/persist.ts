// ADR-0032: device-only progress. Never throws; storage may be missing or blocked.
export const loveKey = (slug: string, name: string) => `love:${slug}:${name}`;

function store(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = store()?.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    store()?.setItem(key, JSON.stringify(value));
  } catch {
    // Blocked or full: progress stays session-only.
  }
}

export function removeJSON(key: string): void {
  try {
    store()?.removeItem(key);
  } catch {
    // Blocked: nothing to remove.
  }
}
