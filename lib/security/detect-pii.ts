/**
 * PII and Spam/Suspicious Content Inspector
 * Inspects description strings for emails, phone numbers, identity cards (Aadhaar, PAN, Passport),
 * URLs, script payloads, and character repetition spam.
 */

// Regex patterns
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
const PHONE_REGEX = /(\+?91[\s-]?)?[6-9]\d{9}|\b\d{10,12}\b/;
const AADHAAR_REGEX = /\b[2-9]\d{3}\s?\d{4}\s?\d{4}\b/;
const PAN_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/i;
const PASSPORT_REGEX = /\b[A-Z]{1}[0-9]{7}\b/i;
const URL_REGEX = /(https?:\/\/|www\.|[a-zA-Z0-9-]+\.(com|net|org|in|co|io|dev)\b)/i;
const SCRIPT_PAYLOAD_REGEX = /(javascript:|data:|vbscript:|<script|<iframe|onerror=|onload=)/i;
const REPEATED_CHAR_REGEX = /(.)\1{14,}/; // 15 or more identical repeated characters

export interface PIICheckResult {
  hasPIIOrSuspicious: boolean;
  reason?: string;
}

export function detectPIIAndSpam(text: string): PIICheckResult {
  if (!text) {
    return { hasPIIOrSuspicious: false };
  }

  if (SCRIPT_PAYLOAD_REGEX.test(text)) {
    return {
      hasPIIOrSuspicious: true,
      reason: "Suspicious script payload or embedded tag detected.",
    };
  }

  if (URL_REGEX.test(text)) {
    return {
      hasPIIOrSuspicious: true,
      reason: "URLs and links are not permitted in reports.",
    };
  }

  if (EMAIL_REGEX.test(text)) {
    return {
      hasPIIOrSuspicious: true,
      reason: "Email addresses are not allowed to maintain anonymity.",
    };
  }

  if (PHONE_REGEX.test(text)) {
    return {
      hasPIIOrSuspicious: true,
      reason: "Phone numbers are not allowed to maintain anonymity.",
    };
  }

  if (AADHAAR_REGEX.test(text) || PAN_REGEX.test(text) || PASSPORT_REGEX.test(text)) {
    return {
      hasPIIOrSuspicious: true,
      reason: "Personal identification numbers (Aadhaar/PAN/Passport) are strictly forbidden.",
    };
  }

  if (REPEATED_CHAR_REGEX.test(text)) {
    return {
      hasPIIOrSuspicious: true,
      reason: "Excessively repeated characters detected.",
    };
  }

  return { hasPIIOrSuspicious: false };
}
