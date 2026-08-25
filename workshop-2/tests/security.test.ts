/**
 * SPRINT 1 — this file fails until src/gates/security.ts is implemented.
 *
 * It is the specification. Everything asserted here is named in the doc
 * comment on maskPII()/scaleWithFaker(); nothing is a surprise.
 */
import { describe, expect, it } from 'vitest';
import { EMAIL_TOKEN, PAYMENT_TOKEN, PHONE_TOKEN, maskPII, scaleWithFaker } from '../src/gates/security.js';
import type { TicketData } from '../src/types.js';

/**
 * Five scannable fields: title, description, 2 acceptance criteria,
 * 1 attachment. Four of them contain something that must not leave the box.
 */
const TICKET: TicketData = {
  id: 'TS-142',
  title: 'Checkout rejects orders from ana.popescu@example-mail.ro',
  description:
    'Customer called from +40 721 555 019, then again from 555-019-2837. ' +
    'Card on file 4539 8123 4567 8912, never charged.',
  acceptanceCriteria: [
    'The order is placed and order-success becomes visible.',
    'A receipt is emailed to m.declerck@bureau-declerck.example within a minute.',
  ],
  attachments: [
    {
      name: 'users.csv',
      contentType: 'text/csv',
      content: 'name,email\nAna Popescu,ana.popescu@example-mail.ro\n',
    },
  ],
};

/** Everything the masked ticket is made of, as one blob to sweep. */
function allText(ticket: TicketData): string {
  return [
    ticket.title,
    ticket.description,
    ...ticket.acceptanceCriteria,
    ...ticket.attachments.map((a) => a.content),
  ].join('\n');
}

const ANY_EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/;
const ANY_PHONE = /(?:\+\d[\d ().-]{6,})|(?:\d{3}[ .-]\d{3}[ .-]\d{4})/;

describe('SPRINT 1 — security gate', () => {
  it('masks every email, phone and payment fragment, and reports what it did', () => {
    const { masked, report } = maskPII(TICKET);
    const text = allText(masked);

    // --- The observable from the doc comment -------------------------------
    expect(text).not.toMatch(ANY_EMAIL);
    expect(text).not.toMatch(ANY_PHONE);
    expect(text).not.toContain('4539 8123 4567 8912');

    // The tokens went in where the values came out.
    expect(masked.title).toBe(`Checkout rejects orders from ${EMAIL_TOKEN}`);
    expect(masked.description).toContain(PHONE_TOKEN);
    expect(masked.description).toContain(PAYMENT_TOKEN);
    expect(masked.attachments[0]?.content).toContain(EMAIL_TOKEN);

    // Prose survives. Masking is not deletion.
    expect(masked.acceptanceCriteria[0]).toBe(TICKET.acceptanceCriteria[0]);
    expect(masked.description).toContain('never charged');
    expect(masked.id).toBe('TS-142');

    // --- The input is untouched -------------------------------------------
    // Sprint 3 shows the human the original, so it has to still exist.
    expect(TICKET.title).toContain('ana.popescu@example-mail.ro');

    // --- The report -------------------------------------------------------
    expect(report.fieldsScanned).toBe(5); // title + description + 2 AC + 1 attachment
    expect(report.fieldsMasked).toBe(4);  // everything except the clean AC
    expect(Object.keys(report.byCategory).sort()).toEqual(['email', 'payment', 'phone']);
    expect(report.byCategory.email).toBe(3);
    expect(report.byCategory.payment).toBe(1);
    // Phone grouping is a judgement call — two numbers, at least two hits.
    expect(report.byCategory.phone).toBeGreaterThanOrEqual(2);

    // --- Synthetic replacements -------------------------------------------
    const users = scaleWithFaker(5);
    expect(users).toHaveLength(5);
    for (const user of users) {
      expect(user.name).toBeTruthy();
      expect(user.email).toMatch(ANY_EMAIL);
      expect(user.phone).toBeTruthy();
      expect(user.city).toBeTruthy();
      expect(user.zip).toBeTruthy();
    }
    // No synthetic user may accidentally be a real one from the ticket.
    expect(users.map((u) => u.email)).not.toContain('ana.popescu@example-mail.ro');

    // Same seed, same people — otherwise every run is a diff.
    expect(scaleWithFaker(5)).toEqual(users);
    expect(scaleWithFaker(5, 1)).not.toEqual(scaleWithFaker(5, 2));
  });
});
