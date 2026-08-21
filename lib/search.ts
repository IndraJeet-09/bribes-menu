import { Offence } from "@/types/offence";

export interface SearchResult {
  offence: Offence;
  score: number;
  matchedTokens: string[];
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(text: string): string[] {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  return normalized.split(" ").filter((t) => t.length > 0);
}

/**
 * Token-based intelligent search engine with weighted ranking
 */
export function searchOffences(offences: Offence[], query: string): Offence[] {
  const trimmed = query.trim();
  if (!trimmed) return offences;

  const normalizedQuery = normalizeText(trimmed);
  const queryTokens = tokenize(trimmed);

  if (queryTokens.length === 0) return offences;

  const scoredResults: SearchResult[] = [];

  for (const offence of offences) {
    let score = 0;
    const matchedTokens: string[] = [];

    const normTitle = normalizeText(offence.title);
    const normCategory = normalizeText(offence.category);
    const normDescription = normalizeText(offence.description);
    const normAliases = offence.aliases.map((a) => normalizeText(a));
    const normKeywords = offence.keywords.map((k) => normalizeText(k));

    // 1. Exact Title Match
    if (normTitle === normalizedQuery) {
      score += 1000;
    } else if (normTitle.startsWith(normalizedQuery)) {
      score += 800;
    } else if (normTitle.includes(normalizedQuery)) {
      score += 500;
    }

    // 2. Exact or Substring Alias Match
    for (const alias of normAliases) {
      if (alias === normalizedQuery) {
        score += 750;
      } else if (alias.startsWith(normalizedQuery)) {
        score += 450;
      } else if (alias.includes(normalizedQuery)) {
        score += 350;
      }
    }

    // 3. Category Match
    if (normCategory === normalizedQuery || normCategory.includes(normalizedQuery)) {
      score += 300;
    }

    // 4. Token-by-Token Match Checks
    let matchedTokenCount = 0;

    for (const token of queryTokens) {
      let tokenMatched = false;

      // Title match with token
      if (normTitle.includes(token)) {
        score += 150;
        tokenMatched = true;
        // Prefix bonus on words inside title
        const words = normTitle.split(" ");
        if (words.some((w) => w === token)) {
          score += 100;
        } else if (words.some((w) => w.startsWith(token))) {
          score += 60;
        }
      }

      // Alias match with token
      for (const alias of normAliases) {
        if (alias.includes(token)) {
          score += 100;
          tokenMatched = true;
          const words = alias.split(" ");
          if (words.some((w) => w === token)) {
            score += 60;
          } else if (words.some((w) => w.startsWith(token))) {
            score += 30;
          }
        }
      }

      // Keyword match with token
      for (const kw of normKeywords) {
        if (kw === token) {
          score += 120;
          tokenMatched = true;
        } else if (kw.includes(token)) {
          score += 60;
          tokenMatched = true;
        }
      }

      // Category match with token
      if (normCategory.includes(token)) {
        score += 80;
        tokenMatched = true;
      }

      // Description match with token
      if (normDescription.includes(token)) {
        score += 30;
        tokenMatched = true;
      }

      if (tokenMatched) {
        matchedTokenCount++;
        matchedTokens.push(token);
      }
    }

    // Multi-token completeness bonus: If all user query tokens are matched, add large boost
    if (matchedTokenCount === queryTokens.length) {
      score += 300;
    }

    // If at least one token matched or substring found
    if (score > 0) {
      scoredResults.push({
        offence,
        score,
        matchedTokens,
      });
    }
  }

  // Sort descending by score, tie-break by report count and alphabetical title
  scoredResults.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (b.offence.reports !== a.offence.reports) {
      return b.offence.reports - a.offence.reports;
    }
    return a.offence.title.localeCompare(b.offence.title);
  });

  return scoredResults.map((r) => r.offence);
}
