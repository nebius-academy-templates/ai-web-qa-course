// STARTER: pattern detectors for the PII scanner (lesson 1.2.3). Regexes find shapes, not people:
// they will miss names in free text and will flag fictional data too. Run: npm run test:starter

export type Kind = 'email' | 'phone' | 'uuid' | 'ip' | 'card';

export interface Match { start: number; end: number; kind: Kind; value: string }

/** Luhn check for card numbers (digits only). */
export function luhnValid(digits: string): boolean {
  // TODO: from the right, double every second digit, subtract 9 when over 9, sum must be divisible by 10
  throw new Error('TODO: luhnValid');
}

export const PATTERNS: Record<Kind, RegExp> = {
  email: /TODO/g, // TODO
  phone: /TODO/g, // TODO: international "+" numbers such as +44 7700 900101
  uuid: /TODO/g, // TODO: 8-4-4-4-12 hex. Accept ANY version digit (1-8), not only 1-5.
  ip: /TODO/g, // TODO: dotted IPv4 with octets 0-255
  card: /TODO/g, // TODO: 13-19 digits with optional spaces or dashes; keep only Luhn-valid matches
};

export function findMatches(text: string): Match[] {
  // TODO: run each pattern, drop invalid cards, sort by start. (Stretch: remove overlaps.)
  throw new Error('TODO: findMatches');
}
