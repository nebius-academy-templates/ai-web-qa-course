#!/usr/bin/env node
/**
 * STAGE 1 — the read-off-the-screen summary.
 *
 * Reads both captures and answers one question: did the gate actually keep
 * the customers' data out of the prompt?
 *
 * Exits non-zero if any real value from TS-142 survived into the gated
 * capture. A demo that silently passes while leaking is worse than no demo.
 *
 *   npm run demo:compare
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getTicket } from '../../src/adapters/fixture.js';
import { OUTPUT_DIR, heading } from './_shared.js';

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/g;
const PHONE = /\+?\(?\d[\d\s().-]{5,}\d/g;
const CARD = /\b(?:\d[ -]?){12,18}\d\b/g;

/** The synthetic block is *meant* to hold realistic-looking people. */
const SYNTHETIC_MARKER = 'SYNTHETIC TEST DATA';

function ticketBodyOf(prompt: string): string {
  const i = prompt.indexOf(SYNTHETIC_MARKER);
  return i === -1 ? prompt : prompt.slice(0, i);
}

function countDigits(s: string): number {
  return (s.match(/\d/g) ?? []).length;
}

async function load(name: string): Promise<string> {
  const full = path.join(OUTPUT_DIR, name);
  try {
    return await readFile(full, 'utf8');
  } catch {
    console.error(`Missing ${full}`);
    console.error('Run `npm run demo:gateless` and `npm run demo:gated` first.');
    process.exit(2);
  }
}

/**
 * Ground truth, taken from the ticket itself rather than a hardcoded list, so
 * this stays honest if fixtures/ticket.json or users.csv ever change.
 */
async function realPII(): Promise<{ emails: string[]; phones: string[]; cards: string[] }> {
  const t = await getTicket('TS-142');
  const blob = [t.title, t.description, ...t.acceptanceCriteria, ...t.attachments.map((a) => a.content)].join('\n');
  const uniq = (xs: string[]) => [...new Set(xs)];
  const cards = uniq(blob.match(CARD) ?? []);
  return {
    emails: uniq(blob.match(EMAIL) ?? []),
    // A card number also satisfies the phone pattern, so drop anything already
    // accounted for as payment — otherwise the facilitator sees it listed twice.
    phones: uniq((blob.match(PHONE) ?? []).filter((m) => countDigits(m) >= 7))
      .filter((m) => !cards.some((c) => c.includes(m) || m.includes(c))),
    cards,
  };
}

const gateless = await load('gateless-prompt.txt');
const gated = await load('gated-prompt.txt');
const pii = await realPII();

// ---------------------------------------------------------------- size diff
const words = (s: string) => s.trim().split(/\s+/).length;
heading('SIZE');
console.log(`gateless : ${Buffer.byteLength(gateless)} bytes, ${words(gateless)} words`);
console.log(`gated    : ${Buffer.byteLength(gated)} bytes, ${words(gated)} words`);
console.log(`delta    : ${Buffer.byteLength(gated) - Buffer.byteLength(gateless)} bytes, ` +
  `${words(gated) - words(gateless)} words`);

// ------------------------------------------------------- literal PII checks
function present(haystack: string, values: string[]): string[] {
  return values.filter((v) => haystack.includes(v));
}

const inGateless = {
  emails: present(gateless, pii.emails),
  phones: present(gateless, pii.phones),
  cards: present(gateless, pii.cards),
};
const inGated = {
  emails: present(gated, pii.emails),
  phones: present(gated, pii.phones),
  cards: present(gated, pii.cards),
};

heading('PII PRESENT IN GATELESS');
const gatelessTotal = inGateless.emails.length + inGateless.phones.length + inGateless.cards.length;
if (gatelessTotal === 0) {
  console.log('none found — which is wrong. The gateless run is supposed to leak.');
} else {
  for (const e of inGateless.emails) console.log(`  email    ${e}`);
  for (const p of inGateless.phones) console.log(`  phone    ${p}`);
  for (const c of inGateless.cards) console.log(`  payment  ${c}`);
  console.log(`\n  ${gatelessTotal} real value(s) from TS-142, verbatim in the outgoing prompt.`);
}

heading('PII PRESENT IN GATED');
const gatedTotal = inGated.emails.length + inGated.phones.length + inGated.cards.length;
if (gatedTotal === 0) {
  console.log('none found');
} else {
  for (const e of inGated.emails) console.log(`  LEAKED email    ${e}`);
  for (const p of inGated.phones) console.log(`  LEAKED phone    ${p}`);
  for (const c of inGated.cards) console.log(`  LEAKED payment  ${c}`);
}

// --------------------------------------------- generic sweep of the body
// Scoped to the ticket body: the synthetic block below it is supposed to be
// full of realistic-looking people, and flagging those would be crying wolf.
const strayEmails = [...new Set(ticketBodyOf(gated).match(EMAIL) ?? [])];
const strayPhones = [...new Set((ticketBodyOf(gated).match(PHONE) ?? []).filter((m) => countDigits(m) >= 7))];

heading('GENERIC SWEEP — gated ticket body, anything email/phone shaped');
console.log(strayEmails.length + strayPhones.length === 0
  ? 'nothing email- or phone-shaped outside the synthetic block'
  : [...strayEmails.map((e) => `  ${e}`), ...strayPhones.map((p) => `  ${p}`)].join('\n'));

const tokens = ['[EMAIL_REDACTED]', '[PHONE_REDACTED]', '[PAYMENT_REDACTED]'];
heading('REDACTION TOKENS IN GATED');
for (const t of tokens) {
  const n = gated.split(t).length - 1;
  console.log(`  ${t.padEnd(20)} ${n}`);
}

// ------------------------------------------------------------------ verdict
const leaked = gatedTotal > 0 || strayEmails.length > 0 || strayPhones.length > 0;
heading(leaked ? 'VERDICT: FAIL' : 'VERDICT: PASS');
if (leaked) {
  console.log('Real data from TS-142 survived the gate and is sitting in');
  console.log(path.join(OUTPUT_DIR, 'gated-prompt.txt'));
  console.log('\nDo NOT put that file on a shared screen. Fix the gate first.');
  process.exit(1);
}
console.log('The gated prompt carries no real values from TS-142.');
console.log('Safe to show side by side.');
