/**
 * Sanitizes text input:
 * 1. Strips HTML tags and script elements
 * 2. Removes null bytes and control characters
 * 3. Normalizes and collapses repeated whitespace
 * 4. Trims leading/trailing whitespace
 */
export function sanitizeString(text: string): string {
  if (!text) return "";

  return text
    // Remove null bytes and invisible control chars (except standard newlines/tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Normalize newlines and carriage returns
    .replace(/\r\n/g, "\n")
    // Collapse multiple consecutive spaces/tabs into a single space
    .replace(/[ \t]+/g, " ")
    .trim();
}
