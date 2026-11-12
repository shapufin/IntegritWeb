export interface RateLimiter {
  check(key: string, now?: number): boolean
}

/** Simple in-memory fixed-window limiter (per process). Returns true if allowed. */
export function createRateLimiter(limit: number, windowMs: number): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>()
  return {
    check(key, now = Date.now()) {
      if (hits.size > 5000) {
        for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k)
      }
      const entry = hits.get(key)
      if (!entry || entry.resetAt <= now) {
        hits.set(key, { count: 1, resetAt: now + windowMs })
        return true
      }
      if (entry.count >= limit) return false
      entry.count += 1
      return true
    },
  }
}
