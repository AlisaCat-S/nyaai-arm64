type WindowRecord = {
  count: number
  resetAt: number
}

const store = new Map<string, WindowRecord>()

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean, remaining: number, resetAt: number } {
  if (!store.has(key)) {
    const resetAt = Date.now() + windowMs
    store.set(key, { count: 0, resetAt })
    setTimeout(() => { store.delete(key) }, windowMs)
  }
  const rec = store.get(key)!
  const allowed = rec.count < limit
  allowed && rec.count++
  return { allowed, remaining: limit - rec.count, resetAt: rec.resetAt }
}
