// In-memory fixed window (owner decision, ADR-0021). Per process only: resets on restart and is not shared
// across instances. Swap for a DB-backed store before horizontal scaling.
type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
) {
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterMs: 0 };
  }
  current.count += 1;
  return current.count > limit
    ? { ok: false, retryAfterMs: current.resetAt - now }
    : { ok: true, retryAfterMs: 0 };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}
