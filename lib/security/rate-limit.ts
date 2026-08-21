import crypto from "crypto";

interface ClientRecord {
  hourlyTimestamps: number[];
  minuteTimestamps: number[];
}

// In-memory sliding window cache
const rateLimitMap = new Map<string, ClientRecord>();

// Cleanup stale records every 10 minutes
setInterval(() => {
  const now = Date.now();
  const oneHourAgo = now - 3600 * 1000;
  for (const [key, record] of rateLimitMap.entries()) {
    record.hourlyTimestamps = record.hourlyTimestamps.filter((t) => t > oneHourAgo);
    if (record.hourlyTimestamps.length === 0) {
      rateLimitMap.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Privacy-conscious client identifier generator.
 * Hashes client IP / X-Forwarded-For using SHA-256 so raw IP is never logged or stored.
 */
export function hashClientIdentifier(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT || "unofficial-fine-menu-salt-2026";
  return crypto.createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

export interface RateLimitCheckResult {
  allowed: boolean;
  reason?: string;
  retryAfterSeconds?: number;
}

/**
 * Rate Limiter Policy:
 * - Max 5 submissions per hour
 * - Max 2 submissions per minute (burst control)
 */
export function checkRateLimit(hashedClientId: string): RateLimitCheckResult {
  const now = Date.now();
  const oneHourAgo = now - 3600 * 1000;
  const oneMinuteAgo = now - 60 * 1000;

  let record = rateLimitMap.get(hashedClientId);
  if (!record) {
    record = { hourlyTimestamps: [], minuteTimestamps: [] };
    rateLimitMap.set(hashedClientId, record);
  }

  // Filter active timestamps
  record.hourlyTimestamps = record.hourlyTimestamps.filter((t) => t > oneHourAgo);
  record.minuteTimestamps = record.minuteTimestamps.filter((t) => t > oneMinuteAgo);

  // Check burst limit (2 per minute)
  if (record.minuteTimestamps.length >= 2) {
    const oldestInMinute = record.minuteTimestamps[0];
    const retryAfter = Math.ceil((oldestInMinute + 60 * 1000 - now) / 1000);
    return {
      allowed: false,
      reason: "Too many submissions in a short period. Please wait a minute.",
      retryAfterSeconds: Math.max(retryAfter, 1),
    };
  }

  // Check hourly limit (5 per hour)
  if (record.hourlyTimestamps.length >= 5) {
    const oldestInHour = record.hourlyTimestamps[0];
    const retryAfter = Math.ceil((oldestInHour + 3600 * 1000 - now) / 1000);
    return {
      allowed: false,
      reason: "Submission limit reached (max 5 reports per hour).",
      retryAfterSeconds: Math.max(retryAfter, 1),
    };
  }

  // Register current attempt timestamp
  record.hourlyTimestamps.push(now);
  record.minuteTimestamps.push(now);

  return { allowed: true };
}
