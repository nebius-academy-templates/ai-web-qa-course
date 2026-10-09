// Part 1: token estimation using the lesson's rule of thumb (about 0.75 words per token).

export const DEFAULT_WORDS_PER_TOKEN = 0.75;

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateTokens(words: number, wordsPerToken = DEFAULT_WORDS_PER_TOKEN): number {
  return Math.round(words / wordsPerToken);
}

export interface Estimate {
  words: number;
  estimatedTokens: number;
  /** Cross-check for code and logs, which tokenize more densely than prose. */
  charsOver4Tokens: number;
}

export function estimateText(text: string, wordsPerToken = DEFAULT_WORDS_PER_TOKEN): Estimate {
  const words = countWords(text);
  return {
    words,
    estimatedTokens: estimateTokens(words, wordsPerToken),
    charsOver4Tokens: Math.round(text.length / 4),
  };
}
