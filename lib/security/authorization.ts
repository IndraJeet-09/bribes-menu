import crypto from "crypto";

/**
 * Validates admin moderation secret using timing-safe string comparison.
 * Prevents side-channel timing attacks on secret comparison.
 */
export function verifyModerationSecret(providedSecret: string | null): boolean {
  const expectedSecret = process.env.MODERATION_SECRET;

  if (!expectedSecret || !providedSecret) {
    return false;
  }

  const expectedBuffer = Buffer.from(expectedSecret);
  const providedBuffer = Buffer.from(providedSecret);

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}
