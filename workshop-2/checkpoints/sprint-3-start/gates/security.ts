/**
 * SPRINT 1 — Security gate. ✅ SOLVED (checkpoint copy)
 *
 * DONE WHEN: the masking report prints, and no email address or phone
 * number appears anywhere in the outgoing prompt.
 *
 * Check yourself with: npm test -- security
 */
import { faker } from '@faker-js/faker';
import type { MaskingReport, MaskingResult, SyntheticUser, TicketData } from '../types.js';

export const EMAIL_TOKEN = '[EMAIL_REDACTED]';
export const PHONE_TOKEN = '[PHONE_REDACTED]';
export const PAYMENT_TOKEN = '[PAYMENT_REDACTED]';

/**
 * Order matters. A 16-digit card number matches almost any phone pattern, so
 * payment runs first and takes the digits off the board; email runs before
 * phone so an address with digits in it is gone before phone gets a look.
 */
const RULES: readonly { category: string; pattern: RegExp; token: string; minDigits?: number }[] = [
  // Card numbers (13-19 digits, optionally grouped) and IBAN-shaped strings.
  { category: 'payment', pattern: /\b(?:\d[ -]?){12,18}\d\b/g, token: PAYMENT_TOKEN },
  { category: 'payment', pattern: /\b[A-Z]{2}\d{2}[ ]?(?:[A-Z0-9]{4}[ ]?){3,7}[A-Z0-9]{1,4}\b/g, token: PAYMENT_TOKEN },
  { category: 'email', pattern: /[\w.+-]+@[\w-]+\.[\w.]+/g, token: EMAIL_TOKEN },
  // Phones: a run of digits and separators holding at least 7 actual digits.
  // The minDigits guard is what stops "1249.00" and a 6-digit zip from being
  // swallowed as phone numbers.
  { category: 'phone', pattern: /\+?\(?\d[\d\s().-]{5,}\d/g, token: PHONE_TOKEN, minDigits: 7 },
];

function countDigits(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

/** Masks one string, returning the result and the per-category hit counts. */
function maskField(value: string): { text: string; hits: Record<string, number> } {
  const hits: Record<string, number> = { email: 0, phone: 0, payment: 0 };
  let text = value;

  for (const rule of RULES) {
    text = text.replace(rule.pattern, (match) => {
      if (rule.minDigits && countDigits(match) < rule.minDigits) return match;
      hits[rule.category] = (hits[rule.category] ?? 0) + 1;
      return rule.token;
    });
  }

  return { text, hits };
}

export function maskPII(input: TicketData): MaskingResult {
  const report: MaskingReport = {
    fieldsScanned: 0,
    fieldsMasked: 0,
    byCategory: { email: 0, phone: 0, payment: 0 },
  };

  const scan = (value: string): string => {
    report.fieldsScanned += 1;
    const { text, hits } = maskField(value);
    if (text !== value) report.fieldsMasked += 1;
    for (const [category, count] of Object.entries(hits)) {
      report.byCategory[category] = (report.byCategory[category] ?? 0) + count;
    }
    return text;
  };

  // A fresh object throughout — the caller still needs the original for the
  // sprint-3 diff, so nothing here mutates `input`.
  const masked: TicketData = {
    id: input.id,
    title: scan(input.title),
    description: scan(input.description),
    acceptanceCriteria: input.acceptanceCriteria.map(scan),
    attachments: input.attachments.map((attachment) => ({
      ...attachment,
      content: scan(attachment.content),
    })),
  };

  return { masked, report };
}

export function scaleWithFaker(count: number, seed = 424242): SyntheticUser[] {
  // Seed first, then generate — seeding after the first call does nothing.
  faker.seed(seed);

  return Array.from({ length: count }, () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }),
      phone: faker.phone.number({ style: 'international' }),
      city: faker.location.city(),
      zip: faker.location.zipCode(),
    };
  });
}
