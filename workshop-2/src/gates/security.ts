/**
 * SPRINT 1 — Security gate.
 *
 * Nothing that leaves this file may contain real customer data. A ticket is
 * written by humans who paste production support threads into it; the prompt
 * is the leak.
 *
 * Two jobs:
 *   maskPII()        strips the real values out of the ticket
 *   scaleWithFaker() puts believable synthetic values back in, so the model
 *                    still has realistic shapes to generate tests against
 *
 * DONE WHEN: the masking report prints, and no email address or phone number
 * appears anywhere in the outgoing prompt.
 *
 * Check yourself with: npm test -- security
 */
import type { MaskingResult, SyntheticUser, TicketData } from '../types.js';

/** Substituted in place of a real value. The tests match these exactly. */
export const EMAIL_TOKEN = '[EMAIL_REDACTED]';
export const PHONE_TOKEN = '[PHONE_REDACTED]';
export const PAYMENT_TOKEN = '[PAYMENT_REDACTED]';

/**
 * Walks every string on the ticket and replaces personal data with the tokens
 * above, leaving the surrounding prose intact.
 *
 * Scan title, description, every acceptance-criterion line, and the content of
 * every attachment — the CSV attached to a ticket is where the real data
 * usually hides.
 *
 * @returns the scrubbed ticket plus a report you can print and defend in a
 *          security review: how many fields were looked at, how many changed,
 *          and how many hits per category.
 */
export function maskPII(input: TicketData): MaskingResult {
  // TODO (sprint 1): mask emails, phone numbers, and payment fragments.
  //
  // Return { masked: TicketData, report: { fieldsScanned, fieldsMasked, byCategory } }
  //
  //   - masked            a deep copy of `input` with every hit replaced by
  //                       EMAIL_TOKEN / PHONE_TOKEN / PAYMENT_TOKEN.
  //                       Never mutate `input` — the caller still needs the
  //                       original to show the human in sprint 3.
  //   - fieldsScanned     every string you looked at: title (1) + description (1)
  //                       + one per acceptance criterion + one per attachment.
  //   - fieldsMasked      how many of those fields changed at all (a field with
  //                       three emails in it counts once).
  //   - byCategory        total hits per category across all fields, always
  //                       carrying all three keys: { email, phone, payment }.
  //                       A zero is a finding too — report it, don't omit it.
  //
  // Patterns that cover the fixture ticket:
  //   email    /[\w.+-]+@[\w-]+\.[\w.]+/g
  //   phone    international and grouped forms: +40 721 555 019, (555) 019-2837,
  //            555-019-2837 — at least 7 digits with separators
  //   payment  16-digit card numbers, grouped or not, and IBAN-shaped strings
  //
  // Run payment BEFORE phone. A 16-digit card matches nearly every phone
  // pattern you will write, and whichever rule runs first wins the digits.
  // Guard the phone rule with a minimum digit count (7) or it will happily
  // redact "1249.00" and a six-digit postcode.
  //
  // Be greedy rather than clever. A false positive costs a slightly odd prompt;
  // a false negative costs a customer's phone number in someone's API logs.
  throw new Error('Not implemented — sprint 1');
}

/**
 * Generates synthetic people to stand in for the ones you just masked out, so
 * the generated tests have realistic data to drive forms with.
 *
 * Deterministic: the same seed must always produce the same list, or the
 * generated tests stop being reproducible and every run is a diff.
 *
 * @param count how many users to produce
 * @param seed  faker seed; the default keeps runs reproducible across machines
 */
export function scaleWithFaker(count: number, seed = 424242): SyntheticUser[] {
  // TODO (sprint 1): return `count` synthetic users using @faker-js/faker.
  //
  //   import { faker } from '@faker-js/faker';
  //   faker.seed(seed);            // <- do this FIRST, before any generation
  //   then build { name, email, phone, city, zip } `count` times.
  //
  // The tests check that calling this twice with the same seed gives identical
  // output, and that two different seeds do not.
  throw new Error('Not implemented — sprint 1');
}
