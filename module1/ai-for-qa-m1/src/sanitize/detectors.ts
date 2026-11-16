// Pattern detectors. These are starting points, not a production control (lesson 1.2.3):
// see the README for what they miss.
import type { Kind, Match } from './types.ts';

export interface Detector {
  kind: Kind;
  pattern: RegExp; // must be global
  /** Optional extra check on the matched text (e.g. the Luhn check for card numbers). */
  validate?: (value: string) => boolean;
}

export function luhnValid(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/**
 * Order matters: when two detectors match overlapping text, the earlier one wins
 * (an API key beats the digits inside it, an email beats an IP-looking domain, ...).
 */
export const DETECTORS: Detector[] = [
  // user:password inside a connection string, e.g. postgres://user:secret@host/db (only the user:password part matches)
  { kind: 'url-credentials', pattern: /(?<=:\/\/)[^\s:@\/]+:[^\s@\/]+(?=@)/g },
  { kind: 'api-key', pattern: /\b(?:(?:tsk|sk|pk)_(?:live|test)_[A-Za-z0-9]{16,}(?:_[A-Z]+)?|AKIA[0-9A-Z]{16})\b/g },
  { kind: 'email', pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}\b/g },
  {
    kind: 'card',
    pattern: /\b(?:\d[ -]?){12,18}\d\b/g,
    validate: (v) => {
      const digits = v.replace(/[ -]/g, '');
      return digits.length >= 13 && digits.length <= 19 && luhnValid(digits);
    },
  },
  // Internal hostnames (check 4: internal systems revealed). Covers .internal, .corp, .local, .lan, .intranet suffixes.
  { kind: 'internal-host', pattern: /\b[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.(?:internal|corp|local|lan|intranet)(?:\.[a-z]{2,})?\b/gi },
  // Any UUID version (the lesson's starter regex only accepts versions 1-5 and so misses v7).
  { kind: 'uuid', pattern: /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g },
  { kind: 'ip', pattern: /\b(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\b/g },
  { kind: 'national-id', pattern: /\b\d{3}-\d{2}-\d{4}\b/g }, // US SSN shape
  { kind: 'national-id', pattern: /\b[A-CEGHJ-PR-TW-Z]{2}\d{6}[A-D]\b/g }, // UK National Insurance shape
  // Phones: international with "+", UK mobile in local format, UK mobile digits without the "+".
  { kind: 'phone', pattern: /(?<![\w+])\+\d{1,3}[ -]?(?:\d[ -]?){6,12}\d(?!\d)/g },
  { kind: 'phone', pattern: /(?<![\w+.-])07\d{3}[ -]?\d{6}(?!\d)/g },
  { kind: 'phone', pattern: /(?<![\w.-])447\d{9}(?!\d)/g },
  { kind: 'customer-id', pattern: /\bCUST-\d{4,}\b/g },
  { kind: 'order-number', pattern: /\bORD-\d{4,}\b/g },
  { kind: 'session-id', pattern: /\bsess_[A-Za-z0-9]{8,}\b/g },
];

/** Finds non-overlapping matches in text, earliest detector in DETECTORS winning on overlap. */
export function findMatches(text: string): Match[] {
  const all: (Match & { priority: number })[] = [];
  DETECTORS.forEach((d, priority) => {
    for (const m of text.matchAll(d.pattern)) {
      if (m.index === undefined) continue;
      if (d.validate && !d.validate(m[0])) continue;
      all.push({ start: m.index, end: m.index + m[0].length, kind: d.kind, value: m[0], priority });
    }
  });
  all.sort((a, b) => a.start - b.start || a.priority - b.priority);

  const chosen: Match[] = [];
  const byPriority = [...all].sort((a, b) => a.priority - b.priority || a.start - b.start);
  for (const cand of byPriority) {
    if (!chosen.some((c) => cand.start < c.end && c.start < cand.end)) chosen.push(cand);
  }
  return chosen
    .sort((a, b) => a.start - b.start)
    .map(({ start, end, kind, value }) => ({ start, end, kind, value }));
}

/** Words that suggest a health or other special-category attribute. Flagged for human review, never auto-masked. */
export const HEALTH_KEYWORDS = /\b(disabilit\w*|diagnos\w*|medicat\w*|illness|pregnan\w*|therapy|religio\w*)\b/i;
